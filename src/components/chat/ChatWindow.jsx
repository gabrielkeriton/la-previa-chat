import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { ArrowLeft, Users, MoreVertical, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { messageService } from '../../services/messageService.js';
import { MessageInput } from './MessageInput.jsx';
import { MessageItem } from '././MessageItem.jsx';
import { formatMessageTime, getInitials, generateAvatarColor } from '../../utils/helpers.js';

export const ChatWindow = () => {
  const { user, userProfile } = useAuth();
  const { currentRoom, messages, setMessages, leaveRoom } = useChat();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (currentRoom) {
      setLoading(true);
      
      // Subscribe to messages
      unsubscribeRef.current = messageService.subscribeToMessages(
        currentRoom.id,
        (newMessages) => {
          setMessages(newMessages);
          setLoading(false);
        }
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [currentRoom, setMessages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text, type = 'text', mediaUrl = null) => {
    if (!user || !userProfile || !currentRoom) return;

    const result = await messageService.sendMessage(
      currentRoom.id,
      user.uid,
      userProfile.nickname,
      text,
      type,
      mediaUrl
    );

    if (!result.success) {
      console.error('Error sending message:', result.error);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  if (!currentRoom) {
    return null;
  }

  return (
    <div className="flex flex-col h-full glass-effect rounded-lg shadow-lg overflow-hidden">
      {/* Room Header */}
      <Card className="glass-effect rounded-b-none border-b border-white border-opacity-30 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLeaveRoom}
                className="md:hidden text-white hover:bg-white hover:bg-opacity-20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback 
                    style={{ backgroundColor: generateAvatarColor(currentRoom.name) }}
                    className="text-white text-sm font-semibold"
                  >
                    {getInitials(currentRoom.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <CardTitle className="text-lg text-white">{currentRoom.name}</CardTitle>
                  <p className="text-sm text-white text-opacity-70">{currentRoom.topic}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-white text-opacity-70">
                <Users className="h-4 w-4" />
                <span>{currentRoom.participantCount || 0}</span>
              </div>
              
              <Button variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 rounded-none border-x-0 border-t-0 bg-transparent shadow-none">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white border-opacity-70"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-white text-opacity-70">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-white text-opacity-50" />
                  <p>No hay mensajes aún</p>
                  <p className="text-sm">¡Sé el primero en escribir!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === user?.uid}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="glass-effect rounded-t-none border-t border-white border-opacity-30 shadow-none">
        <CardContent className="p-4">
          <MessageInput onSendMessage={handleSendMessage} />
        </CardContent>
      </Card>
    </div>
  );
};


