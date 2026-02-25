import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, PhoneOff, Send, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const VideoChat = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false); // Default closed on mobile, auto-open handled by CSS
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Mock data
  const mainSpeaker = {
    name: "Michael Chang",
    role: "Instructor",
    initials: "MC",
    // Appoximated gradient background
    bgColor: "from-blue-50 via-gray-100 to-orange-50"
  };

  const participants = [
    { id: 1, name: "Sarah Miller", initials: "SM", bgColor: "bg-red-100/60" },
    { id: 2, name: "John Davis", initials: "JD", bgColor: "bg-blue-100/60" },
    { id: 3, name: "Emily Wilson", initials: "EW", bgColor: "bg-purple-100/60" },
    { id: 4, name: "Alex Kumar", initials: "AK", bgColor: "bg-green-100/60" },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "Instructor", time: "06:14 PM", text: "Welcome to the live class! Feel free to ask questions." }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newMessage
    }]);
    setNewMessage("");
  };

  const ws = useRef(null)
  const peerConnection = useRef(null)


  useEffect(()=>{

    ws.current = new WebSocket(
        `ws://localhost:8000/ws/liveclass/${classId}/`
    )

    ws.current.onmessage = async (event) =>{

        const data = JSON.parse(event.data)

        if(data.type === "offer"){

            await peerConnection.current.setRemoteDescription(data.offer);
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);


            // Send the Answer Back

            ws.current.send(JSON.stringify({
                type: "answer",
                answer: answer
            }));

        }

        if (data.type === "answer") {
            await peerConnection.current.setRemoteDescription(data.answer);
        }

        if (data.type === "candidate") {
            await peerConnection.current.addIceCandidate(data.candidate);
        }

    }

    return () => ws.current.close()

  },[])

//   WebRTC Setup

  const startCall = async ()=>{

    peerConnection.current = new RTCPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    stream.getTracks().forEach(track=>{
        peerConnection.current.addTrack(track,stream)
    })

    peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
        ws.current.send(JSON.stringify({
            type: "candidate",
            candidate: event.candidate
        }));
        }
    };

    const offer = await peerConnection.current.createOffer()
    await peerConnection.current.setLocalDescription(offer)

    ws.current.send(JSON.stringify({
        type: "offer",
        offer: offer
    }))

  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors hidden sm:block">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors sm:hidden">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 leading-tight truncate max-w-[200px] sm:max-w-none">Introduction to TypeScript</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">with Michael Chang</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-500 px-2 sm:px-3 py-1.5 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            LIVE
          </div>
          {/* Mobile Chat Toggle */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors bg-white border border-gray-200 shadow-sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Video Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 pb-24 md:pb-6 overflow-hidden">

          {/* Main Speaker Video */}
          <div className={`flex-1 w-full rounded-2xl bg-gradient-to-br ${mainSpeaker.bgColor} relative overflow-hidden flex items-center justify-center border border-gray-200 mb-4 shadow-sm`}>

            <div className="flex flex-col items-center z-10">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold mb-4 shadow-md">
                {mainSpeaker.initials}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">{mainSpeaker.name}</h2>
              <p className="text-gray-500 text-sm font-medium">{mainSpeaker.role}</p>
            </div>

            {/* Name tag bottom left */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold text-gray-800 shadow-sm border border-gray-100">
              {mainSpeaker.name}
            </div>
          </div>

          {/* Participants Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0 mb-4 md:mb-6 h-[15vh] md:h-[20vh]">
            {participants.map((p) => (
              <div key={p.id} className={`w-full h-full rounded-xl ${p.bgColor} relative flex flex-col items-center justify-center border border-gray-100 shadow-sm overflow-hidden`}>
                <div className="text-xl md:text-2xl font-bold text-gray-400/80 mb-2">
                  {p.initials}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] md:text-xs font-bold text-gray-600 shadow-sm truncate max-w-[calc(100%-16px)]">
                  {p.name}
                </div>
              </div>
            ))}
          </div>

          {/* Control Bar - Fixed at bottom on mobile, relative on desktop */}
          <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-white md:bg-transparent border-t border-gray-200 md:border-none p-4 md:p-0 flex items-center justify-center gap-4 md:gap-6 z-30 shrink-0 mx-auto md:mx-0">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 md:p-4 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${!isMicOn ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-200 text-gray-800 border.border-transparent'}`}
            >
              {!isMicOn ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 md:p-4 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${!isVideoOn ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-200 text-gray-800 border.border-transparent'}`}
            >
              {!isVideoOn ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button className="p-3.5 md:p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

        </div>

        {/* Chat Sidebar Overlay for Mobile */}
        {isChatOpen && (
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsChatOpen(false)}
          />
        )}

        {/* Chat Sidebar */}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm lg:static lg:w-80 
          transform transition-transform duration-300 ease-in-out
          ${isChatOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          bg-white border-l border-gray-200 flex flex-col flex-shrink-0 shadow-2xl lg:shadow-none
        `}>

          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
            <h2 className="font-bold text-gray-900">Live Chat</h2>
            <button
              className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className={`text-sm font-bold ${msg.sender === 'Instructor' ? 'text-gray-900' : 'text-gray-900'}`}>{msg.sender}</span>
                  <span className="text-xs text-gray-400 font-medium">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[90%]">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white shrink-0 mb-4 sm:mb-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2.5 w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </div>
          </form>

        </div>

      </main>
    </div>
  );
};

export default VideoChat;