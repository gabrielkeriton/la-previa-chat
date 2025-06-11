import React from 'react';
import { Home, Search, MapPin, User } from 'lucide-react';

export const BottomNav = ({ activeView, onViewChange }) => {
  const navItems = [
    {
      id: 'rooms',
      label: 'Salas',
      icon: Home,
      onClick: () => onViewChange('rooms')
    },
    {
      id: 'search',
      label: 'Buscar',
      icon: Search,
      onClick: () => onViewChange('search')
    },
    {
      id: 'nearby',
      label: 'Cerca',
      icon: MapPin,
      onClick: () => onViewChange('nearby')
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      onClick: () => onViewChange('profile')
    }
  ];

  return (
    <nav className="w-full bg-glass-100 backdrop-blur-xl border-t border-glass-200 shadow-glow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                  isActive
                    ? 'text-glass-bright bg-glass-200 shadow-glow-sm'
                    : 'text-glass-muted hover:text-glass-bright hover:bg-glass-100'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-primary-500/20 scale-110' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'icon-glow' : ''}`} />
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

