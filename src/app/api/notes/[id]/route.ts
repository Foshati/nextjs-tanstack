import { NextRequest, NextResponse } from 'next/server';
import { mockNotes } from '@/lib/mockData';

// GET - Get single note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = mockNotes.find(n => n.id === id);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

// PUT - Update note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await request.json();
    
    const noteIndex = mockNotes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    mockNotes[noteIndex] = {
      ...mockNotes[noteIndex],
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockNotes[noteIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

// DELETE - Delete note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteIndex = mockNotes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    mockNotes.splice(noteIndex, 1);
    
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}