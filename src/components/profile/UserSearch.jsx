import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Search, User, MapPin, Calendar, Heart } from 'lucide-react';
import { userService } from '../../services/userService.js';
import { debounce, getInitials, generateAvatarColor } from '../../utils/helpers.js';

export const UserSearch = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = debounce(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const results = await userService.searchUsers(term.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleUserClick = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-effect border-none">
        <CardHeader className="border-b border-white border-opacity-30">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Search className="h-5 w-5" />
            <span>Buscar Usuarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-60" />
            <Input
              placeholder="Buscá por nickname..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white border-opacity-70"></div>
        </div>
      )}

      {hasSearched && !loading && searchResults.length === 0 && (
        <Card className="glass-effect border-none">
          <CardContent className="py-8 text-center text-white text-opacity-70">
            <User className="h-12 w-12 mx-auto mb-2 text-white text-opacity-50" />
            <p>No se encontraron usuarios</p>
            <p className="text-sm">Intentá con otro nickname</p>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-opacity-90">
            Resultados ({searchResults.length})
          </h3>
          
          <div className="space-y-2">
            {searchResults.map((user) => (
              <Card 
                key={user.id} 
                className="glass-effect hover:shadow-xl transition-all duration-300 cursor-pointer border-none"
                onClick={() => handleUserClick(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-white border-opacity-50 shadow-lg">
                      <AvatarFallback 
                        style={{ backgroundColor: generateAvatarColor(user.nickname) }}
                        className="text-white font-semibold"
                      >
                        {getInitials(user.nickname)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white truncate">
                          {user.nickname}
                        </h4>
                        {user.isVIP && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-400 border-opacity-50">
                            VIP
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-white text-opacity-70">
                        {user.age && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{user.age} años</span>
                          </div>
                        )}
                        
                        {user.gender && (
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span className="capitalize">{user.gender}</span>
                          </div>
                        )}
                        
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {user.interests && user.interests.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {user.interests.slice(0, 3).map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white bg-opacity-10 text-white border border-white border-opacity-20"
                              >
                                {interest}
                              </span>
                            ))}
                            {user.interests.length > 3 && (
                              <span className="text-xs text-white text-opacity-60">
                                +{user.interests.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};



