export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: "player" | "coach";
  createdAt: string;
}