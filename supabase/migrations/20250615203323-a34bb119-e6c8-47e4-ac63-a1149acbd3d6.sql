
-- Create custom types for roles, resource types, and transaction statuses
CREATE TYPE public.app_role AS ENUM ('student', 'librarian', 'admin');
CREATE TYPE public.resource_type AS ENUM ('book', 'journal', 'ebook', 'article', 'audio', 'video', 'physical', 'electronic');
CREATE TYPE public.transaction_status AS ENUM ('borrowed', 'returned', 'overdue', 'reserved');

-- Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role app_role NOT NULL DEFAULT 'student',
  fines NUMERIC(10, 2) DEFAULT 0
);

-- Add comments to the profiles table
COMMENT ON TABLE public.profiles IS 'Public profile data for each user.';

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- This trigger automatically creates a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Create the resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  type resource_type NOT NULL,
  isbn TEXT,
  issn TEXT,
  doi TEXT,
  barcode TEXT,
  qr_id TEXT,
  publisher TEXT,
  published_date DATE,
  category TEXT,
  cover TEXT,
  description TEXT,
  available BOOLEAN DEFAULT TRUE,
  location TEXT,
  is_digital BOOLEAN DEFAULT FALSE,
  url TEXT,
  file_format TEXT,
  language TEXT,
  edition TEXT,
  pages INTEGER,
  keywords TEXT[],
  date_added TIMESTAMPTZ DEFAULT NOW(),
  quantity INTEGER,
  UNIQUE(isbn),
  UNIQUE(barcode)
);

-- Add comments to the resources table
COMMENT ON TABLE public.resources IS 'Stores all library resources like books, journals, etc.';

-- Set up RLS for resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resources are viewable by authenticated users." ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Librarians and admins can manage resources." ON public.resources FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('librarian', 'admin')
);

-- Create the transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE RESTRICT,
  checkout_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  status transaction_status NOT NULL
);

-- Add comments to the transactions table
COMMENT ON TABLE public.transactions IS 'Tracks borrowing and returning of resources.';

-- Set up RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Librarians and admins can view all transactions." ON public.transactions FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('librarian', 'admin')
);
CREATE POLICY "Librarians and admins can create transactions." ON public.transactions FOR INSERT WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('librarian', 'admin')
);
CREATE POLICY "Librarians and admins can update transactions." ON public.transactions FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('librarian', 'admin')
);
