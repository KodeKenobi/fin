import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, Alert } from 'react-native';
import { CapacityIndicator } from './src/components/CapacityIndicator';
import { BookingButton } from './src/components/BookingButton';
import { gymApi } from './src/api/gymApi';
import { CapacityData, UIState } from './src/types';

const GYM_ID = 'gym-123';
const USER_ID = 'user-mobile-client';

export default function App() {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [bookingState, setBookingState] = useState<UIState>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCapacity = async () => {
    try {
      setIsRefreshing(true);
      const data = await gymApi.getCapacity(GYM_ID);
      setCapacity(data);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Could not load capacity data. Please check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCapacity();
    // Poll every 30 seconds for "live" updates
    const interval = setInterval(fetchCapacity, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async () => {
    try {
      setBookingState('loading');
      await gymApi.bookSlot(GYM_ID, USER_ID);
      setBookingState('success');
      
      // Refresh capacity after successful booking
      fetchCapacity();

      // Reset state after 3 seconds
      setTimeout(() => setBookingState('idle'), 3000);
    } catch (error: any) {
      setBookingState('error');
      Alert.alert('Booking Failed', error.message || 'Something went wrong.');
      
      // Reset state after 3 seconds
      setTimeout(() => setBookingState('idle'), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Gym Crowding</Text>
          <Text style={styles.subtitle}>Book your spot at Central Fitness</Text>
        </View>

        <View style={styles.card}>
          {capacity ? (
            <CapacityIndicator 
              percentage={capacity.capacityPercentage} 
              label="Real-time Capacity"
            />
          ) : (
            <Text style={styles.loadingText}>Loading live data...</Text>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>About this Gym</Text>
            <Text style={styles.infoText}>
              • Max Capacity: {capacity?.maxCapacity || '--'} Members
              {"\n"}• Current Count: {capacity?.currentCount || '--'} Active
              {"\n"}• Best time to visit: 2:00 PM - 4:00 PM
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <BookingButton 
            onPress={handleBooking} 
            state={bookingState}
            disabled={capacity?.capacityPercentage === 100}
          />
          <Text style={styles.disclaimer}>
            Booking guarantees entry for a 60-minute session.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Gray-100
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    flex: 1,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  footer: {
    marginBottom: 10,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
  }
});
