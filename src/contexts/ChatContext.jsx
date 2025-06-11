import { createContext, useContext, useState, useEffect } from 'react';
import { roomService } from '../services/roomService.js';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to rooms
    const unsubscribeRooms = roomService.subscribeToRooms((roomsData) => {
      setRooms(roomsData);
      setLoading(false);
    });

    return unsubscribeRooms;
  }, []);

  const joinRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]); // Clear previous messages
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setMessages([]);
    setOnlineUsers([]);
  };

  const value = {
    rooms,
    currentRoom,
    messages,
    onlineUsers,
    loading,
    joinRoom,
    leaveRoom,
    setMessages,
    setOnlineUsers
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};


