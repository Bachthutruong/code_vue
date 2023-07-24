<template>
  <q-header class="bg-white header-custom">
    <div
      class="header-filter block-filter flex justify-center items-center justify-between"
    >
      <div
        v-if="viewType === 'showCalendar'"
        class="filter-left"
        @click="onClickCalender"
      >
        <span>{{ $t('workspace.calendar.title') }}</span>
        <q-icon
          name="bi-incognito"
          class="ml-1 icon-calendar"
          color="neutral-2"
          size="24px"
        ></q-icon>
      </div>
      <div
        v-if="viewType !== 'showCalendar'"
        class="filter-left"
      >
        <c-btn
          :label="
            viewType === 'showYear'
              ? $t('workspace.calendar.taskByYear')
              : $t('workspace.calendar.taskList')
          "
          color="neutral-1"
          icon="bi-chevron-left"
          fontSizeIcon="16"
          flat
          @click="gotoBack"
        />
        <div
          v-if="viewType === 'showTask'"
          class="block-priority ml-1"
        >
          <div
            class="block-priority__tag text-body"
            :class="typeTask[typeListTask?.toLowerCase()].class"
          >
            {{ typeTask[typeListTask?.toLowerCase()].text }}
          </div>
        </div>
      </div>
      <div class="filter-right flex justify-center items-center justify-between">
        <div
          v-if="dateTime && viewType === 'showTask'"
          class="filter-date text-body text-primary"
        >
          {{ dateTime }}
        </div>
        <div class="filter-icon">
          <c-btn
            color="primary"
            size="small"
            flat
          >
            <q-icon name="bi-funnel icon-filter"></q-icon>
            <span>{{ $t('workspace.channel.headerFilterChannel.filter') }}</span>

            <q-badge
              v-if="isFilter"
              class="badge-total"
              rounded
              color="negative"
            >
              <span>
                <!--                99+-->
                {{ maxCount(totalTask) }}
              </span>
            </q-badge>
            <q-menu
              nchor="bottom right"
              self="top right"
              :offset="[-120, 10]"
            >
              <div class="block-filter-menu">
                <q-expansion-item
                  :model-value="true"
                  label="Channel or Names"
                  expand-icon="bi-chevron-down"
                >
                  <q-item>
                    <q-item-section>
                      <CSelect
                        v-model="channelName"
                        :defaultOptions="listChannel"
                        filterAction
                        :label="$t('workspace.channel.headerFilterChannel.channelOrName')"
                        outlined
                        use-input
                        hide-dropdown-icon
                        popup-content-class="select-height selectedItem"
                        :loading="false"
                      >
                        <template #selected-item="{ opt }">
                          {{ opt.label }}
                        </template>
                        <template #option="{ opt, selected, toggleOption }">
                          <q-item
                            clickable
                            :active="selected"
                            @click="toggleOption(opt)"
                            active-class="active-item-selected"
                          >
                            <q-item-section
                              avatar
                              v-if="opt.type === 'member'"
                            >
                              <CAvatar
                                size="32px"
                                :avatar="opt?.img"
                                :text="opt?.label?.split('')[0] || 'A'"
                              ></CAvatar>
                            </q-item-section>
                            <q-item-section class="text-body-regular label-opt"
                              >{{ opt?.label || '' }}
                            </q-item-section>
                          </q-item>
                        </template>
                      </CSelect>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-separator v-if="viewType !== 'showTask'"></q-separator>
                <q-expansion-item
                  v-if="viewType !== 'showTask'"
                  :model-value="true"
                  :label="$t('workspace.channel.headerFilterChannel.status')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item>
                    <q-item-section class="list-item">
                      <CSelect
                        v-model="status"
                        :label="
                          status
                            ? undefined
                            : $t('workspace.channel.headerFilterChannel.status')
                        "
                        :defaultOptions="listStatus"
                        outlined
                        fill-input
                        clearable
                        popup-content-class="select-height selectedItem"
                      >
                        <template #selected-item="{ opt }">
                          {{ opt.label }}
                        </template>
                        <template #option="{ opt, selected, toggleOption }">
                          <q-item
                            clickable
                            :active="selected"
                            active-class="active-item-selected"
                            @click="toggleOption(opt)"
                          >
                            <q-item-section class="text-body-regular label-section"
                              >{{ opt?.label || '' }}
                            </q-item-section>
                          </q-item>
                        </template>
                      </CSelect>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-separator></q-separator>

                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.channel.headerFilterChannel.priority')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item>
                    <q-item-section class="list-item">
                      <q-checkbox
                        v-model="priority"
                        val="HIGH"
                        :label="$t('workspace.channel.headerFilterChannel.high')"
                      ></q-checkbox>
                      <q-checkbox
                        val="MEDIUM"
                        v-model="priority"
                        :label="$t('workspace.channel.headerFilterChannel.medium')"
                      ></q-checkbox>
                      <q-checkbox
                        val="LOW"
                        v-model="priority"
                        :label="$t('workspace.channel.headerFilterChannel.low')"
                      ></q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-separator></q-separator>

                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.channel.headerFilterChannel.flag')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item>
                    <q-item-section class="list-item">
                      <q-checkbox
                        v-model="flag"
                        toggle-indeterminate
                        :label="$t('workspace.channel.headerFilterChannel.flagSet')"
                      ></q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-separator></q-separator>

                <q-expansion-item
                  :model-value="true"
                  label="Date"
                  expand-icon="bi-chevron-down"
                >
                  <q-item>
                    <q-item-section class="">
                      <div class="box-input-date">
                        <select-date-on-and-range
                          v-model="date"
                          min-width="256px"
                          dropdown-icon="bi-caret-up-fill"
                          placeholder="Choose date"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-list>
                  <q-card class="my-card">
                    <q-card-actions align="around">
                      <q-btn
                        flat
                        @click="gotoBack"
                        >Reset
                      </q-btn>
                      <c-btn
                        v-close-popup
                        label="Apply"
                        color="primary"
                        size="small"
                        @click="handleFilter(false)"
                      />
                    </q-card-actions>
                  </q-card>
                </q-list>
              </div>
            </q-menu>
          </c-btn>
        </div>
      </div>
    </div>
    <FilterTag
      v-if="viewType === 'showTask'"
      :date="cacheDate"
      :hidden-field="hiddenField"
      @removeFilter="removeFilter"
    ></FilterTag>
  </q-header>
  <modalShareCalender ref="refShareCalender"> </modalShareCalender>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
  ref,
} from 'vue';
import { useCalendarStore } from 'stores/calendar';
import { date } from 'quasar';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { checkDue, maxCount } from 'src/helper/global';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import FilterTag from 'components/general/FilterTag.vue';
import { useChannelStore } from 'stores/channel';
import { useI18n } from 'vue-i18n';
import modalShareCalender from 'components/calendar/modalShareCalender.vue';
import { typeChannel } from 'src/interface/constStatus';
interface IsDate {
  to?: string;
  from?: string;
}

