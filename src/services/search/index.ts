import { api } from 'boot/axios';
import {
  bodyPruneRecent,
  paramSearch,
  paramSearchCount,
  paramSearchRecent,
} from 'src/services/search/model';

const search = '/search';
const recent = '/recent';

class SearchService {
  searchAll(params: paramSearch) {
    return api.get(`${search}`, {
      params,
    });
  }

  searchAllCount(params: paramSearchCount) {
    return api.get(`${search}/count`, {
      params,
    });
  }

  searchAllRecent(params: paramSearchRecent) {
    return api.get(`${search}${recent}`, {
      params,
    });
  }

  pruneRecentSearch(body: bodyPruneRecent) {
    return api.post(`${search}${recent}/prune`, body);
  }
}
export default new SearchService();
