import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET - Get all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    const { title, content, userId = "user-1", userName = "Default User" } = await request.json();

    // Create or find user
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { name: userName },
      create: { id: userId, name: userName },
    });

    const newNote = await prisma.note.create({
      data: { title, content, userId: user.id },
      include: { user: true },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
