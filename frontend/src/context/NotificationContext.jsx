import React, { createContext, useContext, useEffect, useState, useRef } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/notifications/");

    ws.current.onopen = () => {
      console.log("Notification socket connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNotifications(prev => [
        data.notification,
        ...prev
      ]);
    };

    ws.current.onerror = (err) => {
      console.error("Notification socket error:", err);
    };

    ws.current.onclose = () => {
      console.log("Notification socket closed");
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);