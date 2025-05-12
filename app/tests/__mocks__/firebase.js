const mockAuth = {
  currentUser: { uid: "test-uid" },
  onAuthStateChanged: jest.fn((callback) => callback(mockAuth.currentUser)),
  getIdToken: jest.fn(() => Promise.resolve("test-id-token")),
};

const firebase = {
  auth: jest.fn(() => mockAuth),
  initializeApp: jest.fn(),
};

export default firebase;