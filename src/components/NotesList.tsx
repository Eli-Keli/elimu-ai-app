import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Note } from '../contexts/NotesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  const { themeMode, colors } = useTheme();
  const { getScaledSize } = useFontSize();

  const isDark = themeMode === 'dark';
  const backgroundColor = isDark ? '#2a2a2a' : '#f5f5f5';
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? '#aaa' : '#666';
  const borderColor = isDark ? '#444' : '#e0e0e0';

  const handleDelete = (id: string, content: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete this note?\n\n"${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (notes.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: secondaryTextColor, fontSize: getScaledSize(16) }]}>
          📝 No notes yet
        </Text>
        <Text style={[styles.emptySubtext, { color: secondaryTextColor, fontSize: getScaledSize(14) }]}>
          Tap "Add Note" to capture your thoughts
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.map((note) => (
        <View
          key={note.id}
          style={[styles.noteCard, { backgroundColor, borderColor }]}
        >
          {/* Note Content */}
          <Text style={[styles.noteContent, { color: textColor, fontSize: getScaledSize(16) }]}>
            {note.content}
          </Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            <Text style={[styles.timestamp, { color: secondaryTextColor, fontSize: getScaledSize(13) }]}>
              📅 {formatDate(note.lastEdited || note.timestamp)}
              {note.lastEdited && ' (edited)'}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(note)}
              accessibilityLabel="Edit note"
              accessibilityHint="Opens editor to modify this note"
            >
              <Text style={[styles.actionButtonText, { fontSize: getScaledSize(14) }]}>
                ✏️ Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(note.id, note.content)}
              accessibilityLabel="Delete note"
              accessibilityHint="Removes this note permanently"
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText, { fontSize: getScaledSize(14) }]}>
                🗑️ Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyContainer: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  noteContent: {
    lineHeight: 22,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  editButton: {
    backgroundColor: '#6200ee15',
    borderColor: '#6200ee',
  },
  deleteButton: {
    backgroundColor: '#ff000015',
    borderColor: '#ff0000',
  },
  actionButtonText: {
    fontWeight: '600',
    color: '#6200ee',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
});
