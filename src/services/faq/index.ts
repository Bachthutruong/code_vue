import { api } from 'boot/axios';
import { bodyCreateFaq, paramsFaq, uploadAvatar } from 'src/services/faq/model';
const faq = '/faq';
class FaqService {
  createFaq(body: bodyCreateFaq) {
    return api.post(`${faq}`);
  }

  getFaqs(params: paramsFaq) {
    return api.get(`${faq}`, {
      params,
    });
  }

  getFaqDetail(id: string) {
    return api.get(`${faq}/${id}`);
  }

  editFaqDetail(id: string, body: bodyCreateFaq) {
    return api.put(`${faq}/${id}`, body);
  }

  removeFaq(id: string) {
    return api.delete(`${faq}/${id}`);
  }
}

export default new FaqService();
