import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Eye, EyeOff, Mail, Lock, User, Calendar, MapPin } from 'lucide-react';
import { authService } from '../../services/authService.js';
import { validateEmail, validateNickname, validateAge } from '../../utils/helpers.js';
import { GENDERS, ARGENTINA_PROVINCES } from '../../utils/constants.js';

export const AuthForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    age: '',
    gender: '',
    location: '',
    interests: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(loginData.email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    const result = await authService.signInWithEmail(loginData.email, loginData.password);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!validateEmail(registerData.email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const nicknameValidation = validateNickname(registerData.nickname);
    if (!nicknameValidation.isValid) {
      setError(nicknameValidation.error);
      setLoading(false);
      return;
    }

    if (!validateAge(registerData.age)) {
      setError('La edad debe estar entre 13 y 120 años');
      setLoading(false);
      return;
    }

    const profileData = {
      nickname: registerData.nickname,
      age: parseInt(registerData.age),
      gender: registerData.gender,
      location: registerData.location,
      interests: registerData.interests.split(',').map(i => i.trim()).filter(i => i)
    };

    const result = await authService.createAccount(
      registerData.email,
      registerData.password,
      profileData
    );
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const result = await authService.signInWithGoogle();
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-white drop-shadow-lg">
            La Previa Chat
          </CardTitle>
          <CardDescription className="text-white text-opacity-80">
            Conectate con gente de Argentina
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg shadow-inner">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white text-opacity-90">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md text-white text-opacity-90">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-opacity-90">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-opacity-90">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      className="pl-10 pr-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-white text-opacity-70 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-300 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-md">{error}</div>
                )}
                
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white border-opacity-30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white text-opacity-80">O</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Continuar con Google
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-white text-opacity-90">Nickname</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                      <Input
                        id="nickname"
                        placeholder="Tu nickname"
                        className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={registerData.nickname}
                        onChange={(e) => setRegisterData({ ...registerData, nickname: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white text-opacity-90">Edad</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        min="13"
                        max="120"
                        value={registerData.age}
                        onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white text-opacity-90">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white text-opacity-90">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        className="pl-10 bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white text-opacity-90">Confirmar</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirmar"
                      className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white text-opacity-90">Género</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-white border-opacity-20 bg-white bg-opacity-10 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white placeholder:text-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                      value={registerData.gender}
                      onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                      required
                    >
                      <option value="" className="bg-indigo-700 text-white">Seleccionar</option>
                      {Object.entries(GENDERS).map(([key, value]) => (
                        <option key={key} value={value} className="bg-indigo-700 text-white">{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white text-opacity-90">Provincia</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-white text-opacity-70" />
                      <select
                        id="location"
                        className="flex h-10 w-full rounded-md border border-white border-opacity-20 bg-white bg-opacity-10 pl-10 pr-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white placeholder:text-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
                        value={registerData.location}
                        onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                        required
                      >
                        <option value="" className="bg-indigo-700 text-white">Seleccionar</option>
                        {ARGENTINA_PROVINCES.map((province) => (
                          <option key={province} value={province} className="bg-indigo-700 text-white">{province}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-white text-opacity-90">Intereses (separados por comas)</Label>
                  <Input
                    id="interests"
                    placeholder="música, deportes, cine..."
                    className="bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-60 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    value={registerData.interests}
                    onChange={(e) => setRegisterData({ ...registerData, interests: e.target.value })}
                  />
                </div>
                
                {error && (
                  <div className="text-red-300 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-md">{error}</div>
                )}
                
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};


