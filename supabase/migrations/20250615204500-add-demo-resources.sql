
-- Insert demo resources only (no users since they must be created through auth)
INSERT INTO public.resources (title, author, type, isbn, category, cover, description, available, location, pages, quantity) VALUES
  ('Introduction to Computer Science', 'Dr. Alan Smith', 'book', '978-0123456789', 'Computer Science', '/placeholder.svg', 'A comprehensive introduction to computer science fundamentals.', true, 'Floor 2, Section A', 450, 3),
  ('Advanced Mathematics', 'Prof. Maria Garcia', 'book', '978-0987654321', 'Mathematics', '/placeholder.svg', 'Advanced mathematical concepts for engineering students.', true, 'Floor 3, Section B', 680, 2),
  ('Digital Library Systems', 'Dr. Robert Brown', 'ebook', '978-0456789123', 'Information Science', '/placeholder.svg', 'Modern approaches to digital library management.', true, 'Digital Collection', 320, 1),
  ('Physics Fundamentals', 'Dr. Lisa Chen', 'book', '978-0789123456', 'Physics', '/placeholder.svg', 'Core principles of physics for undergraduate students.', true, 'Floor 2, Section C', 520, 5),
  ('History of Art', 'Prof. James Taylor', 'book', '978-0321654987', 'Art History', '/placeholder.svg', 'Comprehensive overview of art history from ancient to modern times.', true, 'Floor 1, Section D', 380, 4),
  ('Database Management Systems', 'Dr. Jennifer Wong', 'book', '978-0555666777', 'Computer Science', '/placeholder.svg', 'Complete guide to database design and management.', true, 'Floor 2, Section A', 600, 2),
  ('Modern Chemistry', 'Prof. David Lee', 'book', '978-0888999000', 'Chemistry', '/placeholder.svg', 'Contemporary approaches to chemical analysis.', true, 'Floor 3, Section C', 540, 3),
  ('World Literature', 'Dr. Emily Foster', 'ebook', '978-0111222333', 'Literature', '/placeholder.svg', 'Survey of world literature from various cultures.', true, 'Digital Collection', 400, 1),
  ('Environmental Science', 'Prof. Michael Green', 'book', '978-0444555666', 'Environmental Science', '/placeholder.svg', 'Current issues in environmental science and policy.', true, 'Floor 1, Section E', 480, 2),
  ('Programming Fundamentals', 'Dr. Sarah Kim', 'book', '978-0777888999', 'Computer Science', '/placeholder.svg', 'Introduction to programming concepts and practices.', true, 'Floor 2, Section A', 350, 4);
