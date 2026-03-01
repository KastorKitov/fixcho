import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    profileImage?: string;
    onboardingCompleted?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
    signOut: () => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking session:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchUserProfile = async (userId: string): Promise<User | null> => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();
            if (error) {
                throw error;
            }
            if (!data) {
                console.error("No profile data returned");
                return null;
            }
            const authUser = await supabase.auth.getUser();
            if (!authUser.data.user) {
                console.error("No authenticated user found");
                return null;
            }

            return {
                id: data.id,
                name: data.name,
                email: authUser.data.user.email || "",
                username: data.username,
                role: data.role,
                profileImage: data.profile_image_url,
                onboardingCompleted: data.onboarding_completed,
            };
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
        }
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!user) {
            throw new Error("User not authenticated");
        }

        try {
            const updateData: any = {};
            if (userData.name !== undefined) updateData.name = userData.name;
            if (userData.username !== undefined) updateData.username = userData.username;
            if (userData.email !== undefined) updateData.email = userData.email;
            if (userData.role !== undefined) updateData.role = userData.role;
            if (userData.profileImage !== undefined) updateData.profile_image_url = userData.profileImage;
            if (userData.onboardingCompleted !== undefined) updateData.onboarding_completed = userData.onboardingCompleted;

            const { error } = await supabase.from("profiles").update(updateData).eq("id", user.id);
            if (error) {
                throw error;
            }
            setUser({ ...user, ...userData });
        } catch (error) {
            throw error;
        }
    }

    return <AuthContext.Provider value={{ user, signUp, updateUser, signIn, isLoading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};