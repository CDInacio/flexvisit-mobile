import { set } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '~/utils/api';
import type { User } from '~/types/user';

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
          console.log(response.data.token);
          AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          return Promise.resolve(response.data);
        }
      })
      .catch((error) => {
        throw error;
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
        throw error;
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
        throw error;
      });
  }
}
const userService = new UserService();

export default userService;
