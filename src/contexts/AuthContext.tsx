
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Define the shape of a user profile based on our database table
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'student' | 'librarian' | 'admin';
  fines: number | null;
}

interface AuthContextType {
  currentUser: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();
  
  // This effect listens for changes in authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Fetches the user's profile from the 'profiles' table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCurrentUser(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Could not fetch user profile.",
        variant: "destructive",
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Call our edge function to perform login
    const { data: functionData, error } = await supabase.functions.invoke('login-with-password', {
        body: { email, password },
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    const { session, error: signInError } = functionData;

    if (signInError) {
       toast({
        title: "Login Failed",
        description: signInError.message || "Invalid email or password.",
        variant: "destructive",
      });
      return false;
    }
    
    // Manually set the session on the client
    await supabase.auth.setSession(session);

    // The onAuthStateChange listener will automatically fetch the profile
    toast({
      title: "Login Successful",
      description: `Welcome back!`,
    });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSession(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  );
};
