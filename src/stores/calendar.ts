import { defineStore } from 'pinia';
import { paramsCalendar, paramsCountCalendar } from 'src/services/calendar/model';
import CalendarService from 'src/services/calendar';
import { date } from 'quasar';
import { formatDateDisplay } from 'src/helper/global';
interface State {
  total: number;
  viewType: string;
  isFilter: boolean;
  reloadPage: number;
  reloadFilter: number;
  clearFilterCalendar: number;
}

export const useCalendarStore = defineStore({
  id: 'calendarStore',
  state: () =>
    ({
      total: 0,
      // showTask, showYear, 'showCalendar'
      viewType: 'showCalendar',
      isFilter: false,
      reloadPage: 0,
      reloadFilter: 0,
      clearFilterCalendar: 0,
    } as State),
  getters: {
    queryRoute(): any {
      return this?.router?.currentRoute?.value?.query;
    },
    checkViewType(): string {
      const routeName = this?.router?.currentRoute?.value?.name as string;
      const viewTypeConstant = {
        'calendar-year': 'showYear',
        'calendar-view': 'showCalendar',
        'calendar-list': 'showTask',
      } as any;
      return viewTypeConstant[routeName];
    },
    getFilterCalendar(): paramsCalendar | paramsCountCalendar | any {
      console.log('this.queryRoute', this.queryRoute);
      const filterQuery = {
        ...this.queryRoute,
        start_date:
          this.queryRoute?.start_date || date.formatDate(new Date(), 'YYYY-MM-DD'),
        end_date:
          this.queryRoute?.end_date ||
          this.queryRoute?.start_date ||
          date.formatDate(new Date(), 'YYYY-MM-DD'),
      };
      if (this.queryRoute?.is_flag === '') {
        delete filterQuery?.is_flag;
      }
      return {
        ...filterQuery,
        workspace_id: Number(this?.router?.currentRoute?.value?.params?.workspaceId || 0),
      };
    },
  },
  actions: {
    changeFilter(newFilter: paramsCalendar | paramsCountCalendar) {
      const filterQuery = {
        ...this.getFilterCalendar,
        ...newFilter,
      };
      console.log('filterQuery', filterQuery);
      const name = this?.router?.currentRoute?.value?.name as string;
      const params = this?.router?.currentRoute?.value?.params as any;
      this?.router
        .replace({
          name,
          params,
          query: { ...filterQuery },
        })
        .catch((err) => {
          console.log(err);
        });
    },

    clearFilter() {
      this.clearFilterCalendar += 1;
    },

    countTotalCalendar(data: any) {
      setTimeout(() => {
        const paramsStartDate = this.queryRoute?.start_date || new Date();
        const monthFilter = formatDateDisplay(paramsStartDate, 'MM');
        this.total = 0;
        for (const key in data) {
          if (formatDateDisplay(key, 'MM') === monthFilter) {
            const item = data[key];
            this.total = this.total + item.indue + item.overdue + item.done;
          }
        }
      }, 50);
    },
    countTotalYearCalendar(data: any) {
      setTimeout(() => {
        const paramsStartDate = this.queryRoute?.start_date || new Date();
        const yearFilter = formatDateDisplay(paramsStartDate, 'YYYY');
        this.total = 0;
        data.forEach((item: any) => {
          if (item.year !== 'Invalid Date' && item.year === yearFilter) {
            for (const key in item.data) {
              const itemCount = item.data[key];
              this.total =
                this.total + itemCount.indue + itemCount.overdue + itemCount.done;
            }
          }
        });
      }, 50);
    },
    getCountCalendar(newFilter: paramsCalendar | paramsCountCalendar) {
      return new Promise((resolve, reject) => {
        CalendarService.getAllCountCalendar({
          ...newFilter,
          workspace_id: Number(
            this?.router?.currentRoute?.value?.params?.workspaceId || 0,
          ),
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getYearCalendar(newFilter?: paramsCalendar | paramsCountCalendar) {
      return new Promise((resolve, reject) => {
        CalendarService.getCalendarByYear({
          ...newFilter,
          workspace_id: Number(
            this?.router?.currentRoute?.value?.params?.workspaceId || 0,
          ),
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getAllTaskCalendar(newFilter: paramsCalendar | paramsCountCalendar) {
      return new Promise((resolve, reject) => {
        const paramsFilter = {
          ...this.getFilterCalendar,
          ...newFilter,
        } as paramsCalendar | paramsCountCalendar;
        const statusFilter =
          typeof paramsFilter?.status === 'string' ? paramsFilter?.status : 'INDUE';

        CalendarService.getAllTaskCalendar({
          ...paramsFilter,
          status: statusFilter,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              this.total = res?.data?.total || 0;
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    actionReloadPage() {
      this.reloadPage += 1;
    },
    actionReloadFilter() {
      this.reloadFilter += 1;
    },
  },
});
