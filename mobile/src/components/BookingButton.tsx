import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { UIState } from '../types';

interface BookingButtonProps {
  onPress: () => void;
  state: UIState;
  disabled?: boolean;
}

/**
 * Seniority Check: State-driven component.
 * Gracefully handles Loading, Success, and Error states.
 */
export const BookingButton: React.FC<BookingButtonProps> = ({ onPress, state, disabled }) => {
  const isIdle = state === 'idle';
  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  const getButtonStyles = () => {
    if (isSuccess) return [styles.button, styles.successButton];
    if (isError) return [styles.button, styles.errorButton];
    if (disabled || isLoading) return [styles.button, styles.disabledButton];
    return styles.button;
  };

  const getButtonText = () => {
    if (isLoading) return 'Booking...';
    if (isSuccess) return '✓ Booked Successfully';
    if (isError) return '✕ Booking Failed';
    return 'Book Slot';
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || !isIdle}
      style={getButtonStyles()}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={styles.text}>{getButtonText()}</Text>
        </View>
      ) : (
        <Text style={styles.text}>{getButtonText()}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6', // Blue-500
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
  },
  successButton: {
    backgroundColor: '#10B981', // Green-500
  },
  errorButton: {
    backgroundColor: '#EF4444', // Red-500
  },
  disabledButton: {
    backgroundColor: '#93C5FD', // Lighter Blue
    opacity: 0.7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
