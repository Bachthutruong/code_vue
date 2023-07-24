import { api } from 'boot/axios';
import {
  paramsCountCalendar,
  paramsCalendar,
  bodyUpdateSettingCalendar,
  paramsTimetable,
} from 'src/services/calendar/model';
import qs from 'qs';
const calendar = '/calendar';
const share = '/share/setting';

class CalendarService {
  getAllCountCalendar(params: paramsCountCalendar) {
    return api.get(`${calendar}`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  getCalendarByYear(params: paramsCountCalendar) {
    return api.get(`${calendar}/by-year`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  getAllTaskCalendar(params: paramsCalendar) {
    return api.get(`${calendar}/task`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  getSettingCalendarWs(workspace_id: number) {
    return api.get(`${calendar}${share}/${workspace_id}`);
  }

  updateSettingCalendarWs(body: bodyUpdateSettingCalendar) {
    return api.put(`${calendar}${share}`, body);
  }

  getTimetable(params: paramsTimetable) {
    return api.get(`${calendar}/timetable`, {
      params: {
        ...params,
      },
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }
}
export default new CalendarService();
