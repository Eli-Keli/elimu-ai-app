import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent?: string;
  mode: 'add' | 'edit';
}

export function NoteModal({
  visible,
  onClose,
  onSave,
  initialContent = '',
  mode,
}: NoteModalProps) {
  const { themeMode, colors } = useTheme();
  const { getScaledSize } = useFontSize();
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, visible]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
      onClose();
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    onClose();
  };

  const isDark = themeMode === 'dark';
  const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#333' : '#e0e0e0';
  const placeholderColor = isDark ? '#888' : '#999';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Text style={[styles.title, { color: textColor, fontSize: getScaledSize(18) }]}>
              {mode === 'add' ? '💭 Add Note' : '✏️ Edit Note'}
            </Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                  color: textColor,
                  borderColor,
                  fontSize: getScaledSize(16),
                },
              ]}
              multiline
              numberOfLines={10}
              value={content}
              onChangeText={setContent}
              placeholder="Write your note here..."
              placeholderTextColor={placeholderColor}
              autoFocus
              textAlignVertical="top"
            />

            <Text style={[styles.hint, { color: placeholderColor, fontSize: getScaledSize(13) }]}>
              💡 Tip: Add important points, questions, or reminders about this content
            </Text>
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { borderTopColor: borderColor }]}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: textColor, fontSize: getScaledSize(16) }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: colors.primary },
                !content.trim() && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!content.trim()}
            >
              <Text style={[styles.buttonText, styles.saveButtonText, { fontSize: getScaledSize(16) }]}>
                {mode === 'add' ? 'Add Note' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    minHeight: 150,
    marginBottom: 12,
  },
  hint: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    // backgroundColor applied inline from theme colors
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
  },
});
