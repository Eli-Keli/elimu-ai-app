import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface Note {
  id: string;
  documentId: string;
  content: string;
  timestamp: number;
  lastEdited?: number;
}

interface NotesContextType {
  notes: Note[];
  addNote: (documentId: string, content: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesForDocument: (documentId: string) => Note[];
  isLoading: boolean;
}

// Context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Storage key
const NOTES_STORAGE_KEY = '@elimu_notes';

// Provider
export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Load notes from storage
  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes);
        console.log(`[Notes] Loaded ${parsedNotes.length} notes from storage`);
      }
    } catch (error) {
      console.error('[Notes] Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save notes to storage
  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      console.log(`[Notes] Saved ${updatedNotes.length} notes to storage`);
    } catch (error) {
      console.error('[Notes] Failed to save notes:', error);
      throw error;
    }
  };

  // Add a new note
  const addNote = async (documentId: string, content: string) => {
    try {
      const newNote: Note = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        documentId,
        content: content.trim(),
        timestamp: Date.now(),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      
      console.log(`[Notes] Added note for document: ${documentId}`);
    } catch (error) {
      console.error('[Notes] Failed to add note:', error);
      throw error;
    }
  };

  // Update an existing note
  const updateNote = async (id: string, content: string) => {
    try {
      const updatedNotes = notes.map(note =>
        note.id === id
          ? { ...note, content: content.trim(), lastEdited: Date.now() }
          : note
      );

      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      
      console.log(`[Notes] Updated note: ${id}`);
    } catch (error) {
      console.error('[Notes] Failed to update note:', error);
      throw error;
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      
      console.log(`[Notes] Deleted note: ${id}`);
    } catch (error) {
      console.error('[Notes] Failed to delete note:', error);
      throw error;
    }
  };

  // Get notes for a specific document
  const getNotesForDocument = (documentId: string): Note[] => {
    return notes
      .filter(note => note.documentId === documentId)
      .sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  };

  const value: NotesContextType = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForDocument,
    isLoading,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

// Hook
export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
}
