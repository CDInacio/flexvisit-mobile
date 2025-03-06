import axios, { isAxiosError } from 'axios';
import Config from '~/utils/api';

class FormService {
  async getForm(id: string) {
    return axios({
      url: Config.API_URL + `form/get/${id}`,
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
  async getForms() {
    return axios({
      url: Config.API_URL + 'form/getAll',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        FormService.handleError(error);
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

const formService = new FormService();

export default formService;
