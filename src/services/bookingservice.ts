import axios, { isAxiosError } from 'axios';
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
        BookingService.handleError(error);
      });
  }
  async getDataOverview() {
    return axios({
      url: Config.API_URL + 'booking/overview',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        BookingService.handleError(error);
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
        BookingService.handleError(error);
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
        BookingService.handleError(error);
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
        BookingService.handleError(error);
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
        BookingService.handleError(error);
      });
  }
  private static handleError(error: unknown): never {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Erro desconhecido na API');
    } else {
      throw new Error('Ocorreu um erro inesperado');
    }
  }
}

const bookingService = new BookingService();

export default bookingService;
