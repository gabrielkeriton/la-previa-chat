// Helper functions for the application

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays}d`;
  
  return date.toLocaleDateString('es-AR');
};

/**
 * Format time for chat messages
 */
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Validate nickname
 */
export const validateNickname = (nickname) => {
  if (!nickname || nickname.trim().length === 0) {
    return { isValid: false, error: 'El nickname es requerido' };
  }
  
  if (nickname.length < 3) {
    return { isValid: false, error: 'El nickname debe tener al menos 3 caracteres' };
  }
  
  if (nickname.length > 20) {
    return { isValid: false, error: 'El nickname no puede tener más de 20 caracteres' };
  }
  
  // Only allow letters, numbers, and some special characters
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(nickname)) {
    return { isValid: false, error: 'El nickname solo puede contener letras, números, guiones y guiones bajos' };
  }
  
  return { isValid: true };
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate age
 */
export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 13 && numAge <= 120;
};

/**
 * Generate random color for user avatar
 */
export const generateAvatarColor = (nickname) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user is online (last seen within 5 minutes)
 */
export const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;
  
  const now = new Date();
  const lastSeenDate = lastSeen.toDate ? lastSeen.toDate() : new Date(lastSeen);
  const diffInMinutes = (now - lastSeenDate) / (1000 * 60);
  
  return diffInMinutes <= 5;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Check if text contains profanity (basic implementation)
 */
export const containsProfanity = (text) => {
  const profanityWords = [
    // Add Spanish profanity words here for content moderation
    // This is a basic implementation - in production, use a proper service
  ];
  
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
};

/**
 * Format currency in Argentine Pesos
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};


