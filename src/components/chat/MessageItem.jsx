import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { MoreVertical, Flag, UserX, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { moderationService } from '../../services/moderationService.js';
import { userService } from '../../services/userService.js';
import { formatMessageTime, getInitials, generateAvatarColor } from '../../utils/helpers.js';

export const MessageItem = ({ message, isOwn }) => {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleReportMessage = async () => {
    if (!user) return;

    const reason = prompt('¿Por qué querés reportar este mensaje?');
    if (!reason) return;

    const result = await moderationService.reportMessage(
      user.uid,
      message.id,
      message.roomId,
      'inappropriate_content',
      reason
    );

    if (result.success) {
      alert('Mensaje reportado correctamente');
    } else {
      alert('Error al reportar el mensaje');
    }
  };

  const handleBlockUser = async () => {
    if (!user || isOwn) return;

    const confirmed = confirm(`¿Estás seguro de que querés bloquear a ${message.senderName}?`);
    if (!confirmed) return;

    const result = await userService.blockUser(user.uid, message.senderId);

    if (result.success) {
      setIsBlocked(true);
      alert(`${message.senderName} ha sido bloqueado`);
    } else {
      alert('Error al bloquear usuario');
    }
  };

  const playAudio = () => {
    if (!message.mediaUrl) return;

    const audio = new Audio(message.mediaUrl);
    setAudioPlaying(true);
    
    audio.onended = () => setAudioPlaying(false);
    audio.onerror = () => {
      setAudioPlaying(false);
      alert('Error al reproducir el audio');
    };
    
    audio.play().catch(() => {
      setAudioPlaying(false);
      alert('Error al reproducir el audio');
    });
  };

  if (isBlocked) {
    return (
      <div className="text-center text-white text-opacity-60 text-sm py-2">
        Mensaje de usuario bloqueado
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {!isOwn && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback 
              style={{ backgroundColor: generateAvatarColor(message.senderName) }}
              className="text-white text-xs font-semibold"
            >
              {getInitials(message.senderName)}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs text-white text-opacity-70 mb-1 px-2">
              {message.senderName}
            </span>
          )}

          <div
            className={`relative rounded-lg px-3 py-2 max-w-full break-words shadow-lg ${isOwn ? 'bg-indigo-600 text-white' : 'glass-effect text-white'}`}
          >
            {/* Message Content */}
            {message.type === 'text' && (
              <p className="text-sm">{message.text}</p>
            )}

            {message.type === 'image' && (
              <div className="space-y-2">
                <img
                  src={message.mediaUrl}
                  alt="Imagen compartida"
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => window.open(message.mediaUrl, '_blank')}
                />
                {message.text && message.text !== 'Imagen' && (
                  <p className="text-sm text-white text-opacity-80">{message.text}</p>
                )}
              </div>
            )}

            {message.type === 'audio' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={playAudio}
                  disabled={audioPlaying}
                  className={`p-1 ${isOwn ? 'text-white hover:bg-indigo-700' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
                >
                  {audioPlaying ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-sm text-white text-opacity-80">
                  {audioPlaying ? 'Reproduciendo...' : 'Audio'}
                </span>
              </div>
            )}

            {/* Message Options */}
            {!isOwn && (
              <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-white hover:bg-opacity-20">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect border-none text-white">
                    <DropdownMenuItem onClick={handleReportMessage} className="hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-20">
                      <Flag className="h-4 w-4 mr-2 text-white text-opacity-80" />
                      Reportar mensaje
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlockUser} className="hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-20">
                      <UserX className="h-4 w-4 mr-2 text-white text-opacity-80" />
                      Bloquear usuario
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <span className={`text-xs text-white text-opacity-60 mt-1 px-2 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};



