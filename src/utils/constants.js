// Constants for the application
export const COLLECTIONS = {
  USERS: 'users',
  ROOMS: 'rooms',
  MESSAGES: 'messages',
  REPORTS: 'reports'
};

export const USER_TYPES = {
  FREE: 'free',
  VIP: 'vip'
};

export const ROOM_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  VIP_ONLY: 'vipOnly'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
  IMAGE: 'image'
};

export const REPORT_REASONS = {
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  FAKE_PROFILE: 'fake_profile',
  OTHER: 'other'
};

export const GENDERS = {
  MALE: 'masculino',
  FEMALE: 'femenino',
  OTHER: 'otro',
  PREFER_NOT_TO_SAY: 'prefiero_no_decir'
};

export const ARGENTINA_PROVINCES = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
  'Ciudad Autónoma de Buenos Aires'
];

export const DEFAULT_ROOMS = [
  {
    id: 'general',
    name: 'General',
    topic: 'Charla general para todos',
    type: ROOM_TYPES.PUBLIC,
    description: 'Sala principal para charlar de todo un poco'
  },
  {
    id: 'amistad',
    name: 'Amistad',
    topic: 'Conocé gente nueva y hacé amigos',
    type: ROOM_TYPES.PUBLIC,
    description: 'Para conocer gente y hacer nuevas amistades'
  },
  {
    id: 'amor',
    name: 'Amor y Romance',
    topic: 'Buscás el amor? Esta es tu sala',
    type: ROOM_TYPES.PUBLIC,
    description: 'Para quienes buscan algo más que amistad'
  },
  {
    id: 'musica',
    name: 'Música',
    topic: 'Hablemos de música argentina e internacional',
    type: ROOM_TYPES.PUBLIC,
    description: 'Compartí tus gustos musicales'
  },
  {
    id: 'deportes',
    name: 'Deportes',
    topic: 'Fútbol, básquet, tenis y más',
    type: ROOM_TYPES.PUBLIC,
    description: 'Todo sobre deportes argentinos e internacionales'
  },
  {
    id: 'vip-exclusiva',
    name: 'VIP Exclusiva',
    topic: 'Sala exclusiva para miembros VIP',
    type: ROOM_TYPES.VIP_ONLY,
    description: 'Acceso exclusivo para usuarios VIP con funciones premium'
  }
];

export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_NICKNAME_LENGTH: 20,
  MIN_NICKNAME_LENGTH: 3,
  MAX_AUDIO_DURATION: 60, // seconds
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  SUPPORTED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  VIP_PRICE_ARS: 999 // Precio en pesos argentinos
};


