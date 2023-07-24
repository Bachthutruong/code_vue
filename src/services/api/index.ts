import { api } from 'boot/axios';

class ApiService {
  getListApi() {
    return api.get('/api/list');
  }
}

export default new ApiService();
