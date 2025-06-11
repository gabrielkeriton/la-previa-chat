import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ChatProvider, useChat } from './contexts/ChatContext.jsx';
import { AuthForm } from './components/auth/AuthForm.jsx';
import { Header } from './components/layout/Header.jsx';
import { BottomNav } from './components/layout/BottomNav.jsx';
import { RoomList } from './components/chat/RoomList.jsx';
import { ChatWindow } from './components/chat/ChatWindow.jsx';
import { UserSearch } from './components/profile/UserSearch.jsx';
import { UserProfile } from './components/profile/UserProfile.jsx';
import { UserPublicProfile } from './components/profile/UserPublicProfile.jsx';
import { AdBanner } from './components/common/AdBanner.jsx';
import { LoadingSpinner } from './components/common/LoadingSpinner.jsx';
import { NearbySection } from './components/nearby/NearbySection.jsx';
import { roomService } from './services/roomService.js';
import { userService } from './services/userService.js';
import './App.css';

function AppContent() {
  const { user, userProfile, loading: authLoading, isVIP } = useAuth();
  const { currentRoom } = useChat();
  const [activeView, setActiveView] = useState('rooms');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    if (user) {
      roomService.initializeDefaultRooms();
      userService.updateLastSeen(user.uid);
    }
  }, [user]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleCloseUserProfile = () => {
    setSelectedUser(null);
  };

  const handleShowProfile = () => {
    setShowUserProfile(true);
    setActiveView('profile');
  };

  const handleCloseProfile = () => {
    setShowUserProfile(false);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view !== 'profile') {
      setShowUserProfile(false);
    }
  };

  const handleShowNearby = () => {
    setActiveView('nearby');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="bg-decoration"></div>
        <div className="bg-decoration"></div>
        <div className="bg-decoration"></div>
        
        <div className="text-center glass-morphism-strong p-12 space-y-6 fade-in-up max-w-md mx-4">
          <div className="relative">
            <LoadingSpinner size="lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-xl opacity-30 animate-pulse-soft"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-glass-bright">La Previa Chat</h2>
            <p className="text-glass-muted text-lg">Cargando tu experiencia...</p>
          </div>
          <div className="w-48 h-2 bg-glass-100 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="bg-decoration"></div>
        <div className="bg-decoration"></div>
        <div className="bg-decoration"></div>
        
        <AuthForm onSuccess={() => setActiveView('rooms')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>

      {/* Header fijo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header 
          onShowProfile={handleShowProfile}
          onShowSearch={() => setActiveView('search')}
          onShowRooms={() => setActiveView('rooms')}
          onShowNearby={handleShowNearby}
          activeView={activeView}
        />
      </div>

      {/* Contenido principal con padding para header y bottom nav */}
      <main className="relative z-10 pt-20 pb-24 md:pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Banner de anuncios para usuarios no VIP */}
          {!isVIP && (
            <div className="mb-6 fade-in-up">
              <AdBanner />
            </div>
          )}
          
          {/* Contenido principal */}
          <div className="w-full">
            {/* Vista móvil: Una sola vista basada en activeView */}
            <div className="lg:hidden">
              {activeView === 'rooms' && !currentRoom && (
                <div className="fade-in-up">
                  <RoomList />
                </div>
              )}
              {activeView === 'search' && !currentRoom && (
                <div className="fade-in-up">
                  <UserSearch onUserSelect={handleUserSelect} />
                </div>
              )}
              {activeView === 'nearby' && !currentRoom && (
                <div className="fade-in-up">
                  <NearbySection />
                </div>
              )}
              {activeView === 'profile' && showUserProfile && !currentRoom && (
                <div className="fade-in-up">
                  <UserProfile onClose={handleCloseProfile} />
                </div>
              )}
              {currentRoom && (
                <div className="slide-in-right">
                  <ChatWindow />
                </div>
              )}
            </div>

            {/* Vista de escritorio: Layout lado a lado */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  {activeView === 'rooms' && (
                    <div className="fade-in-up">
                      <RoomList />
                    </div>
                  )}
                  {activeView === 'search' && (
                    <div className="fade-in-up">
                      <UserSearch onUserSelect={handleUserSelect} />
                    </div>
                  )}
                  {activeView === 'nearby' && (
                    <div className="fade-in-up">
                      <NearbySection />
                    </div>
                  )}
                  {activeView === 'profile' && showUserProfile && (
                    <div className="fade-in-up">
                      <UserProfile onClose={handleCloseProfile} />
                    </div>
                  )}
                </div>
                <div className="xl:col-span-1">
                  <div className="slide-in-right">
                    <ChatWindow />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation fijo */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <BottomNav activeView={activeView} onViewChange={handleViewChange} />
      </div>

      {/* Modal de perfil público de usuario */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm fade-in-up">
          <div className="w-full max-w-md">
            <UserPublicProfile 
              targetUser={selectedUser} 
              onClose={handleCloseUserProfile} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;

