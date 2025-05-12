import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Update the Firebase mock to be available globally
global.firebase = {
  auth: () => ({
    currentUser: { 
      uid: "test-uid",
      getIdToken: vi.fn(() => Promise.resolve("test-id-token")) // Add getIdToken to currentUser
    },
    onAuthStateChanged: vi.fn((callback) => {
      callback({ 
        uid: "test-uid",
        getIdToken: vi.fn(() => Promise.resolve("test-id-token")) // Add getIdToken to callback user
      });
      return () => {};
    }),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    getIdToken: vi.fn(() => Promise.resolve("test-id-token"))
  }),
  initializeApp: vi.fn()
};

// Clean up mock state between tests
beforeEach(() => {
  global.firebase.auth().onAuthStateChanged.mockClear();
  global.firebase.auth().getIdToken.mockClear();
});