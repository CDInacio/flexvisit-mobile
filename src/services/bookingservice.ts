import axios from 'axios';
import Config from '~/utils/api';
class BookingService {
  async getBookings() {
    return axios({
      url: Config.API_URL + 'booking/getAll',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  async getUserBookings() {
    return axios({
      url: Config.API_URL + 'booking/user',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  async getBooking(id: string) {
    return axios({
      url: Config.API_URL + 'booking/getBookingById/' + id,
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  async createBooking(booking: any) {
    return axios({
      url: Config.API_URL + 'booking/create',
      method: 'POST',
      headers: Config.HEADER_REQUEST,
      data: booking,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
  async updateBookingStatus({
    id,
    status,
    userId,
    role,
    booking,
    observation,
  }: {
    id: string;
    status: string;
    userId: string;
    role: string;
    booking: any;
    observation?: string | null;
  }) {
    return axios({
      url: Config.API_URL + `booking/updateStatus/${id}`,
      method: 'PUT',
      headers: Config.HEADER_REQUEST,
      data: {
        status,
        userId,
        role,
        booking,
        observation,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
}

const bookingService = new BookingService();

export default bookingService;
