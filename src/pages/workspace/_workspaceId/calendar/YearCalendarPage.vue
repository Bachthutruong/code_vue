<template>
  <div class="calendar-page-body">
    <div class="calendar-page-body-month">
      <div>
        <noData
          v-if="!listTask.length"
          :title="$t('workspace.channel.channelNodata')"
        >
          <template #action>
            <c-btn
              :label="$t('workspace.channel.addTask')"
              color="primary"
              icon="bi-plus-lg"
              class="data-add-task"
              @click="showModalTask"
            />
          </template>
        </noData>
        <div
          v-for="(yearItem, index) in listTask"
          :key="index"
        >
          <YearCalender
            v-if="yearItem?.year !== 'Invalid Date'"
            :id="`task#${yearItem?.year}`"
            :item-card="yearItem"
            @activeMonth="activeMonth"
            @actionMonth="actionMonth"
          ></YearCalender>
          <div
            v-else
            class="three-dots"
          >
            <div
              v-for="item in 3"
              :key="item"
              class="dot"
            ></div>
          </div>
        </div>

        <!--        <div class="box-fixed">-->
        <!--          <div class="box-fixed-scroll">-->
        <!--            <c-btn-->
        <!--              color="primary"-->
        <!--              outline-->
        <!--              size="small"-->
        <!--              class="box-fixed__btn"-->
        <!--              @click="actionScroll"-->
        <!--            >-->
        <!--              <template #default>-->
        <!--                <q-icon-->
        <!--                  size="16px"-->
        <!--                  name="bi-chevron-double-down"-->
        <!--                />-->
        <!--              </template>-->
        <!--            </c-btn>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ref, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NotifyServices from 'src/plugins/NotifyServices';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import { useI18n } from 'vue-i18n';
