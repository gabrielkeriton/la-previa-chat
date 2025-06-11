import {
  db,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from '../firebase/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';
import { roomService } from './roomService.js';

class MessageService {
  // Send message
  async sendMessage(roomId, senderId, senderName, text, type = 'text', mediaUrl = null) {
    try {
      const messagesRef = collection(db, COLLECTIONS.ROOMS, roomId, COLLECTIONS.MESSAGES);
      
      const messageData = {
        senderId,
        senderName,
        text,
        type,
        timestamp: serverTimestamp(),
        roomId
      };

      if (mediaUrl) {
        messageData.mediaUrl = mediaUrl;
      }

      await addDoc(messagesRef, messageData);
      
      // Update room's last message time
      await roomService.updateRoomLastMessage(roomId);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to messages (real-time)
  subscribeToMessages(roomId, callback, messageLimit = 50) {
    try {
      const messagesRef = collection(db, COLLECTIONS.ROOMS, roomId, COLLECTIONS.MESSAGES);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );
      
      return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        
        // Reverse to show oldest first
        callback(messages.reverse());
      });
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Get messages for a room
  async getMessages(roomId, messageLimit = 50) {
    try {
      const messagesRef = collection(db, COLLECTIONS.ROOMS, roomId, COLLECTIONS.MESSAGES);
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(messageLimit)
      );
      
      const snapshot = await getDocs(q);
      const messages = [];
      
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      
      // Reverse to show oldest first
      return messages.reverse();
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Send audio message (VIP only)
  async sendAudioMessage(roomId, senderId, senderName, audioUrl, duration) {
    try {
      return await this.sendMessage(
        roomId,
        senderId,
        senderName,
        `Audio (${duration}s)`,
        'audio',
        audioUrl
      );
    } catch (error) {
      console.error('Error sending audio message:', error);
      return { success: false, error: error.message };
    }
  }

  // Send image message
  async sendImageMessage(roomId, senderId, senderName, imageUrl, caption = '') {
    try {
      return await this.sendMessage(
        roomId,
        senderId,
        senderName,
        caption || 'Imagen',
        'image',
        imageUrl
      );
    } catch (error) {
      console.error('Error sending image message:', error);
      return { success: false, error: error.message };
    }
  }
}

export const messageService = new MessageService();


