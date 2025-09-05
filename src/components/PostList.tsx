"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

interface NewNote {
  title: string;
  content: string;
  userId: string;
  userName: string;
}

const fetchNotes = async (): Promise<Note[]> => {
  const res = await axios.get("/api/notes");
  return res.data;
};

const createNote = async (newNote: NewNote): Promise<Note> => {
  const res = await axios.post("/api/notes", {
    title: newNote.title,
    content: newNote.content,
    userId: newNote.userId,
    user: { name: newNote.userName }
  });
  return res.data;
};

const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`/api/notes/${id}`);
};

const updateNote = async (note: { id: string; title: string; content: string }): Promise<Note> => {
  const res = await axios.put(`/api/notes/${note.id}`, {
    title: note.title,
    content: note.content
  });
  return res.data;
};

export default function NoteList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setOpen(false);
      setTitle("");
      setContent("");
      setUserName("");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, () => crypto.randomUUID()).map((id) => (
          <Card key={id}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Post
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded h-24"
              />
              <button
                type="button"
                onClick={() => createMutation.mutate({ title, content, userId: "user-1", userName })}
                disabled={!title || !content || !userName}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Add Note
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {notes?.map((note: Note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingNote?.id === note.id ? (
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  note.title
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingNote?.id === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingNote.content || ""}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    className="w-full p-2 border rounded h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateMutation.mutate({ id: editingNote.id, title: editingNote.title, content: editingNote.content || "" })}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNote(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">{note.content}</p>
                  <p className="text-sm text-gray-400 mb-2">{note.user.name}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingNote(note)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(note.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

