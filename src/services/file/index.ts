import { api, axiosNoAuth } from 'boot/axios';
// import { uploadFile } from 'src/services/file/model';

class FileService {
  uploadFile(body: any) {
    return api.post('/file', body);
  }
  downloadFile(id: string) {
    return api.get(`/file/download/${id}`, {
      responseType: 'blob',
    });
  }
}

export default new FileService();
