const mockFirebase = {
  auth: () => ({
    currentUser: { uid: "test-uid" },
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: "test-uid" });
      return () => {};
    }),
    signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: "test-uid" } })),
    signOut: jest.fn(() => Promise.resolve()),
    getIdToken: jest.fn(() => Promise.resolve("test-id-token"))
  }),
  initializeApp: jest.fn()
};

export default mockFirebase;