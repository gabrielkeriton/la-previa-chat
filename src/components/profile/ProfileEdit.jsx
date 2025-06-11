import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Save, 
  X, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  Edit3,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';

export const ProfileEdit = ({ onClose, onSave, user, userProfile, updateUserProfile }) => {
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    province: userProfile?.province || '',
    interests: userProfile?.interests || '',
    bio: userProfile?.bio || '',
    photoURL: userProfile?.photoURL || '',
    allowLocationSharing: userProfile?.allowLocationSharing || false,
    showInNearby: userProfile?.showInNearby || false
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        photo: 'Por favor selecciona una imagen válida'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        photo: 'La imagen debe ser menor a 5MB'
      }));
      return;
    }

    setIsUploading(true);
    setErrors(prev => ({ ...prev, photo: null }));

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photoURL: e.target.result
        }));
        setIsUploading(false);
        setSuccessMessage('Foto actualizada correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      setErrors(prev => ({
        ...prev,
        photo: 'Error al subir la imagen. Intenta nuevamente.'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'El nombre es requerido';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 120)) {
      newErrors.age = 'Ingresa una edad válida (13-120)';
    }
    
    if (formData.interests && formData.interests.length > 200) {
      newErrors.interests = 'Los intereses no pueden exceder 200 caracteres';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'La biografía no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      if (updateUserProfile) {
        await updateUserProfile(formData);
      }
      setSuccessMessage('Perfil actualizado correctamente');
      setTimeout(() => {
        onSave && onSave(formData);
        onClose();
      }, 1500);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'Error al guardar el perfil. Intenta nuevamente.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const provinces = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
    'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
    'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego',
    'Tucumán', 'CABA'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
      <div className="bg-glass-100 backdrop-blur-xl border border-glass-200 rounded-3xl shadow-glow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glass-200">
          <div className="flex items-center space-x-3">
            <div className="glass-morphism p-2 rounded-xl">
              <Edit3 className="h-6 w-6 text-primary-400 icon-glow" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-glass-bright">Editar Perfil</h2>
              <p className="text-glass-muted">Personaliza tu información</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="glass-morphism p-2 rounded-xl hover:scale-105 transition-all duration-300"
          >
            <X className="h-6 w-6 text-glass-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Mensajes de estado */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl flex items-center space-x-3 fade-in-up">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-green-300 font-medium">{successMessage}</span>
            </div>
          )}
          
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center space-x-3 fade-in-up">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300 font-medium">{errors.general}</span>
            </div>
          )}

          <div className="space-y-8">
            {/* Foto de perfil */}
            <div className="text-center">
              <div className="relative inline-block">
                {formData.photoURL ? (
                  <img 
                    src={formData.photoURL} 
                    alt="Perfil" 
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-glass-300 shadow-glow-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center border-4 border-glass-300 shadow-glow-md">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute -bottom-2 -right-2 glass-morphism-strong p-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-glow-sm"
                >
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-6 w-6 text-primary-400 icon-glow" />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              {errors.photo && (
                <p className="mt-2 text-red-400 text-sm">{errors.photo}</p>
              )}
              
              <p className="mt-3 text-glass-muted text-sm">
                Haz clic en la cámara para cambiar tu foto
              </p>
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-glass-bright font-medium mb-2">
                  Nombre de usuario *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className={`w-full glass-morphism p-4 rounded-2xl text-glass-bright placeholder-glass-muted focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ${
                    errors.displayName ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Tu nombre de usuario"
                />
                {errors.displayName && (
                  <p className="mt-1 text-red-400 text-sm">{errors.displayName}</p>
                )}
              </div>

              <div>
                <label className="block text-glass-bright font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full glass-morphism p-4 rounded-2xl text-glass-muted bg-glass-50 cursor-not-allowed"
                />
                <p className="mt-1 text-glass-muted text-xs">El email no se puede modificar</p>
              </div>

              <div>
                <label className="block text-glass-bright font-medium mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className={`w-full glass-morphism p-4 rounded-2xl text-glass-bright placeholder-glass-muted focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ${
                    errors.age ? 'ring-2 ring-red-400' : ''
                  }`}
                  placeholder="Tu edad"
                  min="13"
                  max="120"
                />
                {errors.age && (
                  <p className="mt-1 text-red-400 text-sm">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-glass-bright font-medium mb-2">
                  Género
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full glass-morphism p-4 rounded-2xl text-glass-bright focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="no-binario">No binario</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
            </div>

            {/* Provincia */}
            <div>
              <label className="block text-glass-bright font-medium mb-2">
                Provincia
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="w-full glass-morphism p-4 rounded-2xl text-glass-bright focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300"
              >
                <option value="">Seleccionar provincia</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Intereses */}
            <div>
              <label className="block text-glass-bright font-medium mb-2">
                Intereses (separados por comas)
              </label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                className={`w-full glass-morphism p-4 rounded-2xl text-glass-bright placeholder-glass-muted focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 ${
                  errors.interests ? 'ring-2 ring-red-400' : ''
                }`}
                placeholder="Música, deportes, cine, tecnología..."
              />
              {errors.interests && (
                <p className="mt-1 text-red-400 text-sm">{errors.interests}</p>
              )}
              <p className="mt-1 text-glass-muted text-xs">
                {formData.interests.length}/200 caracteres
              </p>
            </div>

            {/* Biografía */}
            <div>
              <label className="block text-glass-bright font-medium mb-2">
                Biografía
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className={`w-full glass-morphism p-4 rounded-2xl text-glass-bright placeholder-glass-muted focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-300 resize-none ${
                  errors.bio ? 'ring-2 ring-red-400' : ''
                }`}
                placeholder="Contanos un poco sobre vos..."
              />
              {errors.bio && (
                <p className="mt-1 text-red-400 text-sm">{errors.bio}</p>
              )}
              <p className="mt-1 text-glass-muted text-xs">
                {formData.bio.length}/500 caracteres
              </p>
            </div>

            {/* Configuración de ubicación */}
            <div className="glass-morphism p-6 rounded-3xl border border-glass-200">
              <h3 className="text-lg font-bold text-glass-bright mb-4 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span>Configuración de Ubicación</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-glass-bright font-medium">Compartir ubicación</p>
                    <p className="text-glass-muted text-sm">Permite que otros usuarios te encuentren cerca</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('allowLocationSharing', !formData.allowLocationSharing)}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                      formData.allowLocationSharing 
                        ? 'bg-primary-500 shadow-glow-sm' 
                        : 'bg-glass-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      formData.allowLocationSharing ? 'left-7' : 'left-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-glass-bright font-medium">Aparecer en "Cerca de Acá"</p>
                    <p className="text-glass-muted text-sm">Muestra tu perfil en búsquedas de usuarios cercanos</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('showInNearby', !formData.showInNearby)}
                    disabled={!formData.allowLocationSharing}
                    className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                      formData.showInNearby && formData.allowLocationSharing
                        ? 'bg-primary-500 shadow-glow-sm' 
                        : 'bg-glass-300'
                    } ${!formData.allowLocationSharing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                      formData.showInNearby && formData.allowLocationSharing ? 'left-7' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-glass-200">
          <button
            onClick={onClose}
            className="btn-secondary px-8 py-3 text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary px-8 py-3 text-base flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

