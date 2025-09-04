// Shared mock data store
export let mockNotes = [
  {
    id: '1',
    title: 'First Note',
    content: 'This is my first note',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    user: {
      id: 'user-1',
      name: 'John Doe'
    }
  }
];

export const updateMockNotes = (notes: typeof mockNotes) => {
  mockNotes.length = 0;
  mockNotes.push(...notes);
};