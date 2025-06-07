/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text)
      - `created_at` (timestamp)
      - `settings` (jsonb) - stores user preferences
      - `is_premium` (boolean)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `duration` (integer)
      - `color_code` (text)
      - `icon` (text)
      - `completed` (boolean)
      - `scheduled_time` (timestamp)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `routines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `is_premium` (boolean)
      - `created_at` (timestamp)
    
    - `routine_tasks`
      - `id` (uuid, primary key)
      - `routine_id` (uuid, foreign key)
      - `name` (text)
      - `duration` (integer)
      - `color_code` (text)
      - `icon` (text)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `task_id` (uuid, foreign key)
      - `focus_level` (integer)
      - `distractions` (text[])
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}',
  is_premium boolean DEFAULT false
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration integer NOT NULL,
  color_code text NOT NULL,
  icon text NOT NULL,
  completed boolean DEFAULT false,
  scheduled_time timestamptz NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own routines"
  ON routines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create routine_tasks table
CREATE TABLE IF NOT EXISTS routine_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid REFERENCES routines(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration integer NOT NULL,
  color_code text NOT NULL,
  icon text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access routine tasks through routines"
  ON routine_tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_tasks.routine_id
      AND routines.user_id = auth.uid()
    )
  );

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  focus_level integer NOT NULL CHECK (focus_level BETWEEN 1 AND 5),
  distractions text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_scheduled_time_idx ON tasks(scheduled_time);
CREATE INDEX IF NOT EXISTS routines_user_id_idx ON routines(user_id);
CREATE INDEX IF NOT EXISTS routine_tasks_routine_id_idx ON routine_tasks(routine_id);
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS mood_entries_task_id_idx ON mood_entries(task_id);