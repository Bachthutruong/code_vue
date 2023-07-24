import { api, axiosNoAuth } from 'boot/axios';
import qs from 'qs';
import {
  paramsStatics,
  paramsMyStatisticWs,
  paramsStatisticOverview,
} from 'src/services/statistic/model';

const statistic = '/statistic';

class StatisticService {
  getStatisticAllMember(params: paramsStatics) {
    return api.get(`${statistic}`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }
  getStatisticOverview(params: paramsStatisticOverview) {
    return api.get(`${statistic}/overview`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }
  getMyStatisticWs(params: paramsMyStatisticWs) {
    return api.get(`${statistic}/my`, {
      params: {
        ...params,
      },
      // paramsSerializer(params) {
      //   return qs.stringify(params, { arrayFormat: 'repeat' });
      // },
    });
  }
  getStatisticMember(member_id: string, params: paramsMyStatisticWs) {
    return api.get(`${statistic}/${member_id}`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }
}

export default new StatisticService();