const typeTask = {
  indue: {
    class: 'bg-primary',
    text: 'Upcoming',
  },
  done: {
    class: 'bg-neutral-5',
    text: 'Done',
  },
  overdue: {
    class: 'bg-overdue',
    text: 'Overdue',
  },
} as any;

export default defineComponent({
  name: 'HeaderFilterCalendar',
  components: {
    SelectDateOnAndRange,
    FilterTag,
    modalShareCalender,
  },
  props: {
    selectedItem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: [],
  setup() {
    const { t } = useI18n();

    const listStatus = [
      {
        value: 'INDUE',
        label: t('workspace.channel.headerFilterChannel.indue'),
      },
      {
        value: 'OVERDUE',
        label: t('workspace.channel.headerFilterChannel.overdue'),
      },
      {
        value: 'DONE',
        label: t('workspace.channel.headerFilterChannel.done'),
      },
    ];
    const router = useRouter();
    const route = useRoute();
    const refShareCalender = ref();
    const state = reactive<{
      status?: any | string;
      priority?: Array<string>;
      flag: boolean | null;
      date: IsDate | string | null | any;
      cacheDate: IsDate | string | null | any;
      search: string;
      dateTime: string;
      showTaskCalendar: boolean;
      previewType: string;
      channelName?: any;
    }>({
      status: null,
      priority: [],
      flag: null,
      date: null,
      cacheDate: null,
      search: '',
      dateTime: '',
      showTaskCalendar: false,
      previewType: '',
      channelName: '',
    });
    const calendarStore = useCalendarStore();
    const filterCalendar = computed(() => {
      return calendarStore.getFilterCalendar;
    });
    const typeListTask = computed((): string => {
      const status =
        typeof route?.query?.status === 'string' ? route?.query?.status : 'indue';
      return status;
    });

    const isFilter = computed(() => {
      return calendarStore.isFilter;
    });
    const totalTask = computed(() => {
      return calendarStore.total;
    });

    const hiddenField = computed(() => {
      return ['status', 'read'];
    });

    const onClickCalender = () => {
      refShareCalender.value.showModal();
    };

    const removeFilter = (key: string) => {
      // @ts-ignore
      state[key] = null;
      handleFilter();
    };

    const handleFilter = (clearFilter?: boolean) => {
      showDateTime();
      calendarStore.isFilter = !clearFilter;
      activeHandleFilter({
        is_flag: state.flag,
        status: !clearFilter ? state?.status?.value : typeListTask?.value?.toUpperCase(),
        priority: state.priority,
        channel_id: state.channelName?.value || undefined,
      });
    };
    const showDateTime = () => {
      state.dateTime = '';
      if (state.date && typeof state.date === 'string') {
        state.dateTime = date.formatDate(state.date, 'DD MMMM YYYY');
      }
      if (state.date && typeof state.date === 'object') {
        state.dateTime =
          date.formatDate(
            // @ts-ignore
            state?.date?.from,
            'DD MMMM YYYY',
          ) +
          ' ~ ' +
          date.formatDate(
            // @ts-ignore
            state?.date?.to,
            'DD MMMM YYYY',
          );
      }
    };
    const resetFilter = () => {
      if (route.name !== 'calendar-list') {
        state.status = null;
      }
      state.priority = [];
      state.flag = null;
      state.date = null;
      state.search = '';
      showDateTime();
      handleFilter(true);
    };
    const viewType = computed(() => {
      return calendarStore.checkViewType;
    });

    const changeFilter = (filter: any) => {
      calendarStore.changeFilter({
        ...filter,
      });
    };

    const gotoBack = () => {
      resetFilter();
      state.date = null;
      calendarStore.isFilter = false;
      router
        .push({
          name: 'calendar',
        })
        .then(() => {
          state.status = null;
        });
    };
    const activeHandleFilter = (filter: any) => {
      let dateTime = null as any;
      if (typeof state.date === 'string' && state.date) {
        dateTime = {
          start_date: state.date,
          end_date: state.date,
        };
      }
      if (typeof state.date === 'object' && state.date) {
        dateTime = {
          start_date: state.date.from,
          end_date: state.date.to,
        };
      }
      if (!state.date) {
        dateTime = {
          start_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
          end_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        };
      }
      console.log('dateTime', dateTime);
      changeFilter({
        is_flag: typeof filter.is_flag === 'boolean' ? filter.is_flag : undefined,
        status: filter.status || undefined,
        priority: filter.priority || undefined,
        channel_id: filter.channel_id || undefined,
        start_date: dateTime.start_date,
        end_date: dateTime.end_date,
      });
      state.cacheDate = state.date;
      if (route.name !== 'calendar-list' && isFilter.value) {
        console.log('route', route);
        setTimeout(() => {
          router.push({
            ...route,
            name: 'calendar-list',
          });
        }, 50);
      } else {
        calendarStore.actionReloadPage();
      }
    };
    const getFrom = (id: number | string) => {
      if (!id) return '';
      return listChannel.value.find((item: any) => item.value == id) || null;
    };
    const setDateFilter = (
      start_date?: string | null | LocationQueryValue[] | undefined,
      end_date?: string | null | LocationQueryValue[] | undefined,
    ) => {
      if (start_date && !end_date) {
        state.date = start_date;
      } else if (start_date && end_date) {
        // @ts-ignore
        if (Math.abs(checkDue(start_date, 'days', end_date)) === 0) {
          state.date = start_date;
        } else {
          state.date = {
            from: start_date,
            to: end_date,
          };
        }
      } else state.date = null;
      state.cacheDate = state.date;
    };
    const setDefaultFilter = () => {
      console.log('setDefaultFilter', route.name);
      if (route.name !== 'calendar-list') return;
      try {
        setDateFilter(route?.query?.start_date, route?.query?.end_date);
        state.status =
          listStatus.find(
            (item: any) =>
              item.value.toLowerCase() === filterCalendar?.value?.status?.toLowerCase(),
          ) || null;
        console.log('state.status', state.status);
        console.log('filterCalendar?.value', filterCalendar?.value);
        state.priority =
          filterCalendar?.value?.priority &&
          typeof filterCalendar?.value?.priority !== 'string'
            ? [...filterCalendar?.value?.priority]
            : [filterCalendar?.value?.priority];
        state.flag = filterCalendar?.value?.is_flag
          ? filterCalendar?.value?.is_flag === 'true'
          : null;
        state.channelName = getFrom(filterCalendar?.value?.channel_id);
        showDateTime();
      } catch (e) {
        console.log(e);
      }
    };

    const reloadFilter = computed(() => {
      return calendarStore.reloadFilter;
    });
    const clearFilterCalendar = computed(() => {
      return calendarStore.clearFilterCalendar;
    });
    watch(reloadFilter, () => {
      setDefaultFilter();
    });

    watch(clearFilterCalendar, () => {
      console.log(clearFilterCalendar.value);
      gotoBack();
    });
    watch(route, () => {
      if (route?.name) {
        channelStore.tabChannel = (route.meta.typeChildren as typeChannel) || '';
      }
    });
    onMounted(() => {
      nextTick(() => {
        setDefaultFilter();
      });
    });
    const channelStore = useChannelStore();

    const listChannel = computed(() => {
      const channel = channelStore.listChannel.map((item: any) => {
        return {
          ...item,
          label: `#${item.name}` || '',
          value: item.id || '',
          type: 'channel',
        };
      });
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'member',
        };
      });
      return [...channel, ...member];
    });
    return {
      ...toRefs(state),
      totalTask,
      viewType,
      isFilter,
      filterCalendar,
      typeListTask,
      listStatus,
      resetFilter,
      handleFilter,
      listChannel,
      //
      typeTask,
      gotoBack,
      setDefaultFilter,
      maxCount,
      removeFilter,
      hiddenField,
      onClickCalender,
      refShareCalender,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-header.header-custom {
  top: 97px;
}
.ml-1 {
  margin-left: 4px;
}
.header-filter {
  width: 100%;
  padding: 12px 32px;

  .filter-left {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: #2f2f2f;
    cursor: pointer;
    .icon-calendar {
    }

    &:hover {
      color: $primary;
      .icon-calendar {
        color: $primary;
      }
    }
  }

  :deep(.filter-right) {
    .filter-icon {
      padding: 0 24px 0 8px;

      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }

      :deep(span) {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
        text-transform: none;
      }

      .badge-total {
        margin-left: 12px;
        height: 24px;
        min-width: 24px;

        span {
          margin: 0 auto;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: #ffffff;
          text-align: center;
        }
      }
    }

    .filter-select {
      padding: 0 24px 0 8px;

      i {
        width: 13px;
        height: 14px;
      }

      span {
        margin-left: 6px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
      }
    }

    .filter-people {
      margin-right: 20px;

      .overlapping {
      }
    }

    .add-people {
      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }
    }
  }
}

