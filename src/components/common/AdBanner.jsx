import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { X, Crown, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers.js';
import { APP_CONFIG } from '../../utils/constants.js';

export const AdBanner = ({ onUpgrade }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      alert('Función de upgrade a VIP próximamente disponible');
    }
  };

  return (
    <Card className="glass-effect border-none mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full shadow-md">
              <Crown className="h-6 w-6 text-yellow-300" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">
                ¡Hazte VIP y disfrutá sin límites!
              </h3>
              <p className="text-sm text-white text-opacity-80 mb-2">
                Enviá audios, accedé a salas exclusivas y navegá sin anuncios
              </p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white text-opacity-70">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-300" />
                  <span>Audios ilimitados</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-300" />
                  <span>Salas VIP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-300" />
                  <span>Sin anuncios</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-4">
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {formatCurrency(APP_CONFIG.VIP_PRICE_ARS)}
              </div>
              <div className="text-xs text-white text-opacity-70">por mes</div>
            </div>
            
            <Button
              onClick={handleUpgrade}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              size="sm"
            >
              Upgrade
            </Button>
            
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


