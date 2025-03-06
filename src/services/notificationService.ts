import axios, { isAxiosError } from 'axios';
import Config from '~/utils/api';

class NotificationService {
  async getNotifications() {
    return axios({
      url: Config.API_URL + 'notifications/get',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        NotificationService.handleError(error);
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

const notificationService = new NotificationService();

export default notificationService;