import { paramsCalendar } from 'src/services/calendar/model';
import { useCalendarStore } from 'stores/calendar';
import YearCalender from 'components/general/YearCalender.vue';
import {
  formatDateDisplay,
  getEndOfMonthByDate,
  getStartOfMonthByDate,
  scrollToId,
} from 'src/helper/global';
import { date } from 'quasar';
import { useMainStore } from 'stores/main';
import noData from 'components/general/noData.vue';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  name: 'YearCalendarPage',

  components: {
    noData,
    YearCalender,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const refTaskChannel = ref();
    const mainStore = useMainStore();
    const workspaceStore = useWorkspaceStore();

    const state = reactive<{
      loading: boolean;
      IsFilter: boolean;
      listTask: Array<formChannel>;
      taskStatus: any;
      filter: paramsCalendar;
      total: number;
      selected: any;
      showSelected: boolean;
      selectedAll: boolean;
      render: number;
    }>({
      loading: false,
      listTask: [],
      taskStatus: TaskStatusType,
      filter: {
        page: 1,
        page_size: 3,
      },
      total: 0,
      IsFilter: false,
      selected: [],
      showSelected: false,
      selectedAll: false,
      render: 0,
    });
    const resetPage = () => {
      state.render += 1;
      state.selectedAll = false;
      state.showSelected = false;
      state.IsFilter = false;
      state.selected = [];
      state.filter = {
        page: 1,
        page_size: 3,
      };
    };

    const calendarStore = useCalendarStore();
    const filterCalendar = computed(() => {
      return calendarStore.getFilterCalendar;
    });

    // 🤑
    const getAllTaskChannel = () => {
      console.log('filterCalendar', filterCalendar.value);
      const { status } = filterCalendar.value;
      return new Promise((resolve, reject) => {
        mainStore.loadingPage = true;
        calendarStore
          .getYearCalendar({
            status: status?.toUpperCase() || undefined,
          })
          .then((res: any) => {
            if (res?.status_code === 200) {
              const data = res?.data;
              state.listTask = [...data];
              console.log('state.listTask', state.listTask);
              state.total = data?.total || 0;
              nextTick(() => {
                const yearFilter = date.formatDate(
                  `${route?.query?.start_date || new Date()}`,
                  'YYYY',
                );
                scrollToId(`task#${yearFilter}`);
              });
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
            }
          })
          .catch((err) => {
            console.log('err', err);
            NotifyServices.showMessageError(`${err.message}`);
            reject(false);
          })
          .finally(() => {
            state.loading = false;
            mainStore.loadingPage = false;
          });
      });
    };
    getAllTaskChannel();

    const reloadPage = computed(() => {
      return calendarStore.reloadPage;
    });
    watch(reloadPage, () => {
      if (reloadPage.value) {
        setTimeout(() => {
          getAllTaskChannel();
        }, 50);
      }
    });

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        setTimeout(() => {
          getAllTaskChannel();
        }, 50);
      }
    });
    const onLoad = async (index: number, done: any) => {
      if (state.loading || state.total === state.listTask.length) {
        done();
        return;
      }
      state.loading = true;
      state.filter = {
        ...state.filter,
        page_size: (state.filter?.page_size || 3) + 3,
      };
      await getAllTaskChannel()
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          done();
        });
    };

    const scrollToBottom = (id: string) => {
      const element = document.getElementById(id) as any;
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

    const actionScroll = () => {
      state.filter = {
        ...state.filter,
        page_size: state.total + 1,
      };
      getAllTaskChannel().then(() => {
        scrollToBottom(`task#${state.total - 1}`);
      });
    };

    const detailTask = (id: number | string, type?: string) => {
      refTaskChannel.value.setInfoModal(id, type);
    };

    const scrollBot = ref(false);
    const handleScroll = () => {
      nextTick(() => {
        if (document) {
          const myElement = document.getElementById('dataTask') as any;
          const scrollY = myElement.scrollTop;
          scrollBot.value = scrollY > 50;
        }
      });
    };
    const scrollTargetRef = ref();
    const activeMonth = (item: any) => {
      const dateTime = formatDateDisplay(item.date, 'YYYY-MM-DD');
      const start_date = getStartOfMonthByDate(dateTime);
      const end_date = getEndOfMonthByDate(dateTime);
      router
        .push({
          name: 'calendar-list',
          query: {
            ...filterCalendar.value,
            status: item.type.toUpperCase(),
            start_date: start_date.date,
            end_date: end_date.date,
          },
        })
        .then(() => {
          calendarStore.actionReloadFilter();
        });
    };
    const actionMonth = (item: any) => {
      console.log('item', item);
      router
        .push({
          name: 'calendar-view',
          query: {
            ...filterCalendar.value,
            status: route.query.status || [],
            start_date: item.date,
            end_date: item.date,
          },
        })
        .then(() => {
          calendarStore.actionReloadFilter();
        });
    };
    const showModalTask = () => {
      workspaceStore.showModalAddTask(true);
    };
    return {
      ...toRefs(state),
      refTaskChannel,
      scrollBot,
      scrollTargetRef,
      onLoad,
      getAllTaskChannel,
      scrollToBottom,
      actionScroll,
      resetPage,
      //
      detailTask,
      // popup
      handleScroll,
      activeMonth,
      actionMonth,
      showModalTask,
    };
  },
});
</script>
<style lang="scss" scoped>
.box-fixed {
  position: fixed;
  right: 32px;
  bottom: 40px;
  z-index: 10;

  &-button {
    margin-bottom: 24px;
  }

  &-scroll {
    display: flex;
    justify-content: flex-end;
  }

  .box-fixed__btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #e7f6e9 !important;

    .q-icon {
      color: #1c8c44;
    }
  }
}

.data-add-task {
  width: 168px;
}

.title-top {
  margin-bottom: 5px;
  font-weight: 500;

  span {
    color: #1c8c44;
    margin-left: 5px;
  }
}

.data-task {
  margin-top: 0;
}

.calendar-page-body {
  padding: 0 32px;

  &-month {
    margin-top: 48px;
  }
}

.three-dots {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 24px auto;

  .dot {
    width: 8px;
    height: 8px;
    background: #66bb69;
    margin: 0 12px;
    border-radius: 50%;
  }
}
</style>
