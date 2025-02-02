import axios from 'axios';
import Config from '~/utils/api';

class ScheduleService {
  async getSchedules() {
    return axios({
      url: Config.API_URL + 'schedule/get',
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
}

const scheduleService = new ScheduleService();

export default scheduleService;
