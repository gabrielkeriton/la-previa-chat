import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Users, MessageCircle, Crown, Lock, Sparkles, Zap, Star, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useChat } from '../../contexts/ChatContext.jsx';
import { ROOM_TYPES } from '../../utils/constants.js';

export const RoomList = () => {
  const { isVIP } = useAuth();
  const { rooms, loading, joinRoom } = useChat();
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    const filtered = rooms.filter(room => {
      if (room.type === ROOM_TYPES.VIP_ONLY && !isVIP) {
        return false;
      }
      return true;
    });
    setFilteredRooms(filtered);
  }, [rooms, isVIP]);

  const handleJoinRoom = (room) => {
    joinRoom(room);
  };

  const getRoomIcon = (roomType) => {
    switch (roomType) {
      case ROOM_TYPES.VIP_ONLY:
        return <Crown className="h-6 w-6 text-yellow-300 icon-glow-strong" />;
      case ROOM_TYPES.PRIVATE:
        return <Lock className="h-6 w-6 text-purple-300 icon-glow" />;
      default:
        return <MessageCircle className="h-6 w-6 text-blue-300 icon-glow" />;
    }
  };

  const getRoomBadge = (roomType) => {
    switch (roomType) {
      case ROOM_TYPES.VIP_ONLY:
        return (
          <div className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-yellow-900 bg-yellow-300 bg-opacity-80 border border-yellow-400 border-opacity-60 rounded-lg">
            <Crown className="h-4 w-4" />
            <span>VIP</span>
          </div>
        );
      case ROOM_TYPES.PRIVATE:
        return (
          <div className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-purple-200 bg-purple-500 bg-opacity-30 border border-purple-400 border-opacity-40 rounded-lg">
            <Lock className="h-4 w-4" />
            <span>Privada</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-200 bg-blue-500 bg-opacity-30 border border-blue-400 border-opacity-40 rounded-lg">
            <Sparkles className="h-4 w-4" />
            <span>Pública</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="text-center space-y-4 fade-in-up">
          <div className="h-12 bg-glass-200 rounded-xl w-80 mx-auto loading-shimmer"></div>
          <div className="h-6 bg-glass-100 rounded-lg w-64 mx-auto loading-shimmer"></div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-morphism p-6 space-y-4 animate-pulse min-h-[320px]">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-glass-200 rounded w-32 loading-shimmer"></div>
                <div className="h-6 bg-glass-100 rounded w-20 loading-shimmer"></div>
              </div>
              <div className="h-5 bg-glass-100 rounded w-full loading-shimmer"></div>
              <div className="h-5 bg-glass-100 rounded w-3/4 loading-shimmer"></div>
              <div className="flex justify-between items-center mt-auto">
                <div className="h-5 bg-glass-100 rounded w-24 loading-shimmer"></div>
                <div className="h-10 bg-glass-200 rounded w-24 loading-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header de la sección */}
      <div className="text-center space-y-4 fade-in-up">
        <h2 className="text-4xl md:text-5xl font-bold text-gradient drop-shadow-lg">
          Salas de Chat
        </h2>
        <p className="text-glass-muted text-lg md:text-xl font-medium">Elegí una sala y empezá a chatear</p>
        <div className="flex items-center justify-center space-x-6 text-base">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-soft"></div>
            <span className="text-glass-muted font-medium">{filteredRooms.length} salas disponibles</span>
          </div>
          <div className="w-2 h-2 bg-glass-300 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-glass-muted">Conectate ahora</span>
          </div>
        </div>
      </div>

      {/* Grid de salas - Layout Desktop Optimizado */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filteredRooms.map((room, index) => (
          <div 
            key={room.id} 
            className="content-card group cursor-pointer ripple-effect fade-in-up min-h-[320px] flex flex-col"
            style={{ animationDelay: `${index * 150}ms` }}
            onClick={() => handleJoinRoom(room)}
          >
            {/* Header de la tarjeta */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="glass-morphism p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {getRoomIcon(room.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-glass-bright group-hover:text-gradient transition-all duration-300 line-clamp-2 leading-tight mb-2">
                    {room.name}
                  </h3>
                  {getRoomBadge(room.type)}
                </div>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="flex-1 mb-6">
              <p className="text-glass-muted text-base leading-relaxed group-hover:text-glass transition-colors duration-300 line-clamp-4">
                {room.description || room.topic}
              </p>
            </div>
            
            {/* Footer de la tarjeta */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-base text-glass-muted">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{room.participantCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(4, room.participantCount || 0))].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"
                      style={{ animationDelay: `${i * 300}ms` }}
                    ></div>
                  ))}
                  {(room.participantCount || 0) > 4 && (
                    <span className="text-sm text-glass-muted ml-2">+{(room.participantCount || 0) - 4}</span>
                  )}
                </div>
              </div>
              
              <button className="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-all duration-300 px-6 py-3 text-base">
                <Zap className="h-5 w-5" />
                <span className="font-semibold">Entrar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promoción VIP */}
      {!isVIP && (
        <div className="content-card bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-400/30 fade-in-up">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex items-center space-x-6 text-center lg:text-left">
              <div className="glass-morphism-strong p-4 rounded-2xl glow-animation flex-shrink-0">
                <Crown className="h-12 w-12 text-yellow-300 icon-glow-strong" />
              </div>
              <div>
                <h3 className="font-bold text-glass-bright text-2xl mb-3">¡Hazte VIP!</h3>
                <p className="text-glass-muted mb-4 leading-relaxed text-base">
                  Accedé a salas exclusivas, enviá audios y disfrutá sin anuncios
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-glass-muted">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    <span>Salas VIP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Sin anuncios</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-400" />
                    <span>Funciones premium</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn-secondary border-yellow-300/50 text-yellow-200 hover:bg-yellow-300/20 hover:border-yellow-300/70 hover:text-yellow-100 shadow-glow-sm flex items-center space-x-2 px-8 py-4 whitespace-nowrap text-base">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Saber más</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

