import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CapacityIndicatorProps {
  percentage: number;
  label?: string;
}

/**
 * Seniority Check: Reusable, strictly typed component.
 * Uses a progress bar for clear visibility of gym capacity.
 */
export const CapacityIndicator: React.FC<CapacityIndicatorProps> = ({ percentage, label }) => {
  const getStatusColor = (p: number) => {
    if (p < 50) return '#4ADE80'; // Green
    if (p < 85) return '#FBBF24'; // Yellow
    return '#F87171'; // Red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label || 'Live Capacity'}</Text>
        <Text style={[styles.percentage, { color: getStatusColor(percentage) }]}>
          {percentage}%
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${Math.min(100, percentage)}%`, backgroundColor: getStatusColor(percentage) }
          ]} 
        />
      </View>
      <Text style={styles.statusText}>
        {percentage >= 90 ? 'Peak Hours - Extremely Busy' : percentage >= 70 ? 'Busy' : 'Usually Quiet'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  statusText: {
    marginTop: 10,
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  }
});
