import { FontAwesome } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import Badge from '../Badge';
import type { Booking } from '~/types/booking';
import BookingItem from './BookingItem';

interface BookingsListProps {
  bookings: Booking[];
  handleGoToDetailsPage: (id: string) => void;
}

export default function BookingsList({ bookings, handleGoToDetailsPage }: BookingsListProps) {
  return (
    <>
      {bookings?.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          handleGoToDetailsPage={handleGoToDetailsPage}
        />
      ))}
    </>
  );
}
