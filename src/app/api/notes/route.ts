import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    const { title, content, userId } = await request.json();
    
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
      include: {
        user: true,
      },
    });
    
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}