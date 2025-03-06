import axios, { isAxiosError } from 'axios';
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
        ScheduleService.handleError(error);
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

const scheduleService = new ScheduleService();

export default scheduleService;
