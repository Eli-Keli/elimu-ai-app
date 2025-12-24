import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { VisualAid } from '../services/sampleDocuments';
import { saveImage, shareImage } from '../utils/shareUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 40;

interface ImageViewerProps {
  visualAids: VisualAid[];
  subject?: string;
}

export default function ImageViewer({ visualAids, subject }: ImageViewerProps) {
  const { colors } = useTheme();
  const { getScaledSize } = useFontSize();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  if (visualAids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyIcon, { fontSize: getScaledSize(64) }]}>📊</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
          No visual aids available
        </Text>
      </View>
    );
  }

  const currentVisual = visualAids[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < visualAids.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSaveImage = async () => {
    const currentVisual = visualAids[currentIndex];
    const result = await saveImage(currentVisual.uri, currentVisual.title);
    
    if (result.success) {
      Alert.alert('Image Saved', 'Image has been saved to your device.');
    } else {
      Alert.alert('Save Failed', result.error || 'Unable to save image.');
    }
  };

  const handleShareImage = async () => {
    const currentVisual = visualAids[currentIndex];
    const result = await shareImage(currentVisual.uri, currentVisual.title);
    
    if (!result.success) {
      Alert.alert('Share Failed', result.error || 'Unable to share image.');
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'diagram': return '📐';
      case 'infographic': return '📊';
      case 'timeline': return '📅';
      case 'graph': return '📈';
      case 'map': return '🗺️';
      default: return '🖼️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'diagram': return '#5B47ED';
      case 'infographic': return '#FF6B9D';
      case 'timeline': return '#29B6F6';
      case 'graph': return '#4CAF50';
      case 'map': return '#FFA726';
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {subject && (
        <Text style={[styles.subject, { color: colors.text, fontSize: getScaledSize(18) }]}>
          📊 {subject} - Visual Aids
        </Text>
      )}

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.textSecondary, fontSize: getScaledSize(14) }]}>
          Visual {currentIndex + 1} of {visualAids.length}
        </Text>
        <View style={styles.progressDots}>
          {visualAids.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 10 : 6,
                  height: index === currentIndex ? 10 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(currentVisual.type) + '20' }]}>
          <Text style={[styles.typeBadgeText, { color: getTypeColor(currentVisual.type), fontSize: getScaledSize(12) }]}>
            {getTypeEmoji(currentVisual.type)} {currentVisual.type.toUpperCase()}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text, fontSize: getScaledSize(20) }]}>
          {currentVisual.title}
        </Text>

        {/* Image Card */}
        <TouchableOpacity
          style={[styles.imageCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setFullscreenVisible(true)}
          activeOpacity={0.8}
        >
          {currentVisual.uri ? (
            <Image
              source={currentVisual.uri}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}>
              <Text style={[styles.placeholderText, { color: colors.textSecondary, fontSize: getScaledSize(16) }]}>
                Image not found
              </Text>
            </View>
          )}
          <View style={[styles.zoomHint, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.zoomHintText, { color: colors.primary, fontSize: getScaledSize(12) }]}>
              👆 Tap to view fullscreen
            </Text>
          </View>
        </TouchableOpacity>

        {/* Description Card */}
        <View style={[styles.descriptionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.descriptionLabel, { color: colors.primary, fontSize: getScaledSize(12) }]}>
            DESCRIPTION
          </Text>
          <Text style={[styles.description, { color: colors.text, fontSize: getScaledSize(16) }]}>
            {currentVisual.description}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleSaveImage}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary, fontSize: getScaledSize(14) }]}>
              💾 Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleShareImage}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary, fontSize: getScaledSize(14) }]}>
              📤 Share
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.navigation, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navButtonText, { color: currentIndex === 0 ? colors.textSecondary : colors.primary, fontSize: getScaledSize(16) }]}>
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === visualAids.length - 1}
          style={[
            styles.navButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            currentIndex === visualAids.length - 1 && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navButtonText, { color: currentIndex === visualAids.length - 1 ? colors.textSecondary : colors.primary, fontSize: getScaledSize(16) }]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Modal */}
      <Modal
        visible={fullscreenVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullscreenVisible(false)}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.fullscreenClose}
            onPress={() => setFullscreenVisible(false)}
          >
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
          <ScrollView
            style={styles.fullscreenScroll}
            contentContainerStyle={styles.fullscreenScrollContent}
            maximumZoomScale={3}
            minimumZoomScale={1}
          >
            {currentVisual.uri && (
              <Image
                source={currentVisual.uri}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>
          <View style={styles.fullscreenInfo}>
            <Text style={[styles.fullscreenTitle, { fontSize: getScaledSize(16) }]}>
              {currentVisual.title}
            </Text>
            <Text style={[styles.fullscreenHint, { fontSize: getScaledSize(12) }]}>
              Pinch to zoom • Swipe to pan
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: IMAGE_WIDTH - 4,
    height: IMAGE_WIDTH * 0.75,
  },
  imagePlaceholder: {
    width: IMAGE_WIDTH - 4,
    height: IMAGE_WIDTH * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
  zoomHint: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  zoomHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenScroll: {
    flex: 1,
  },
  fullscreenScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  fullscreenInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
  },
  fullscreenTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fullscreenHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});
