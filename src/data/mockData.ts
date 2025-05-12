
// Mock data for the Library Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'librarian' | 'admin';
  fines: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  published: string;
  category: string;
  cover: string;
  description: string;
  available: boolean;
  location: string;
}

export interface Transaction {
  id: string;
  userId: string;
  bookId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
}

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@university.edu',
    role: 'student',
    fines: 0,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@university.edu',
    role: 'student',
    fines: 2,
  },
  {
    id: '3',
    name: 'Sarah Miller',
    email: 'sarah@university.edu',
    role: 'librarian',
    fines: 0,
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@university.edu',
    role: 'admin',
    fines: 0,
  },
];

export const books: Book[] = [
  {
    id: '1',
    title: 'Introduction to Physics',
    author: 'Robert Wilson',
    isbn: '978-3-16-148410-0',
    published: '2022-01-15',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=400',
    description: 'A comprehensive introduction to the principles of physics for university students.',
    available: true,
    location: 'A12-S3',
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    author: 'Emma Thompson',
    isbn: '978-1-56619-909-4',
    published: '2021-08-22',
    category: 'Mathematics',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400',
    description: 'An advanced guide to mathematical concepts and applications.',
    available: false,
    location: 'B23-S2',
  },
  {
    id: '3',
    title: 'Modern Literature',
    author: 'James Parker',
    isbn: '978-0-13-110362-7',
    published: '2020-03-10',
    category: 'Literature',
    cover: 'https://images.unsplash.com/photo-1531901599143-df8c80d0cf73?auto=format&fit=crop&w=400',
    description: 'An exploration of contemporary literary works and their significance.',
    available: true,
    location: 'C45-S5',
  },
  {
    id: '4',
    title: 'Computer Science Fundamentals',
    author: 'Sophia Chen',
    isbn: '978-1-4028-9462-6',
    published: '2023-05-18',
    category: 'Computer Science',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400',
    description: 'A foundational guide to computer science principles and programming.',
    available: true,
    location: 'D34-S1',
  },
  {
    id: '5',
    title: 'History of Art',
    author: 'Michael Brown',
    isbn: '978-0-684-80001-1',
    published: '2019-11-05',
    category: 'Art',
    cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400',
    description: 'A chronological journey through the major art movements and their influences.',
    available: true,
    location: 'E56-S4',
  },
  {
    id: '6',
    title: 'Biology Essentials',
    author: 'Katherine Lee',
    isbn: '978-3-16-148411-7',
    published: '2022-07-30',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400',
    description: 'A comprehensive guide to essential biological concepts and theories.',
    available: false,
    location: 'F12-S2',
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    bookId: '2',
    checkoutDate: '2025-05-01',
    dueDate: '2025-05-15',
    returnDate: null,
    status: 'borrowed',
  },
  {
    id: '2',
    userId: '2',
    bookId: '6',
    checkoutDate: '2025-04-25',
    dueDate: '2025-05-09',
    returnDate: null,
    status: 'overdue',
  },
  {
    id: '3',
    userId: '1',
    bookId: '3',
    checkoutDate: '2025-03-10',
    dueDate: '2025-03-24',
    returnDate: '2025-03-20',
    status: 'returned',
  },
];
