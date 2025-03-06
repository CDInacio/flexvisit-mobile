import { User } from './../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { isAxiosError } from 'axios';
import Config from '~/utils/api';
import type { UserSignupCredentials } from '~/types/user';

class UserService {
  async login(email: string, password: string) {
    return axios({
      url: Config.API_URL + 'user/signin',
      method: 'POST',
      data: {
        email,
        password,
      },
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        if (response.data.token) {
          AsyncStorage.setItem('userToken', response.data.token);
          AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          return Promise.resolve(response.data);
        }
      })
      .catch((error) => {
        UserService.handleError(error);
      });
  }
  async signup(data: UserSignupCredentials) {
    return axios({
      url: Config.API_URL + 'user/signup',
      method: 'POST',
      data,
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        UserService.handleError(error);
      });
  }
  async updateUser({ id, data }: { id: string | undefined; data: unknown }) {
    return axios({
      url: Config.API_URL + `user/updateUser/${id}`,
      data,
      method: 'PUT',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        UserService.handleError(error);
      });
  }
  async getUserInfo() {
    return axios({
      url: Config.API_URL + 'user/getUser',
      method: 'GET',
      headers: Config.HEADER_REQUEST,
    })
      .then((response) => {
        return Promise.resolve(response.data);
      })
      .catch((error) => {
        UserService.handleError(error);
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
const userService = new UserService();

export default userService;
