import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
  session: unknown | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Replace with real Supabase/Cloud auth implementation
  const value: AuthContextType = {
    session: null,
    role: null,
    loading: false,
    signIn: async () => "Auth not configured yet",
    signUp: async () => "Auth not configured yet",
    signOut: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
