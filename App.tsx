import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ibrbcqfwuwqcaxwwzepy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicmJjcWZ3dXdxY2F4d3d6ZXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczODMyMDIsImV4cCI6MjA4Mjk1OTIwMn0.jIo_qlel-ontRgPB9Rq3gFtrpphG-a6dt5DDFjJCuTY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);