import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import {
  MoreVertical,
  Flag,
  UserX,
  MessageCircle,
  Calendar,
  MapPin,
  Heart,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import { moderationService } from '../../services/moderationService.js';
import { getInitials, generateAvatarColor, formatTimestamp } from '../../utils/helpers.js';

export const UserPublicProfile = ({ targetUser, onClose }) => {
  const { user } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBlockUser = async () => {
    if (!user || !targetUser) return;

    const confirmed = confirm(`¿Estás seguro de que querés bloquear a ${targetUser.nickname}?`);
    if (!confirmed) return;

    setLoading(true);

    const result = await userService.blockUser(user.uid, targetUser.uid);

    if (result.success) {
      setIsBlocked(true);
      alert(`${targetUser.nickname} ha sido bloqueado`);
    } else {
      alert('Error al bloquear usuario');
    }

    setLoading(false);
  };

  const handleReportUser = async () => {
    if (!user || !targetUser) return;

    const reason = prompt('¿Por qué querés reportar a este usuario?');
    if (!reason) return;

    setLoading(true);

    const result = await moderationService.reportUser(
      user.uid,
      targetUser.uid,
      'inappropriate_content',
      reason
    );

    if (result.success) {
      alert('Usuario reportado correctamente');
    } else {
      alert('Error al reportar usuario');
    }

    setLoading(false);
  };

  const handleSendMessage = () => {
    // This would typically open a private chat or navigate to a messaging interface
    alert('Función de mensajes privados próximamente disponible');
  };

  if (!targetUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto glass-effect border-none">
        <CardHeader className="border-b border-white border-opacity-30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Perfil de Usuario</CardTitle>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={loading} className="text-white hover:bg-white hover:bg-opacity-20">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect border-none text-white">
                  <DropdownMenuItem onClick={handleReportUser} className="hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-20">
                    <Flag className="h-4 w-4 mr-2 text-white text-opacity-80" />
                    Reportar usuario
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBlockUser} className="hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-20">
                    <UserX className="h-4 w-4 mr-2 text-white text-opacity-80" />
                    Bloquear usuario
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white hover:bg-opacity-20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20 border-2 border-white border-opacity-50 shadow-lg">
              {targetUser.profilePicUrl ? (
                <AvatarImage src={targetUser.profilePicUrl} alt="Foto de perfil" />
              ) : (
                <AvatarFallback
                  style={{ backgroundColor: generateAvatarColor(targetUser.nickname) }}
                  className="text-white text-lg font-semibold"
                >
                  {getInitials(targetUser.nickname)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-xl font-bold text-white">{targetUser.nickname}</h2>
                {targetUser.isVIP && (
                  <Badge variant="secondary" className="bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-400 border-opacity-50">
                    ⭐ VIP
                  </Badge>
                )}
              </div>

              {targetUser.bio && (
                <p className="text-white text-opacity-70 text-sm">{targetUser.bio}</p>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            {targetUser.age && (
              <div className="flex items-center space-x-2 text-sm text-white text-opacity-70">
                <Calendar className="h-4 w-4" />
                <span>{targetUser.age} años</span>
              </div>
            )}

            {targetUser.gender && (
              <div className="flex items-center space-x-2 text-sm text-white text-opacity-70">
                <Heart className="h-4 w-4" />
                <span className="capitalize">{targetUser.gender}</span>
              </div>
            )}

            {targetUser.location && (
              <div className="flex items-center space-x-2 text-sm text-white text-opacity-70">
                <MapPin className="h-4 w-4" />
                <span>{targetUser.location}</span>
              </div>
            )}
          </div>

          {/* Interests */}
          {targetUser.interests && targetUser.interests.length > 0 && (
            <div>
              <h3 className="font-semibold text-white text-opacity-90 mb-2">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {targetUser.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="bg-white bg-opacity-10 text-white border border-white border-opacity-20 text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="pt-4 border-t border-white border-opacity-30">
            <h3 className="font-semibold text-white text-opacity-90 mb-2">Información</h3>
            <div className="text-sm text-white text-opacity-70 space-y-1">
              {targetUser.createdAt && (
                <p>
                  <strong>Miembro desde:</strong>{' '}
                  {formatTimestamp(targetUser.createdAt)}
                </p>
              )}
              {targetUser.lastSeen && (
                <p>
                  <strong>Última conexión:</strong>{' '}
                  {formatTimestamp(targetUser.lastSeen)}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isBlocked && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar mensaje
              </Button>
            </div>
          )}

          {isBlocked && (
            <div className="text-center py-4">
              <p className="text-white text-opacity-70">Usuario bloqueado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


