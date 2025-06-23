import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const logVoiceReminder = async ({ taskId, message, method }: { taskId?: string, message: string, method: string }) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const { error } = await supabase.from('voice_reminders').insert([
    {
      user_id: user.id,
      task_id: taskId || null,
      message,
      method,
    },
  ]);
  if (error) throw error;
};