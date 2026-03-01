import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase/client";
import { useEffect, useState } from "react";
import { uploadJobImage } from "../lib/supabase/storage";

export interface JobsUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface Job {
  id: string;
  user_id: string;
  image_url?: string;
  description?: string;
  title: string;
  category?: string;
  contact_name?: string;
  email: string;
  phone_number?: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  location: string;
  negotiable: boolean;
  min_price: string;
  max_price: string;
  profiles?: JobsUser;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(
          `
            *,
            profiles(id, name, username, profile_image_url)`,
        )
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (jobsError) {
        console.error("Error loading jobs:", jobsError);
        throw jobsError;
      }

      if (!jobsData || jobsData.length === 0) {
        setJobs([]);
        return;
      }

      const jobsWithProfiles = jobsData.map((job) => ({
        ...job,
        profiles: job.profiles || null,
      }));

      setJobs(jobsWithProfiles);
    } catch (error) {
      console.error("Error in loadJobs:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const createJob = async (
    title: string, email: string, imageUri?: string, category?: string, 
    description?: string, location?: string, negotiable?: boolean, minPrice?: string, maxPrice?: string, 
    contactName?: string, phoneNumber?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    try {
      // Deactivate any existing jobs
      // const { error: deactivateError } = await supabase
      //   .from("jobs")
      //   .update({ is_active: false })
      //   .eq("user_id", user.id)
      //   .eq("is_active", true);
      // if (deactivateError) {
      //   console.error("Error deactivating old jobs:", deactivateError);
      // }
      const imageUrl = imageUri ? await uploadJobImage(user.id, imageUri) : null;

      // Calculate expiration time
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from("jobs")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          title: title,
          category: category || null,
          description: description || null,
          location: location || null,
          negotiable: negotiable || false,
          min_price: minPrice || null,
          max_price: maxPrice || null,
          contact_name: contactName || null,
          email: email,
          phone_number: phoneNumber || null,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating job:", error);
        throw error;
      }

      // Refresh jobs
      await loadJobs();
    } catch (error) {
      console.error("Error in createJob:", error);
      throw error;
    }
  };

  const refreshJobs = async () => {
    await loadJobs();
  };

  return { createJob, jobs, refreshJobs };
};