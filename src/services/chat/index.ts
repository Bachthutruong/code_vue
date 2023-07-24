import { api } from 'boot/axios';
import {
  BodyChat,
  BodyCreateChat,
  BodyCreatePoll,
  BodyReaction,
  BodyReadChat,
  ParamsChat,
  ParamsChatV2,
  paramsMemberPoll,
} from 'src/services/chat/model';
const chat = '/chat';
const chatV2 = '/chat/v2';
const poll = '/poll';

class ChatService {
  getAllMessage(params: ParamsChat) {
    return api.get(`${chat}`, { params });
  }

  getAllMessageV2(params: ParamsChatV2) {
    return api.get(`${chatV2}`, { params });
  }

  createMessage(body: BodyCreateChat) {
    return api.post(`${chat}`, body);
  }

  editMessage(body: BodyCreateChat) {
    return api.put(`${chat}`, body);
  }

  forwardMessage(body: BodyChat) {
    return api.post(`${chat}/forward`, body);
  }

  hideMessage(body: BodyChat) {
    return api.post(`${chat}/hide`, body);
  }

  readMessage(body: BodyReadChat) {
    return api.post(`${chat}/read`, body);
  }

  reactionMessage(body: BodyReaction) {
    return api.post(`${chat}/reaction`, body);
  }

  unReactionMessage(body: BodyReaction) {
    return api.post(`${chat}/unreaction`, body);
  }

  getListMemberAnswer(params: paramsMemberPoll) {
    return api.get(`${poll}/answer/members`, { params });
  }

  createPoll(body: BodyCreatePoll) {
    return api.post(`${poll}`, body);
  }

  getDetailPoll(id: string) {
    return api.get(`${poll}/${id}`);
  }
}

export default new ChatService();
