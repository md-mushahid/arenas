export type AppUser = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

// in-memory storage
let currentUser: AppUser | null = null;

export const userStore = {
  set(user: AppUser) {
    currentUser = user;
  },
  get() {
    return currentUser;
  },
  clear() {
    currentUser = null;
  },
};
