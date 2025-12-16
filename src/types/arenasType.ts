export interface AppUser {
  user_id: string;
  full_name: string;
  email: string;
  role: "player" | "coach" | "visitor";
  createdAt: string;
}