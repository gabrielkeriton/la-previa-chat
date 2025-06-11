import { useState } from 'react';
import { Menu, Search, Bell, User, MessageCircle, MapPin, Home, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export const Header = ({ 
  onShowProfile, 
  onShowSearch, 
  onShowRooms, 
  onShowNearby, 
  activeView 
}) => {
  const { user, userProfile, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileClick = () => {
    onShowProfile();
    setShowProfileMenu(false);
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setShowMenu(false);
  };

  const getNavButtonClass = (view) => {
    const baseClass = "hidden lg:flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 text-base";
    if (activeView === view) {
      return `${baseClass} bg-glass-200 text-glass-bright shadow-glow-md border border-glass-300`;
    }
    return `${baseClass} text-glass-muted hover:text-glass-bright hover:bg-glass-100 hover:shadow-glow-sm`;
  };

  return (
    <header className="w-full bg-glass-100 backdrop-blur-xl border-b border-glass-200 shadow-glow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="glass-morphism-strong p-3 rounded-2xl glow-animation">
              <img 
                src="/logo-la-previa-chat.png" 
                alt="La Previa Chat" 
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gradient leading-tight">La Previa Chat</h1>
              <p className="text-sm text-glass-muted font-medium">Conectate con Argentina</p>
            </div>
          </div>

          {/* Navegación central - Solo desktop */}
          <nav className="hidden lg:flex items-center space-x-3">
            <button 
              onClick={onShowRooms}
              className={getNavButtonClass('rooms')}
            >
              <Home className="h-5 w-5" />
              <span>Salas</span>
            </button>
            <button 
              onClick={onShowSearch}
              className={getNavButtonClass('search')}
            >
              <Search className="h-5 w-5" />
              <span>Buscar</span>
            </button>
            <button 
              onClick={onShowNearby}
              className={getNavButtonClass('nearby')}
            >
              <MapPin className="h-5 w-5" />
              <span>Cerca de Acá</span>
            </button>
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={handleNotificationToggle}
                className="glass-morphism p-3 rounded-2xl hover:scale-105 transition-all duration-300 relative group"
              >
                <Bell className="h-6 w-6 text-glass-muted group-hover:text-glass-bright transition-colors duration-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse-soft flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-3xl shadow-glow-lg p-6 z-50 fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-glass-bright text-lg">Notificaciones</h3>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-glass-muted hover:text-glass-bright transition-colors duration-300"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="glass-morphism p-4 rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 animate-pulse-soft"></div>
                        <div>
                          <p className="text-glass-bright font-medium">Nueva sala disponible</p>
                          <p className="text-glass-muted text-sm">Se abrió "Música Argentina" hace 5 min</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-morphism p-4 rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full mt-2 animate-pulse-soft"></div>
                        <div>
                          <p className="text-glass-bright font-medium">Usuario cerca tuyo</p>
                          <p className="text-glass-muted text-sm">María está a 2km de distancia</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-morphism p-4 rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 animate-pulse-soft"></div>
                        <div>
                          <p className="text-glass-bright font-medium">Mensaje privado</p>
                          <p className="text-glass-muted text-sm">Carlos te envió un mensaje</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil del usuario */}
            <div className="relative">
              <button
                onClick={handleProfileMenuToggle}
                className="flex items-center space-x-3 glass-morphism p-3 rounded-2xl hover:scale-105 transition-all duration-300 group"
              >
                {userProfile?.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt="Perfil" 
                    className="w-10 h-10 rounded-xl object-cover border-2 border-glass-300 group-hover:border-primary-400 transition-colors duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center border-2 border-glass-300 group-hover:border-primary-400 transition-colors duration-300">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-base font-semibold text-glass-bright group-hover:text-gradient transition-all duration-300">
                    {userProfile?.displayName || user?.email?.split('@')[0] || 'Usuario'}
                  </div>
                  <div className="text-sm text-glass-muted">
                    {userProfile?.isVIP ? (
                      <span className="text-yellow-400 font-medium">✨ VIP</span>
                    ) : (
                      <span>Gratis</span>
                    )}
                  </div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-3xl shadow-glow-lg p-6 z-50 fade-in-up">
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-glass-200">
                      {userProfile?.photoURL ? (
                        <img 
                          src={userProfile.photoURL} 
                          alt="Perfil" 
                          className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 border-2 border-glass-300"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-glass-300">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <h4 className="font-bold text-glass-bright text-lg">
                        {userProfile?.displayName || user?.email?.split('@')[0] || 'Usuario'}
                      </h4>
                      <p className="text-glass-muted text-sm">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-glass-200 transition-all duration-300 text-left group"
                    >
                      <Settings className="h-5 w-5 text-glass-muted group-hover:text-primary-400 transition-colors duration-300" />
                      <span className="text-glass-bright group-hover:text-primary-400 font-medium transition-colors duration-300">Editar Perfil</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-500/20 transition-all duration-300 text-left group"
                    >
                      <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                      <span className="text-red-400 group-hover:text-red-300 font-medium transition-colors duration-300">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menú hamburguesa - Solo móvil */}
            <div className="lg:hidden relative">
              <button
                onClick={handleMenuToggle}
                className="glass-morphism p-3 rounded-2xl hover:scale-105 transition-all duration-300"
              >
                <Menu className="h-6 w-6 text-glass-muted" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-3xl shadow-glow-lg p-6 z-50 fade-in-up">
                  <div className="space-y-3">
                    <button
                      onClick={() => { onShowRooms(); setShowMenu(false); }}
                      className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-glass-200 transition-colors duration-300 text-left"
                    >
                      <Home className="h-6 w-6 text-glass-muted" />
                      <span className="text-glass-bright font-medium text-lg">Salas</span>
                    </button>
                    <button
                      onClick={() => { onShowSearch(); setShowMenu(false); }}
                      className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-glass-200 transition-colors duration-300 text-left"
                    >
                      <Search className="h-6 w-6 text-glass-muted" />
                      <span className="text-glass-bright font-medium text-lg">Buscar</span>
                    </button>
                    <button
                      onClick={() => { onShowNearby(); setShowMenu(false); }}
                      className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-glass-200 transition-colors duration-300 text-left"
                    >
                      <MapPin className="h-6 w-6 text-glass-muted" />
                      <span className="text-glass-bright font-medium text-lg">Cerca de Acá</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

