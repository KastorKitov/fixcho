import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase/client";

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    profileImage?: string;
    onboardingCompleted: boolean;
}

interface AuthContextType {
    user: User | null;
    signUp: (email: string, password: string) => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    
    const signIn = async (email: string, password: string) => {};

    const signUp = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        if (data.user) {
            console.log("User signed up:", data);
        }
    };

    return <AuthContext.Provider value={{ user, signUp }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};