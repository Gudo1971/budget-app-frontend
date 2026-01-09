import { createContext, useContext } from "react";

type User = {
  id: string;
  name: string;
};

export const UserContext = createContext<User | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used within a UserProvider");
  return user;
}
