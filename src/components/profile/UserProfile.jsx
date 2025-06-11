import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Camera, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import { storageService } from '../../services/storageService.js';
import { validateNickname, validateAge, getInitials, generateAvatarColor } from '../../utils/helpers.js';
import { GENDERS, ARGENTINA_PROVINCES, APP_CONFIG } from '../../utils/constants.js';

export const UserProfile = ({ onClose }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nickname: userProfile?.nickname || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    location: userProfile?.location || '',
    interests: userProfile?.interests?.join(', ') || '',
    bio: userProfile?.bio || ''
  });

  const handleSave = async () => {
    setLoading(true);

    // Validation
    const nicknameValidation = validateNickname(formData.nickname);
    if (!nicknameValidation.isValid) {
      alert(nicknameValidation.error);
      setLoading(false);
      return;
    }

    if (!validateAge(formData.age)) {
      alert('La edad debe estar entre 13 y 120 años');
      setLoading(false);
      return;
    }

    // Check if nickname is available (if changed)
    if (formData.nickname !== userProfile.nickname) {
      const isAvailable = await userService.isNicknameAvailable(formData.nickname, user.uid);
      if (!isAvailable) {
        alert('Este nickname ya está en uso');
        setLoading(false);
        return;
      }
    }

    const updates = {
      nickname: formData.nickname,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      bio: formData.bio
    };

    const result = await userService.updateUserProfile(user.uid, updates);

    if (result.success) {
      updateUserProfile({ ...userProfile, ...updates });
      setEditing(false);
      alert('Perfil actualizado correctamente');
    } else {
      alert('Error al actualizar el perfil');
    }

    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = storageService.validateFile(
      file,
      APP_CONFIG.SUPPORTED_IMAGE_TYPES,
      APP_CONFIG.MAX_FILE_SIZE
    );

    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setUploadingImage(true);

    try {
      const result = await storageService.uploadProfilePicture(user.uid, file);

      if (result.success) {
        const updateResult = await userService.updateUserProfile(user.uid, {
          profilePicUrl: result.url
        });

        if (updateResult.success) {
          updateUserProfile({ ...userProfile, profilePicUrl: result.url });
          alert('Foto de perfil actualizada');
        }
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleCancel = () => {
    setFormData({
      nickname: userProfile?.nickname || '',
      age: userProfile?.age || '',
      gender: userProfile?.gender || '',
      location: userProfile?.location || '',
      interests: userProfile?.interests?.join(', ') || '',
      bio: userProfile?.bio || ''
    });
    setEditing(false);
  };

  if (!userProfile) {
    return (
      <Card className="glass-effect border-none">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white border-opacity-70 mx-auto"></div>
          <p className="mt-2 text-white text-opacity-70">Cargando perfil...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto glass-effect border-none">
      <CardHeader className="border-b border-white border-opacity-30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Mi Perfil</CardTitle>
          <div className="flex space-x-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30">
                Editar
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button onClick={handleCancel} variant="outline" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            )}
            {onClose && (
              <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-white border-opacity-50 shadow-lg">
              {userProfile.profilePicUrl ? (
                <AvatarImage src={userProfile.profilePicUrl} alt="Foto de perfil" />
              ) : (
                <AvatarFallback 
                  style={{ backgroundColor: generateAvatarColor(userProfile.nickname) }}
                  className="text-white text-xl font-semibold"
                >
                  {getInitials(userProfile.nickname)}
                </AvatarFallback>
              )}
            </Avatar>
            
            {editing && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {uploadingImage && (
            <p className="text-sm text-white text-opacity-70">Subiendo imagen...</p>
          )}

          {userProfile.isVIP && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-400 border-opacity-50">
              ⭐ Usuario VIP
            </span>
          )}
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-white text-opacity-90">Nickname</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              disabled={!editing}
              maxLength={20}
              className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-white text-opacity-90">Edad</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              disabled={!editing}
              min="13"
              max="120"
              className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-white text-opacity-90">Género</Label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-md border border-white border-opacity-20 bg-white bg-opacity-10 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white placeholder:text-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              disabled={!editing}
            >
              <option value="" className="bg-indigo-700 text-white">Seleccionar</option>
              {Object.entries(GENDERS).map(([key, value]) => (
                <option key={key} value={value} className="bg-indigo-700 text-white">{value}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-white text-opacity-90">Provincia</Label>
            <select
              id="location"
              className="flex h-10 w-full rounded-md border border-white border-opacity-20 bg-white bg-opacity-10 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white placeholder:text-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={!editing}
            >
              <option value="" className="bg-indigo-700 text-white">Seleccionar</option>
              {ARGENTINA_PROVINCES.map((province) => (
                <option key={province} value={province} className="bg-indigo-700 text-white">{province}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests" className="text-white text-opacity-90">Intereses (separados por comas)</Label>
          <Input
            id="interests"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
            disabled={!editing}
            placeholder="música, deportes, cine..."
            className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-white text-opacity-90">Biografía</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!editing}
            placeholder="Contanos un poco sobre vos..."
            rows={3}
            maxLength={200}
            className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
          {editing && (
            <p className="text-xs text-white text-opacity-70 text-right">
              {formData.bio.length}/200
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="pt-4 border-t border-white border-opacity-30">
          <h3 className="font-semibold text-white text-opacity-90 mb-2">Información de la cuenta</h3>
          <div className="text-sm text-white text-opacity-70 space-y-1">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Miembro desde:</strong> {userProfile.createdAt?.toDate?.()?.toLocaleDateString('es-AR') || 'N/A'}</p>
            <p><strong>Última conexión:</strong> {userProfile.lastSeen?.toDate?.()?.toLocaleString('es-AR') || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


