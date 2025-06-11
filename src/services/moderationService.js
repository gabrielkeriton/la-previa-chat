import {
  db,
  collection,
  addDoc,
  serverTimestamp
} from '../firebase/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

class ModerationService {
  // Report user
  async reportUser(reporterId, reportedId, reason, description = '') {
    try {
      const reportsRef = collection(db, COLLECTIONS.REPORTS);
      
      await addDoc(reportsRef, {
        reporterId,
        reportedId,
        type: 'user',
        reason,
        description,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error reporting user:', error);
      return { success: false, error: error.message };
    }
  }

  // Report message
  async reportMessage(reporterId, messageId, roomId, reason, description = '') {
    try {
      const reportsRef = collection(db, COLLECTIONS.REPORTS);
      
      await addDoc(reportsRef, {
        reporterId,
        messageId,
        roomId,
        type: 'message',
        reason,
        description,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error reporting message:', error);
      return { success: false, error: error.message };
    }
  }

  // Report room
  async reportRoom(reporterId, roomId, reason, description = '') {
    try {
      const reportsRef = collection(db, COLLECTIONS.REPORTS);
      
      await addDoc(reportsRef, {
        reporterId,
        roomId,
        type: 'room',
        reason,
        description,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error reporting room:', error);
      return { success: false, error: error.message };
    }
  }
}

export const moderationService = new ModerationService();


