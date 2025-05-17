// UserRole type shared between AuthContext and redux types
export type UserRole = "admin" | "subcontractor" | "client" | null;

// Optionally, you can move the User interface here if both files need it
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
