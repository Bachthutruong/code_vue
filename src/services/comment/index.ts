import { api } from 'boot/axios';
import { paramsComment, bodyComment, bodyLike } from 'src/services/comment/model';
const comment = '/comment';
class CommentService {
  createComment(body: bodyComment) {
    return api.post(`${comment}`, {
      ...body,
      mention_user_ids: body.mention_user_ids || undefined,
    });
  }

  getAllComment(params: paramsComment) {
    return api.get(`${comment}`, {
      params,
    });
  }

  likeComment(body: bodyLike) {
    return api.post(`${comment}/reaction`, body);
  }

  unlikeComment(body: bodyLike) {
    return api.post(`${comment}/unreaction`, body);
  }
}

export default new CommentService();
