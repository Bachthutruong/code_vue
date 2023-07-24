<template>
  <div class="table">
    <div class="table-filter flex items-center">
      <div class="header-text">
        {{ member?.name || '' }}
        <span>({{ $t('workspace.admin.human') }})</span>
      </div>
      <div class="search-right flex">
        <div class="choose-date">
          <select-date-on-and-range
            v-model="date"
            @actionOk="filterDate"
            min-width="360px"
            dropdown-icon="bi-caret-up-fill"
            placeholder="Choose date to view staff performance"
          />
        </div>
      </div>
    </div>
    <q-separator color="#F8F8F8" />
  </div>
  <div class="statistic-box row">
    <div class="statistic-box-left col-3">
      <div
        v-for="(item, index) in infoMember"
        :key="index"
        class="statistic-box-left-item"
      >
        <div class="statistic-box-left-item-text text-body-regular">{{ item.label }}</div>
        <div class="statistic-box-left-item-value text-body1">{{ item.value }}</div>
      </div>
    </div>
    <div class="statistic-box-right col-9">
      <barChart
        :key="render"
        :data-chart="dataChart"
      ></barChart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import barChart from 'components/statistic/barChartWs.vue';
import StatisticService from 'src/services/statistic';
import { paramsMyStatisticWs, paramsStatics } from 'src/services/statistic/model';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NotifyServices from 'src/plugins/NotifyServices';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import { date } from 'quasar';
import { checkDue } from 'src/helper/global';
import { useMainStore } from 'stores/main';

interface IsDate {
  to?: string;
  from?: string;
}

export default defineComponent({
  name: 'statisticPage',
  components: {
    barChart,
    SelectDateOnAndRange,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const render = ref(0);
    const state = reactive<{
      filter: paramsMyStatisticWs;
      dataChart: any;
      date: IsDate | string | null | any;
      loading: boolean;
      infoMember: any;
      member: any;
    }>({
      filter: {
        start_date: undefined,
        end_date: undefined,
      },
      dataChart: [],
      date: null,
      loading: false,
      infoMember: [],
      member: null,
    });
    const getDataMember = (dataRes: any) => {
      state.infoMember = [
        {
          value: dataRes.tasks.created,
          label: t('workspace.chart.task.creatTask'),
        },
        {
          value: Number(dataRes?.tasks?.percent_cancel).toFixed() + '%' || '0%',
          label: t('workspace.chart.task.cancelTask'),
        },
        {
          value: Number(dataRes?.tasks?.percent_done).toFixed() + '%' || '0%',
          label: t('workspace.chart.task.doneTask'),
        },
        {
          value: dataRes?.collaborations?.channel || '0',
          label: t('workspace.chart.task.channelCollaboration'),
        },
        {
          value: dataRes?.collaborations?.people || '0',
          label: t('workspace.chart.task.peopleCollaboration'),
        },
      ];
    };
    const mainStore = useMainStore();

    const getStaticMember = () => {
      mainStore.loadingPage = true;
      const params = {
        ...state.filter,
        workspace_id: `${route.params.workspaceId}`,
      } as paramsStatics;
      console.log('state.filter', state.filter);
      router.replace({
        ...route,
        // @ts-ignore
        query: {
          ...params,
        },
      });
      StatisticService.getStatisticMember(`${route.params.channelId}`, params)
        .then((res: any) => {
          if (res?.status_code === 200) {
            console.log(res?.data);
            const dataRes = res?.data as any;
            state.dataChart = dataRes.done_gap;
            getDataMember(dataRes);
            state.member = {
              name: dataRes.full_name || dataRes.email || '',
              id: dataRes.id,
            };
            render.value += 1;
            console.log('state.dataChart', state.dataChart);
            // dataRes.map((item: any) => {
            //   state.dataChart.push({
            //     ...item,
            //     name: item.full_name || item.email || '',
            //     creatTask: item?.tasks?.total || '0',
            //     doneTask: Number(item?.tasks?.percent_done).toFixed() || '0',
            //     cancelTask: Number(item?.tasks?.percent_cancel).toFixed() || '0',
            //     people: item?.collaborations?.people || '0',
            //     channel: item?.collaborations?.channel || '0',
            //   });
            //   return item;
            // });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.notify.getPeopleFailed'));
        })
        .finally(() => {
          mainStore.loadingPage = false;
        });
    };
    const setDateFilter = (
      start_date?: string | null | LocationQueryValue[] | undefined,
      end_date?: string | null | LocationQueryValue[] | undefined,
    ) => {
      if (start_date && !end_date) {
        state.date = start_date;
        state.filter = {
          ...state.filter,
          start_date: state.date,
          end_date: state.date,
        };
      } else if (start_date && end_date) {
        // @ts-ignore
        if (Math.abs(checkDue(start_date, 'days', end_date)) === 0) {
          state.date = start_date;
          state.filter = {
            ...state.filter,
            start_date: state.date,
            end_date: state.date,
          };
        } else {
          state.date = {
            from: start_date,
            to: end_date,
          };
          state.filter = {
            ...state.filter,
            start_date: state.date.from,
            end_date: state.date.to,
          };
        }
      } else state.date = null;
      console.log('state.date', state.date);
    };
    const filterDate = () => {
      if (typeof state.date === 'string' && state.date) {
        state.filter = {
          ...state.filter,
          start_date: state.date,
          end_date: state.date,
        };
      }
      if (typeof state.date === 'object' && state.date) {
        state.filter = {
          ...state.filter,
          start_date: state.date.from,
          end_date: state.date.to,
        };
      }
      if (!state.date) {
        state.filter = {
          ...state.filter,
          start_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
          end_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        };
      }
      getStaticMember();
    };

    const getInfoStatistic = () => {
      setDateFilter(route?.query?.start_date, route?.query?.end_date);
      state.filter = {
        ...state.filter,
      };
      getStaticMember();
    };
    getInfoStatistic();
    return {
      ...toRefs(state),
      filterDate,
      render,
    };
  },
});
</script>

<style scoped lang="scss">
.table-filter {
  justify-content: space-between;
  padding: 20px 32px 0;

  .header-text {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    padding-bottom: 20px;
    color: #2f2f2f;

    span {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #878b87;
    }
  }

  .choose-date {
    padding-left: 16px;
    min-width: 376px;

    .q-icon {
      font-size: 16px;
      color: #878b87;
    }

    .block {
      font-size: 14px;
      line-height: 20px;
      color: #565656;
      text-transform: none;
      padding-right: 37px;
    }
  }

  .search-name {
    width: 400px;
  }
}

.statistic-box {
  display: flex;
  margin-top: 52px;
  padding: 0 32px;
  &-left {
    max-height: 420px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 24px 0 24px;
    border: 1px solid #e9eae8;
    border-radius: 8px;
    &-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 24px 0;
      align-items: center;
      height: 80px;
      &-text {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #2f2f2f;
      }
      &-value {
        font-style: normal;
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
        color: #1c8c44;
      }
    }
  }
  &-right {
    padding-left: 32px;
    :deep(canvas) {
      max-height: 372px !important;
    }
  }
}
</style>
