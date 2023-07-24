import { api } from 'boot/axios';

const wiki = '/wiki';
const commentWiki = '/comment-wiki';
import qs from 'qs';
import {
  bodyArrange,
  bodyCreateWiki,
  bodySendComment,
  bodySendReactComment,
  deleteDraft,
  markReadWiki,
  paramsCommentWiki,
  paramsWiki,
  paramsWikiActive,
} from 'src/services/wiki/model';
import { paramsMember } from 'src/services/channel/model';

class WikiService {
  createWiki(body: bodyCreateWiki) {
    return api.post(`${wiki}`, body);
  }

  getAllWiki(params: paramsWiki) {
    return api.get(`${wiki}`, {
      params,
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  getDetailWiki(id: string | number) {
    return api.get(`${wiki}/${id}`);
  }

  updateWiki(id: string | number, body: bodyCreateWiki) {
    return api.put(`${wiki}/${id}`, body);
  }

  deleteWiki(id: string | number) {
    return api.delete(`${wiki}/${id}`);
  }

  getAllActiveTask(id: string, params: paramsWikiActive) {
    return api.get(`${wiki}/${id}/activities`, {
      params,
    });
  }
  getMemberWiki(id: string, params: paramsMember) {
    return api.get(`${wiki}/${id}/members`, {
      params,
    });
  }

  markReadWiki(body: markReadWiki) {
    return api.post(`${wiki}/read`, body);
  }

  arrangeWiki(body: bodyArrange) {
    return api.post(`${wiki}/arrange`, body);
  }

  deleteDraft(body: deleteDraft) {
    return api.post(`${wiki}/prune-draft`, body);
  }

  deleteScheduled(body: deleteDraft) {
    return api.post(`${wiki}/prune-schedule`, body);
  }

  //    comment
  sendCommentWiki(body: bodySendComment) {
    return api.post(`${commentWiki}`, body);
  }

  getAllCommentWiki(params: paramsCommentWiki) {
    return api.get(`${commentWiki}`, {
      params,
    });
  }

  reactCommentWiki(body: bodySendReactComment) {
    return api.post(`${commentWiki}/reaction`, body);
  }
  unReactCommentWiki(body: bodySendReactComment) {
    return api.post(`${commentWiki}/reaction`, body);
  }
}

export default new WikiService();
