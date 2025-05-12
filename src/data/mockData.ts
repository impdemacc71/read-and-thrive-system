// Mock data for the Library Management System

export type ResourceType = 'book' | 'journal' | 'ebook' | 'article' | 'audio' | 'video';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'librarian' | 'admin';
  fines: number;
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  type: ResourceType;
  isbn?: string;
  issn?: string;
  doi?: string;
  barcode?: string;
  publisher: string;
  published: string;
  category: string;
  cover: string;
  description: string;
  available: boolean;
  location: string;
  digital: boolean;
  url?: string;
  fileFormat?: string;
  language: string;
  edition?: string;
  pages?: number;
  keywords: string[];
  dateAdded: string;
}

export interface Transaction {
  id: string;
  userId: string;
  resourceId: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'borrowed' | 'returned' | 'overdue' | 'reserved';
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

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Physics',
    author: 'Robert Wilson',
    type: 'book',
    isbn: '978-3-16-148410-0',
    barcode: '9783161484100',
    publisher: 'Academic Press',
    published: '2022-01-15',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=400',
    description: 'A comprehensive introduction to the principles of physics for university students.',
    available: true,
    location: 'A12-S3',
    digital: false,
    language: 'English',
    edition: '3rd',
    pages: 450,
    keywords: ['physics', 'mechanics', 'thermodynamics'],
    dateAdded: '2024-10-15',
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    author: 'Emma Thompson',
    type: 'book',
    isbn: '978-1-56619-909-4',
    barcode: '9781566199094',
    publisher: 'University Press',
    published: '2021-08-22',
    category: 'Mathematics',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400',
    description: 'An advanced guide to mathematical concepts and applications.',
    available: false,
    location: 'B23-S2',
    digital: false,
    language: 'English',
    edition: '2nd',
    pages: 380,
    keywords: ['mathematics', 'calculus', 'algebra'],
    dateAdded: '2024-09-10',
  },
  {
    id: '3',
    title: 'Modern Literature',
    author: 'James Parker',
    type: 'book',
    isbn: '978-0-13-110362-7',
    barcode: '9780131103627',
    publisher: 'Literary House',
    published: '2020-03-10',
    category: 'Literature',
    cover: 'https://images.unsplash.com/photo-1531901599143-df8c80d0cf73?auto=format&fit=crop&w=400',
    description: 'An exploration of contemporary literary works and their significance.',
    available: true,
    location: 'C45-S5',
    digital: false,
    language: 'English',
    edition: '1st',
    pages: 320,
    keywords: ['literature', 'modern', 'analysis'],
    dateAdded: '2024-05-20',
  },
  {
    id: '4',
    title: 'Computer Science Fundamentals',
    author: 'Sophia Chen',
    type: 'ebook',
    isbn: '978-1-4028-9462-6',
    publisher: 'Tech Publishing',
    published: '2023-05-18',
    category: 'Computer Science',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400',
    description: 'A foundational guide to computer science principles and programming.',
    available: true,
    location: 'Digital Library',
    digital: true,
    url: 'https://library.university.edu/ebooks/cs-fundamentals',
    fileFormat: 'PDF',
    language: 'English',
    edition: '5th',
    pages: 520,
    keywords: ['computer science', 'programming', 'algorithms'],
    dateAdded: '2025-01-05',
  },
  {
    id: '5',
    title: 'History of Art',
    author: 'Michael Brown',
    type: 'book',
    isbn: '978-0-684-80001-1',
    barcode: '9780684800011',
    publisher: 'Art House',
    published: '2019-11-05',
    category: 'Art',
    cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400',
    description: 'A chronological journey through the major art movements and their influences.',
    available: true,
    location: 'E56-S4',
    digital: false,
    language: 'English',
    edition: '4th',
    pages: 500,
    keywords: ['art', 'history', 'movements'],
    dateAdded: '2024-08-12',
  },
  {
    id: '6',
    title: 'Biology Essentials',
    author: 'Katherine Lee',
    type: 'book',
    isbn: '978-3-16-148411-7',
    barcode: '9783161484117',
    publisher: 'Science Press',
    published: '2022-07-30',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400',
    description: 'A comprehensive guide to essential biological concepts and theories.',
    available: false,
    location: 'F12-S2',
    digital: false,
    language: 'English',
    edition: '6th',
    pages: 420,
    keywords: ['biology', 'cells', 'genetics'],
    dateAdded: '2024-11-20',
  },
  {
    id: '7',
    title: 'Journal of Advanced Physics',
    author: 'Various Authors',
    type: 'journal',
    issn: '2163-0429',
    publisher: 'Scientific Society',
    published: '2024-04-15',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&w=400',
    description: 'A quarterly journal featuring the latest research in advanced physics.',
    available: true,
    location: 'J12-S4',
    digital: false,
    language: 'English',
    pages: 120,
    keywords: ['physics', 'research', 'academic'],
    dateAdded: '2025-04-20',
  },
  {
    id: '8',
    title: 'Quantum Computing: A New Era',
    author: 'Alan Rogers',
    type: 'article',
    doi: '10.1145/3582016',
    publisher: 'Computing Research Association',
    published: '2025-02-10',
    category: 'Computer Science',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400',
    description: 'Research article discussing the advancements in quantum computing.',
    available: true,
    location: 'Digital Repository',
    digital: true,
    url: 'https://library.university.edu/articles/quantum-computing',
    fileFormat: 'PDF',
    language: 'English',
    pages: 18,
    keywords: ['quantum computing', 'research', 'technology'],
    dateAdded: '2025-03-01',
  },
  {
    id: '9',
    title: 'Introduction to Astronomy',
    author: 'Neil Peterson',
    type: 'video',
    barcode: '0045678901234',
    publisher: 'Educational Media',
    published: '2024-01-20',
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400',
    description: 'Video series introducing the fundamentals of astronomy and space science.',
    available: true,
    location: 'Media Section',
    digital: true,
    url: 'https://library.university.edu/media/intro-astronomy',
    fileFormat: 'MP4',
    language: 'English',
    keywords: ['astronomy', 'space', 'education'],
    dateAdded: '2024-02-15',
  },
  {
    id: '10',
    title: 'Classical Music Collection',
    author: 'Various Artists',
    type: 'audio',
    barcode: '0056789012345',
    publisher: 'Music Archive',
    published: '2023-11-10',
    category: 'Music',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400',
    description: 'Collection of classical music pieces from renowned composers.',
    available: true,
    location: 'Audio Section',
    digital: true,
    url: 'https://library.university.edu/audio/classical-collection',
    fileFormat: 'MP3',
    language: 'Multiple',
    keywords: ['music', 'classical', 'composers'],
    dateAdded: '2023-12-05',
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    resourceId: '2',
    checkoutDate: '2025-05-01',
    dueDate: '2025-05-15',
    returnDate: null,
    status: 'borrowed',
  },
  {
    id: '2',
    userId: '2',
    resourceId: '6',
    checkoutDate: '2025-04-25',
    dueDate: '2025-05-09',
    returnDate: null,
    status: 'overdue',
  },
  {
    id: '3',
    userId: '1',
    resourceId: '3',
    checkoutDate: '2025-03-10',
    dueDate: '2025-03-24',
    returnDate: '2025-03-20',
    status: 'returned',
  },
];
