import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { 
  MapPin, 
  Users, 
  MessageCircle, 
  Navigation, 
  Shield, 
  Clock,
  Star,
  Heart,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getInitials, generateAvatarColor } from '../../utils/helpers.js';

export const NearbySection = () => {
  const { user, userProfile } = useAuth();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [nearbyRooms, setNearbyRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Datos de ejemplo para demostración
  const mockNearbyUsers = [
    {
      id: '1',
      nickname: 'Sofia_BA',
      age: 25,
      distance: 0.8,
      isOnline: true,
      profilePic: null,
      interests: ['música', 'arte', 'café'],
      lastSeen: new Date()
    },
    {
      id: '2', 
      nickname: 'Mateo_Palermo',
      age: 28,
      distance: 1.2,
      isOnline: true,
      profilePic: null,
      interests: ['deportes', 'tecnología'],
      lastSeen: new Date()
    },
    {
      id: '3',
      nickname: 'Luna_Recoleta',
      age: 23,
      distance: 2.1,
      isOnline: false,
      profilePic: null,
      interests: ['libros', 'cine', 'viajes'],
      lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 min ago
    }
  ];

  const mockNearbyRooms = [
    {
      id: '1',
      name: 'Café Tortoni Chat',
      description: 'Charlemos sobre el café más famoso de Buenos Aires',
      distance: 0.5,
      participants: 12,
      isActive: true,
      category: 'Local'
    },
    {
      id: '2',
      name: 'Palermo Soho Vibes',
      description: 'Para los que andan por Palermo',
      distance: 1.8,
      participants: 8,
      isActive: true,
      category: 'Zona'
    },
    {
      id: '3',
      name: 'Puerto Madero Sunset',
      description: 'Atardeceres y charlas relajadas',
      distance: 3.2,
      participants: 15,
      isActive: true,
      category: 'Zona'
    }
  ];

  const requestLocation = async () => {
    setLoading(true);
    setPermissionRequested(true);
    
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está soportada en este navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationError(null);
        // Simular carga de datos cercanos
        setTimeout(() => {
          setNearbyUsers(mockNearbyUsers);
          setNearbyRooms(mockNearbyRooms);
          setLoading(false);
        }, 2000);
      },
      (error) => {
        setLocationError('No se pudo obtener tu ubicación. Verifica los permisos.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const diff = now - lastSeen;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 fade-in-up">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="glass-morphism p-3 rounded-xl">
            <MapPin className="h-8 w-8 text-blue-300 icon-glow-strong" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gradient drop-shadow-lg">
              Cerca de Acá
            </h2>
            <p className="text-glass-muted text-lg font-medium">Descubrí gente y salas cerca tuyo</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-glass-muted">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-green-400" />
            <span>Conexiones reales</span>
          </div>
          <div className="w-1 h-1 bg-glass-300 rounded-full"></div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span>Privacidad protegida</span>
          </div>
        </div>
      </div>

      {!permissionRequested && (
        <div className="content-card text-center space-y-6 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-blue-400/30 fade-in-up">
          <div className="space-y-4">
            <div className="glass-morphism-strong p-6 rounded-2xl inline-block glow-animation">
              <Navigation className="h-12 w-12 text-blue-300 icon-glow-strong mx-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-glass-bright mb-3">Activar Ubicación</h3>
              <p className="text-glass-muted leading-relaxed max-w-md mx-auto">
                Para mostrarte personas y salas cerca tuyo, necesitamos acceso a tu ubicación. 
                Tu privacidad está protegida y solo compartimos ubicaciones aproximadas.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={requestLocation}
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg font-semibold shadow-glow"
            >
              <Navigation className="h-5 w-5 mr-2" />
              {loading ? 'Obteniendo ubicación...' : 'Permitir Ubicación'}
            </Button>
            
            <div className="text-xs text-glass-muted space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Lock className="h-3 w-3" />
                <span>Tu ubicación exacta nunca se comparte</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Solo mostramos distancias aproximadas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="content-card bg-red-500/20 border-red-400/30 text-center space-y-4 fade-in-up">
          <div className="glass-morphism p-4 rounded-xl inline-block">
            <MapPin className="h-8 w-8 text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-200 mb-2">Error de Ubicación</h3>
            <p className="text-red-300 text-sm">{locationError}</p>
          </div>
          <Button 
            onClick={requestLocation}
            className="btn-secondary border-red-300/50 text-red-200 hover:bg-red-300/20"
          >
            Intentar de nuevo
          </Button>
        </div>
      )}

      {loading && location && (
        <div className="content-card text-center space-y-6 fade-in-up">
          <div className="space-y-4">
            <div className="glass-morphism p-6 rounded-2xl inline-block">
              <div className="animate-spin">
                <Navigation className="h-8 w-8 text-blue-300" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-glass-bright">Buscando cerca tuyo...</h3>
              <p className="text-glass-muted">Encontrando personas y salas en tu área</p>
            </div>
          </div>
          <div className="w-64 h-2 bg-glass-100 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shimmer"></div>
          </div>
        </div>
      )}

      {location && !loading && (
        <div className="space-y-8">
          {/* Usuarios cercanos */}
          <div className="space-y-6 fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-glass-bright flex items-center space-x-3">
                <Users className="h-6 w-6 text-purple-300" />
                <span>Personas Cerca</span>
              </h3>
              <div className="text-sm text-glass-muted">
                {nearbyUsers.length} encontradas
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {nearbyUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="content-card group cursor-pointer fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-glass-border-strong">
                        {user.profilePic ? (
                          <AvatarImage src={user.profilePic} alt={user.nickname} />
                        ) : (
                          <AvatarFallback 
                            style={{ backgroundColor: generateAvatarColor(user.nickname) }}
                            className="text-white font-bold"
                          >
                            {getInitials(user.nickname)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                        user.isOnline ? 'bg-green-400 animate-pulse-soft' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-glass-bright group-hover:text-gradient transition-all duration-300">
                          {user.nickname}
                        </h4>
                        <div className="flex items-center space-x-1 text-xs text-glass-muted">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">{formatDistance(user.distance)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-sm text-glass-muted">{user.age} años</span>
                        <div className="w-1 h-1 bg-glass-300 rounded-full"></div>
                        <div className="flex items-center space-x-1 text-xs">
                          <Clock className="h-3 w-3 text-glass-muted" />
                          <span className="text-glass-muted">
                            {user.isOnline ? 'En línea' : formatLastSeen(user.lastSeen)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {user.interests.slice(0, 3).map((interest, i) => (
                          <span 
                            key={i} 
                            className="badge-glass text-xs px-2 py-1"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                      
                      <Button className="btn-secondary w-full text-sm group-hover:scale-105 transition-all duration-300">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar mensaje
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salas cercanas */}
          <div className="space-y-6 fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-glass-bright flex items-center space-x-3">
                <MessageCircle className="h-6 w-6 text-green-300" />
                <span>Salas Cerca</span>
              </h3>
              <div className="text-sm text-glass-muted">
                {nearbyRooms.length} activas
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {nearbyRooms.map((room, index) => (
                <div 
                  key={room.id} 
                  className="content-card group cursor-pointer fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="glass-morphism p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <MessageCircle className="h-5 w-5 text-green-300 icon-glow" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-glass-bright group-hover:text-gradient transition-all duration-300">
                            {room.name}
                          </h4>
                          <div className="badge-glass text-xs mt-1">
                            {room.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-glass-muted">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{formatDistance(room.distance)}</span>
                      </div>
                    </div>
                    
                    <p className="text-glass-muted text-sm leading-relaxed">
                      {room.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-glass-muted">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{room.participants}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(Math.min(3, Math.floor(room.participants / 3)))].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"
                              style={{ animationDelay: `${i * 300}ms` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="btn-primary flex items-center space-x-2 group-hover:scale-105 transition-all duration-300">
                        <Zap className="h-4 w-4" />
                        <span className="font-semibold">Unirse</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información de privacidad */}
          <div className="content-card bg-gradient-to-br from-gray-500/10 via-gray-600/10 to-gray-700/10 border-gray-400/20 fade-in-up">
            <div className="flex items-start space-x-4">
              <div className="glass-morphism p-3 rounded-xl">
                <Shield className="h-6 w-6 text-gray-300" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-glass-bright">Tu Privacidad es Importante</h4>
                <div className="text-sm text-glass-muted space-y-1">
                  <p>• Tu ubicación exacta nunca se comparte con otros usuarios</p>
                  <p>• Solo mostramos distancias aproximadas (ej: "1.2km")</p>
                  <p>• Puedes desactivar la ubicación en cualquier momento</p>
                  <p>• Los datos de ubicación no se almacenan en nuestros servidores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

