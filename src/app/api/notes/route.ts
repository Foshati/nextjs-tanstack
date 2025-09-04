import { NextRequest, NextResponse } from 'next/server';
import { mockNotes } from '@/lib/mockData';

// GET - Get all notes
export async function GET() {
  try {
    return NextResponse.json(mockNotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    const { title, content, userId } = await request.json();
    
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      user: {
        id: userId,
        name: 'Mock User'
      }
    };
    
    mockNotes.unshift(newNote);
    
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}