import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '../firebase/firebase.js';

class StorageService {
  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      const fileRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload audio message
  async uploadAudio(userId, audioBlob, roomId) {
    try {
      const fileName = `audio_${Date.now()}.webm`;
      const fileRef = ref(storage, `audio-messages/${roomId}/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(fileRef, audioBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading audio:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload image message
  async uploadImage(userId, file, roomId) {
    try {
      const fileRef = ref(storage, `image-messages/${roomId}/${userId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete file
  async deleteFile(fileUrl) {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate file type and size
  validateFile(file, allowedTypes, maxSize) {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Tipo de archivo no permitido' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'El archivo es demasiado grande' };
    }

    return { isValid: true };
  }
}

export const storageService = new StorageService();


