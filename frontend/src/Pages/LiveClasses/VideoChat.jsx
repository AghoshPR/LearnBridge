import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  MessageSquare,
  X,
  User as UserIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Api from "../Services/Api";

const RemoteVideo = ({ stream, name, isVideoOn }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full bg-gray-900 rounded-3xl relative flex flex-col items-center justify-center border border-gray-800 shadow-2xl overflow-hidden aspect-video max-h-[400px]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-500 ${stream ? "opacity-100" : "opacity-0"}`}
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-inner">
            {name?.charAt(0).toUpperCase() || "P"}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg z-10 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${isVideoOn ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        {name || "Participant"}
      </div>
    </div>
  );
};

const VideoChat = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { username: reduxUsername } = useSelector((state) => state.auth);
  const username = reduxUsername || "User";

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const localVideoRef = useRef(null);
  const ws = useRef(null);
  const peerConnections = useRef({});
  const participantNames = useRef({});
  const localStream = useRef(null);
  const localVideoTrack = useRef(null);
  const localAudioTrack = useRef(null);
  const localPeerId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const makingOffers = useRef({});

  const [remoteStreams, setRemoteStreams] = useState({});
  const [participants, setParticipants] = useState({}); // peerId -> { name }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting, open, closed, reconnecting
  const chatEndRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await Api.get(`/student/liveclass/messages/${classId}/`);
        if (res.data.messages) {
          const formattedMessages = res.data.messages.map((m) => ({
            id: m.id,
            user: m.user,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    fetchHistory();
  }, [classId]);

  const remoteParticipantIds = Object.keys(participants);
  const totalParticipants = 1 + remoteParticipantIds.length;

  const getGridClass = () => {
    if (totalParticipants === 1) return "flex items-center justify-center";
    if (totalParticipants === 2)
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center";
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center";
  };

  // 🔵 WebRTC & signaling
  useEffect(() => {
    let socket;

    const connect = () => {
      console.log("Attempting to connect to WebSocket...");

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";

      const host =
        window.location.hostname === "localhost"
          ? "localhost:8000"
          : "api.learnbridge.aghosh.site";

      socket = new WebSocket(`${protocol}://${host}/ws/liveclass/${classId}/`);

      ws.current = socket;

      socket.onopen = () => {
        console.log("Connected to room", classId, "as", username);
        setConnectionStatus("open");
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

        socket.send(
          JSON.stringify({
            type: "join",
            from: localPeerId,
            name: username,
            isVideoOn: isVideoOn,
            isMicOn: isMicOn,
          }),
        );
      };

      const createPeerConnection = (peerId, name, remoteVideoOn = true) => {
        if (peerConnections.current[peerId]) {
          if (name) {
            participantNames.current[peerId] = name;
            setParticipants((prev) => ({
              ...prev,
              [peerId]: { ...prev[peerId], name, isVideoOn: remoteVideoOn },
            }));
          }
          return peerConnections.current[peerId];
        }

        console.log("Initializing WebRTC with", peerId, name);
        if (name) {
          participantNames.current[peerId] = name;
          setParticipants((prev) => ({
            ...prev,
            [peerId]: { name, isVideoOn: remoteVideoOn },
          }));
        }

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
          ],
        });

        pc.onicecandidate = (event) => {
          if (event.candidate && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "candidate",
                candidate: event.candidate,
                to: peerId,
                from: localPeerId,
              }),
            );
          }
        };

        pc.ontrack = (event) => {
          console.log("Track received from", peerId, event.track.kind);

          setRemoteStreams((prev) => ({
            ...prev,
            [peerId]: event.streams[0],
          }));

          setParticipants((prev) => ({
            ...prev,
            [peerId]: {
              ...prev[peerId],
              isVideoOn: true,
            },
          }));
        };

        pc.onnegotiationneeded = async () => {
          try {
            if (makingOffers.current[peerId]) return;
            makingOffers.current[peerId] = true;
            const offer = await pc.createOffer();
            if (pc.signalingState !== "stable") return;
            await pc.setLocalDescription(offer);
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "offer",
                  offer: pc.localDescription,
                  to: peerId,
                  from: localPeerId,
                  name: username,
                }),
              );
            }
          } catch (err) {
            console.error("Negotiation failed:", err);
          } finally {
            makingOffers.current[peerId] = false;
          }
        };

        if (localStream.current) {
          localStream.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStream.current);
          });
        }

        peerConnections.current[peerId] = pc;
        return pc;
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.from === localPeerId) return;

        // Deduplication: Use the Ref to check for existing sessions with the same name
        if (data.name && ["join", "offer", "join_ack"].includes(data.type)) {
          Object.keys(participantNames.current).forEach((id) => {
            if (
              participantNames.current[id] === data.name &&
              id !== data.from
            ) {
              console.log(
                `Deduplicating user ${data.name}: removing old session ${id}`,
              );
              if (peerConnections.current[id])
                peerConnections.current[id].close();
              delete peerConnections.current[id];
              delete participantNames.current[id];

              setParticipants((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
              });
              setRemoteStreams((rs) => {
                const next = { ...rs };
                delete next[id];
                return next;
              });
            }
          });
        }

        if (
          data.type === "chat" ||
          (data.message &&
            ![
              "offer",
              "answer",
              "candidate",
              "join",
              "join_ack",
              "leave",
            ].includes(data.type))
        ) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              user: data.user || "User",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              text: data.message,
            },
          ]);
          return;
        }

        if (data.type === "join") {
          createPeerConnection(data.from, data.name, data.isVideoOn !== false);
          socket.send(
            JSON.stringify({
              type: "join_ack",
              to: data.from,
              from: localPeerId,
              name: username,
              isVideoOn: isVideoOn,
              isMicOn: isMicOn,
            }),
          );
        } else if (data.type === "join_ack" && data.to === localPeerId) {
          createPeerConnection(data.from, data.name, data.isVideoOn !== false);
        } else if (data.type === "offer" && data.to === localPeerId) {
          const pc = createPeerConnection(data.from, data.name);
          const polite = localPeerId < data.from;
          if (pc.signalingState !== "stable") {
            if (!polite) return;
            await Promise.all([
              pc.setLocalDescription({ type: "rollback" }),
              pc.setRemoteDescription(new RTCSessionDescription(data.offer)),
            ]);
          } else {
            await pc.setRemoteDescription(
              new RTCSessionDescription(data.offer),
            );
          }
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                type: "answer",
                answer: pc.localDescription,
                to: data.from,
                from: localPeerId,
                name: username,
              }),
            );
          }
        } else if (data.type === "answer" && data.to === localPeerId) {
          const pc = peerConnections.current[data.from];
          if (pc && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(
              new RTCSessionDescription(data.answer),
            );
          }
        } else if (data.type === "candidate" && data.to === localPeerId) {
          const pc = peerConnections.current[data.from];
          if (pc) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {}
          }
        } else if (data.type === "media-toggle") {
          setParticipants((prev) => ({
            ...prev,
            [data.from]: {
              ...prev[data.from],
              [data.mediaType === "video" ? "isVideoOn" : "isMicOn"]:
                data.enabled,
            },
          }));
        } else if (data.type === "leave") {
          console.log("Participant left:", data.from, data.name);
          // Try removing by ID
          const peerId = data.from;
          if (peerConnections.current[peerId]) {
            peerConnections.current[peerId].close();
            delete peerConnections.current[peerId];
          }
          delete participantNames.current[peerId];

          // Also try removing by name just in case the ID changed (fallback)
          if (data.name) {
            Object.keys(participantNames.current).forEach((id) => {
              if (participantNames.current[id] === data.name) {
                if (peerConnections.current[id])
                  peerConnections.current[id].close();
                delete peerConnections.current[id];
                delete participantNames.current[id];
              }
            });
          }

          setParticipants((prev) => {
            const next = { ...prev };
            delete next[peerId];
            // Fallback removal by name
            if (data.name) {
              Object.keys(next).forEach((id) => {
                if (next[id].name === data.name) delete next[id];
              });
            }
            return next;
          });
          setRemoteStreams((prev) => {
            const next = { ...prev };
            delete next[peerId];

            if (data.name) {
              Object.keys(participantNames.current).forEach((id) => {
                // cleanup remote streams not in current participants
              });
            }
            return next;
          });
        }
      };

      socket.onerror = (e) => {
        console.error("WS Error", e);
        setConnectionStatus("closed");
      };

      socket.onclose = (e) => {
        console.log(
          "Connection closed, attempting reconnect in 3s...",
          e.reason,
        );
        setConnectionStatus("reconnecting");
        reconnectTimeout.current = setTimeout(connect, 3000);
      };
    };

    connect();

    const sendLeaveSignal = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "leave",
            from: localPeerId,
            name: username,
          }),
        );
      }
    };

    window.addEventListener("beforeunload", sendLeaveSignal);

    return () => {
      window.removeEventListener("beforeunload", sendLeaveSignal);
      sendLeaveSignal();
      if (localStream.current) {
        localStream.current.getTracks().forEach((t) => t.stop());
      }
      Object.keys(peerConnections.current).forEach((id) =>
        peerConnections.current[id].close(),
      );
      peerConnections.current = {};
      if (socket) socket.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [classId]);

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const track = stream.getVideoTracks()[0];
        localVideoTrack.current = track;

        if (!localStream.current) localStream.current = new MediaStream();
        localStream.current.addTrack(track);
        if (localVideoRef.current)
          localVideoRef.current.srcObject = localStream.current;

        Object.values(peerConnections.current).forEach((pc) => {
          const senders = pc.getSenders();
          const sender = senders.find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(track);
          else pc.addTrack(track, localStream.current);
        });

        setIsVideoOn(true);
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              type: "media-toggle",
              mediaType: "video",
              enabled: true,
              from: localPeerId,
              name: username,
            }),
          );
        }
      } catch (err) {
        alert("Camera failed");
      }
    } else {
      if (localVideoTrack.current) {
        localVideoTrack.current.stop();
        if (localStream.current)
          localStream.current.removeTrack(localVideoTrack.current);
        localVideoTrack.current = null;
      }
      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(null);
      });
      setIsVideoOn(false);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "media-toggle",
            mediaType: "video",
            enabled: false,
            from: localPeerId,
            name: username,
          }),
        );
      }
    }
  };

  const toggleAudio = async () => {
    if (!isMicOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const track = stream.getAudioTracks()[0];
        localAudioTrack.current = track;

        if (!localStream.current) localStream.current = new MediaStream();
        localStream.current.addTrack(track);

        Object.values(peerConnections.current).forEach((pc) => {
          const senders = pc.getSenders();
          const sender = senders.find((s) => s.track?.kind === "audio");
          if (sender) sender.replaceTrack(track);
          else pc.addTrack(track, localStream.current);
        });

        setIsMicOn(true);
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              type: "media-toggle",
              mediaType: "audio",
              enabled: true,
              from: localPeerId,
              name: username,
            }),
          );
        }
      } catch (err) {
        alert("Mic failed");
      }
    } else {
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        if (localStream.current)
          localStream.current.removeTrack(localAudioTrack.current);
        localAudioTrack.current = null;
      }
      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "audio");
        if (sender) sender.replaceTrack(null);
      });
      setIsMicOn(false);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "media-toggle",
            mediaType: "audio",
            enabled: false,
            from: localPeerId,
            name: username,
          }),
        );
      }
    }
  };

  const handleEndCall = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "leave",
          from: localPeerId,
          name: username,
        }),
      );
    }
    if (localStream.current)
      localStream.current.getTracks().forEach((t) => t.stop());
    Object.keys(peerConnections.current).forEach((id) =>
      peerConnections.current[id].close(),
    );
    if (ws.current) ws.current.close();
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Classroom {classId}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">Secure Live Session</p>
              {connectionStatus === "reconnecting" && (
                <span className="text-[10px] text-yellow-500 font-bold animate-pulse">
                  • Reconnecting...
                </span>
              )}
              {connectionStatus === "closed" && (
                <span className="text-[10px] text-red-500 font-bold">
                  • Disconnected
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>{" "}
            Live
          </div>
          <button
            className="md:hidden p-2 bg-gray-800 rounded-full"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Video Layout */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
          <div className={`flex-1 gap-6 min-h-0 ${getGridClass()}`}>
            {/* Local Video Tile */}
            <div className="w-full h-full bg-gray-900 rounded-3xl relative flex flex-col items-center justify-center border border-gray-800 shadow-2xl overflow-hidden aspect-video max-h-[400px]">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-500 ${!isVideoOn ? "opacity-0" : "opacity-100"}`}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg z-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                You ({username})
              </div>
            </div>

            {/* Remote Video Tiles */}
            {remoteParticipantIds.map((id) => (
              <RemoteVideo
                key={id}
                name={participants[id]?.name}
                stream={remoteStreams[id]}
                isVideoOn={participants[id]?.isVideoOn !== false}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-6 z-50">
            <button
              onClick={toggleAudio}
              className={`p-5 rounded-full transition-all hover:scale-110 shadow-2xl ${!isMicOn ? "bg-red-500 text-white" : "bg-gray-800 text-white border border-gray-700"}`}
            >
              {!isMicOn ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-5 rounded-full transition-all hover:scale-110 shadow-2xl ${!isVideoOn ? "bg-red-500 text-white" : "bg-gray-800 text-white border border-gray-700"}`}
            >
              {!isVideoOn ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleEndCall}
              className="p-5 rounded-full bg-red-600 hover:bg-red-700 transition-all hover:scale-110 shadow-2xl"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 z-[60] w-[85vw] max-w-sm lg:static lg:w-80 transform transition-transform duration-500 ease-out bg-gray-900 border-l border-gray-800 flex flex-col ${isChatOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
        >
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Live Chat
            </h2>
            <button
              className="lg:hidden p-2 hover:bg-gray-800 rounded-full"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold mb-1">
                  {m.user}
                </span>
                <p className="text-sm bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700/50">
                  {m.text}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            className="p-4 bg-gray-900 border-t border-gray-800"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newMessage.trim()) return;
              if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ message: newMessage }));
                setNewMessage("");
              } else {
                console.warn("WebSocket not open. Status:", connectionStatus);
              }
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  connectionStatus === "open"
                    ? "Say something..."
                    : "Reconnecting..."
                }
                disabled={connectionStatus !== "open"}
                className="flex-1 bg-gray-800 border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={connectionStatus !== "open"}
                className="p-2 bg-blue-600 rounded-xl disabled:bg-gray-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;
