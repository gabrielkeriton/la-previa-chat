import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from '../firebase/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

class UserService {
  // Create user profile
  async createUserProfile(uid, profileData) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ...profileData,
        uid,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        blockedUsers: [],
        isVIP: false
      });
      return { success: true };
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, COLLECTIONS.USERS), {
          ...profileData,
          uid,
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          blockedUsers: [],
          isVIP: false
        });
        return { success: true };
      } catch (createError) {
        console.error('Error creating user profile:', createError);
        return { success: false, error: createError.message };
      }
    }
  }

  // Get user profile
  async getUserProfile(uid) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Update last seen
  async updateLastSeen(uid) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  }

  // Search users by nickname
  async searchUsers(searchTerm) {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(
        usersRef,
        where('nickname', '>=', searchTerm),
        where('nickname', '<=', searchTerm + '\uf8ff'),
        orderBy('nickname')
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Check if nickname is available
  async isNicknameAvailable(nickname, currentUid = null) {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where('nickname', '==', nickname));
      const querySnapshot = await getDocs(q);
      
      // If no users found, nickname is available
      if (querySnapshot.empty) return true;
      
      // If current user is checking their own nickname, it's available
      if (currentUid) {
        const existingUser = querySnapshot.docs[0];
        return existingUser.data().uid === currentUid;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking nickname availability:', error);
      return false;
    }
  }

  // Update VIP status
  async updateVIPStatus(uid, isVIP) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        isVIP,
        vipUpdatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating VIP status:', error);
      return { success: false, error: error.message };
    }
  }

  // Block user
  async blockUser(blockingUid, blockedUid) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, blockingUid);
      await updateDoc(userRef, {
        blockedUsers: arrayUnion(blockedUid)
      });
      return { success: true };
    } catch (error) {
      console.error('Error blocking user:', error);
      return { success: false, error: error.message };
    }
  }

  // Unblock user
  async unblockUser(blockingUid, blockedUid) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, blockingUid);
      await updateDoc(userRef, {
        blockedUsers: arrayRemove(blockedUid)
      });
      return { success: true };
    } catch (error) {
      console.error('Error unblocking user:', error);
      return { success: false, error: error.message };
    }
  }

  // Get blocked users
  async getBlockedUsers(uid) {
    try {
      const userProfile = await this.getUserProfile(uid);
      return userProfile?.blockedUsers || [];
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  }

  // Check if user is blocked
  async isUserBlocked(blockingUid, targetUid) {
    try {
      const blockedUsers = await this.getBlockedUsers(blockingUid);
      return blockedUsers.includes(targetUid);
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
      return false;
    }
  }
}

export const userService = new UserService();


