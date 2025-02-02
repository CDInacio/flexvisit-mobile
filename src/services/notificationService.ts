import axios from 'axios';
import Config from '~/utils/api';

class NotificationService {
  async getNotifications() {
    return axios({
      url: Config.API_URL + 'notifications/get',
      method: 'GET  ',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  }
}

const notificationService = new NotificationService();

export default notificationService;
