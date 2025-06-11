import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from '../firebase/firebase.js';
import { COLLECTIONS, DEFAULT_ROOMS } from '../utils/constants.js';

class RoomService {
  // Initialize default rooms
  async initializeDefaultRooms() {
    try {
      const roomsRef = collection(db, COLLECTIONS.ROOMS);
      const snapshot = await getDocs(roomsRef);
      
      // If no rooms exist, create default ones
      if (snapshot.empty) {
        for (const room of DEFAULT_ROOMS) {
          await addDoc(roomsRef, {
            ...room,
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            participantCount: 0,
            activeUsers: []
          });
        }
      }
    } catch (error) {
      console.error('Error initializing default rooms:', error);
    }
  }

  // Get all rooms
  async getRooms() {
    try {
      const roomsRef = collection(db, COLLECTIONS.ROOMS);
      const q = query(roomsRef, orderBy('lastMessageAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const rooms = [];
      snapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      
      return rooms;
    } catch (error) {
      console.error('Error getting rooms:', error);
      return [];
    }
  }

  // Subscribe to rooms (real-time)
  subscribeToRooms(callback) {
    try {
      const roomsRef = collection(db, COLLECTIONS.ROOMS);
      const q = query(roomsRef, orderBy('lastMessageAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const rooms = [];
        snapshot.forEach((doc) => {
          rooms.push({ id: doc.id, ...doc.data() });
        });
        callback(rooms);
      });
    } catch (error) {
      console.error('Error subscribing to rooms:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Create new room
  async createRoom(roomData) {
    try {
      const roomsRef = collection(db, COLLECTIONS.ROOMS);
      const docRef = await addDoc(roomsRef, {
        ...roomData,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        participantCount: 0,
        activeUsers: []
      });
      
      return { success: true, roomId: docRef.id };
    } catch (error) {
      console.error('Error creating room:', error);
      return { success: false, error: error.message };
    }
  }

  // Update room last message time
  async updateRoomLastMessage(roomId) {
    try {
      const roomRef = doc(db, COLLECTIONS.ROOMS, roomId);
      await updateDoc(roomRef, {
        lastMessageAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating room last message:', error);
    }
  }

  // Join room (add user to active users)
  async joinRoom(roomId, userId) {
    try {
      const roomRef = doc(db, COLLECTIONS.ROOMS, roomId);
      
      // Note: In a real implementation, you'd use arrayUnion to add the user
      // and implement proper user tracking. For this demo, we'll keep it simple.
      await updateDoc(roomRef, {
        lastActivityAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error joining room:', error);
      return { success: false, error: error.message };
    }
  }

  // Leave room (remove user from active users)
  async leaveRoom(roomId, userId) {
    try {
      const roomRef = doc(db, COLLECTIONS.ROOMS, roomId);
      
      // Note: In a real implementation, you'd use arrayRemove to remove the user
      await updateDoc(roomRef, {
        lastActivityAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error leaving room:', error);
      return { success: false, error: error.message };
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const roomRef = doc(db, COLLECTIONS.ROOMS, roomId);
      const roomSnap = await getDoc(roomRef);
      
      if (roomSnap.exists()) {
        return { id: roomSnap.id, ...roomSnap.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting room by ID:', error);
      return null;
    }
  }
}

export const roomService = new RoomService();