.q-expansion-item {
  width: 100%;

  :deep(.q-item__section) {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 8px 0 0;
  }

  :deep(.q-expansion-item__toggle-icon) {
    font-size: 16px;
  }

  .q-expansion-item__content {
    .q-item {
      padding: 0;

      .list-item {
        padding: 0;

        .q-checkbox {
          :deep(.q-checkbox__bg) {
            border: 1px solid currentColor;
            border-radius: 4px;
          }

          :deep(.q-checkbox__label) {
            font-size: 14px;
            color: #2f2f2f;
            line-height: 20px;
            font-weight: 400;
          }
        }

        .q-radio {
          :deep(.q-radio__label) {
            font-size: 14px;
            color: #2f2f2f;
            line-height: 20px;
            font-weight: 400;
          }
        }

        .q-checkbox:last-child {
          padding-bottom: 8px;
        }
      }
    }
  }
}

.q-list {
  .q-card {
    box-shadow: none;

    .q-card__actions {
      justify-content: space-between;
      //margin: 0 8px;
      padding-top: 0;
      padding-left: 0;
    }

    .q-btn {
      padding: 0 16px;

      :deep(.q-btn__content) {
        font-size: 14px;
        font-weight: 500;
        text-transform: none;
        line-height: 20px;
      }
    }
  }
}

.block-filter {
  border-bottom: 1px solid #d3d3d3;
}

.header-bottom-text {
  color: #565656;
  margin: 16px 0 8px 32px;
}

.icon-filter {
  margin-left: 8px;
}

.block-filter-menu {
  width: 288px;
  padding: 8px 16px;
}

.box-input-date {
  margin-bottom: 8px;
}

.filter-left {
  display: flex;
  align-items: center;

  :deep(.q-btn) {
    span.block {
      font-size: 20px;
    }
  }
}
</style>
