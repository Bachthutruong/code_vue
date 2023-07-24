<template>
  <HeaderUnreadTask
    title="workspace.channel.sidebar.statistic"
    :hasMark="false"
  >
  </HeaderUnreadTask>
  <div
    id="dataTask"
    class="data-task"
  >
    <div class="search-right">
      <div class="choose-date">
        <select-date-on-and-range
          v-model="date"
          @actionOk="filterDate"
          min-width="280px"
          dropdown-icon="bi-caret-up-fill"
          :placeholder="$t('workspace.chart.filter.date')"
        />
      </div>
    </div>
    <div class="statistic-box">
      <barChart
        :key="render"
        :data-chart="dataChart"
      ></barChart>
    </div>
    <div
      v-if="showTitle"
      class="performance-box-title"
    >
      {{ $t('workspace.chart.title') }}
    </div>
    <div class="performance-box row q-col-gutter-lg">
      <div
        v-if="infoMember?.length"
        class="col-4"
      >
        <div class="performance-box-task">
          <div
            v-for="(item, index) in infoMember"
            :key="index"
            class="performance-box-task-item"
          >
            <div class="performance-box-task-item-text text-body">{{ item.label }}</div>
            <div class="performance-box-task-item-value text-body">
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="collaboration?.people?.length"
        class="col-4"
      >
        <div class="performance-box-collaboration">
          <div class="performance-box-collaboration-title">
            <div class="crow-icon">
              <img :src="emojiCrown" />
            </div>
            <span class="performance-box-collaboration-title-text text-body">
              {{ $t('workspace.statistic.collaboration.top3.people') }}
            </span>
          </div>
          <div
            v-for="(item, index) in collaboration.people"
            :key="index"
            class="performance-box-collaboration-item"
          >
            <CAvatar
              size="36px"
              :avatar="item?.members[0]?.avatar?.url"
              :text="item?.name?.split('')?.[0] || ''"
            />
            <div class="performance-box-collaboration-item-text text-body text-truncate">
              {{ item?.name }}
            </div>
            <div class="dot"></div>
            <div class="performance-box-collaboration-item-value text-body">
              {{ item?.tasks }} {{ $t('workspace.statistic.collaboration.tasks') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="collaboration?.channel?.length"
        class="col-4"
      >
        <div class="performance-box-collaboration">
          <div class="performance-box-collaboration-title">
            <div class="crow-icon">
              <img :src="emojiCrown" />
            </div>
            <span class="performance-box-collaboration-title-text text-body">
              {{ $t('workspace.statistic.collaboration.top3.channel') }}
            </span>
          </div>
          <div
            v-for="(item, index) in collaboration?.channel"
            :key="index"
            class="performance-box-collaboration-item"
          >
            <CAvatar
              size="36px"
              :avatar="item?.avatar?.url"
              :text="item?.name?.split('')?.[0] || ''"
            />
            <div class="performance-box-collaboration-item-text text-body text-truncate">
              {{ item?.name }}
            </div>
            <div class="dot"></div>
            <div class="performance-box-collaboration-item-value text-body">
              {{ item?.tasks }} {{ $t('workspace.statistic.collaboration.tasks') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import HeaderUnreadTask from 'components/unread/HeaderUnreadTask.vue';
import barChart from 'components/statistic/barChartWs.vue';

import StatisticService from 'src/services/statistic';
import NotifyServices from 'src/plugins/NotifyServices';
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { paramsMyStatisticWs } from 'src/services/statistic/model';
import { useMainStore } from 'stores/main';
import { checkDue } from 'src/helper/global';
import { date } from 'quasar';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import emojiCrown from 'assets/emoji/emoji_crown.svg';
import { useChannelStore } from 'stores/channel';
import { typeChannel } from 'src/interface/constStatus';

interface IsDate {
  to?: string;
  from?: string;
}

export default defineComponent({
  name: 'statisticPage',
  components: { SelectDateOnAndRange, barChart, HeaderUnreadTask },
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
      collaboration: any;
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
      collaboration: [],
      member: null,
    });

    const getDataMember = (dataRes: any) => {
      const collaboration = dataRes.collaborations;

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
          value: collaboration?.channels.total || '0',
          label: t('workspace.chart.task.channelCollaboration'),
        },
        {
          value: collaboration?.people.total || '0',
          label: t('workspace.chart.task.peopleCollaboration'),
        },
      ];
      state.collaboration = {
        channel: collaboration?.channels?.top_3 || [],
        people: collaboration?.people?.top_3 || [],
      };
    };

    const showTitle = computed(() => {
      return (
        state.infoMember?.length ||
        state.collaboration?.people?.length ||
        state.collaboration?.channel?.length
      );
    });
    const mainStore = useMainStore();

    const getStaticMember = () => {
      mainStore.loadingPage = true;
      const params = {
        ...state.filter,
        workspace_id: `${route.params.workspaceId}`,
      } as paramsMyStatisticWs;
      console.log('state.filter', state.filter);
      router.replace({
        ...route,
        // @ts-ignore
        query: {
          ...params,
        },
      });
      StatisticService.getMyStatisticWs(params)
        .then((res: any) => {
          if (res?.status_code === 200) {
            console.log(res);
            const dataRes = res?.data as any;
            if (!dataRes) return;
            console.log(dataRes);
            state.dataChart = dataRes.done_gap;
            getDataMember(dataRes);
            state.member = {
              name: dataRes.full_name || dataRes.email || '',
              id: dataRes.id,
            };
            render.value += 1;
            console.log('state.dataChart', state.dataChart);
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

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        getInfoStatistic();
      }
    });
    const channelStore = useChannelStore();

    watch(route, () => {
      if (route?.name) {
        channelStore.tabChannel = (route.meta.typeChildren as typeChannel) || '';
      }
    });
    return {
      ...toRefs(state),
      filterDate,
      render,
      emojiCrown: ref(emojiCrown),
      showTitle,
    };
  },
});
</script>

<style scoped lang="scss">
.search-right {
  display: flex;
  justify-content: flex-end;

  .choose-date {
    min-width: 280px;
  }
}

.data-task {
  padding: 0 32px;
}

//.statistic-box {
//  height: 372px;
//
//  :deep(canvas) {
//    max-height: 372px !important;
//  }
//}
.performance-box {
  &-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #3c3c3c;
    margin-bottom: 16px;
  }
  &-task {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 24px;
    height: 240px;

    background: #f8f8f8;
    border-radius: 8px;
    &-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      height: 28px;
      margin-bottom: 8px;
      &-text {
        color: #565656;
      }
      &-value {
        color: #1c8c44;
        font-size: 20px;
      }
    }
  }
  &-collaboration {
    //display: flex;
    //justify-content: center;
    //align-items: flex-start;
    padding: 32px 24px;
    height: 240px;

    background: #f8f8f8;
    border-radius: 8px;
    &-title {
      display: flex;
      margin-bottom: 16px;
      &-text {
        margin-left: 8px;
        color: #565656;
        white-space: nowrap;
      }
    }
    &-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      //justify-content: space-between;
      align-items: center;
      padding: 0;
      height: 36px;
      margin-bottom: 16px;
      &-text {
        margin-left: 8px;
        color: #3c3c3c;
      }
      &-value {
        color: #1c8c44;
        white-space: nowrap;
      }
    }
  }
}

.dot {
  width: 4px;
  height: 4px;
  background: #878b87;
  margin: 0 8px;
  border-radius: 50%;
}
</style>
