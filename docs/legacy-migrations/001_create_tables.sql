-- Create admins table
-- This table stores user IDs of authorized admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy: Only admins can read the admins table
CREATE POLICY "Admins can read admins table"
  ON admins
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admins));

-- Create rush_events table
-- This table stores rush schedule events
CREATE TABLE IF NOT EXISTS rush_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  datetime TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  button_label TEXT,
  button_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE rush_events ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can read rush events (public)
CREATE POLICY "Rush events are publicly readable"
  ON rush_events
  FOR SELECT
  USING (true);

-- Create policy: Only admins can insert/update/delete rush events
CREATE POLICY "Admins can manage rush events"
  ON rush_events
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rush_events_updated_at
  BEFORE UPDATE ON rush_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index on order_index for faster sorting
CREATE INDEX IF NOT EXISTS idx_rush_events_order_index ON rush_events(order_index);

