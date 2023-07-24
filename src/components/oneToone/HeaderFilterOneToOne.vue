<template>
  <q-header class="bg-white header-custom">
    <div
      class="header-filter block-filter flex justify-center items-center justify-between"
    >
      <div class="filter-left">
        <CAvatar
          size="32px"
          :avatar="channelDetail?.avatar?.url"
          :text="channelDetail?.name.split('')[0] || ''"
        />
        <span class="filter-name ellipsis">{{ channelDetail?.name }}</span>
      </div>
      <TabHeaderOneToOne />
      <div class="filter-right flex justify-center items-center justify-between">
        <div
          v-if="totalPin > 0 && isShowPin"
          class="filter-icon"
        >
          <c-btn
            color="primary"
            size="small"
            flat
            @click="showListPin"
          >
            <q-icon name="bi-pin-fill icon-filter"></q-icon>
            <span> {{ $t('workspace.channel.headerFilterChannel.pin') }}</span>
            <q-badge
              class="badge-total"
              rounded
              color="negative"
            >
              <span>{{ maxCount(totalPin) }}</span>
            </q-badge>
          </c-btn>
        </div>
        <div
          v-if="showFilter"
          class="filter-icon"
        >
          <c-btn
            color="primary"
            size="small"
            flat
          >
            <q-icon
              name="bi-funnel"
              class="icon-filter"
            ></q-icon>
            <span> {{ $t('workspace.channel.headerFilterChannel.filter') }}</span>

            <q-badge
              v-if="showCountFilter"
              class="badge-total"
              rounded
              color="negative"
            >
              <span>{{ maxCount(totalTask) }}</span>
            </q-badge>
            <q-menu
              nchor="bottom right"
              self="top right"
              :offset="[-100, 10]"
            >
              <div class="block-filter-menu">
                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.oneToOne.headerFilterOneToOne.status')"
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

                <q-separator inset></q-separator>

                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.oneToOne.headerFilterOneToOne.priority')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item v-close-popup>
                    <q-item-section class="list-item">
                      <q-checkbox
                        v-model="priority"
                        val="HIGH"
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.high')"
                      ></q-checkbox>
                      <q-checkbox
                        color=""
                        val="MEDIUM"
                        v-model="priority"
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.medium')"
                      ></q-checkbox>
                      <q-checkbox
                        color=""
                        val="LOW"
                        v-model="priority"
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.low')"
                      ></q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-separator inset></q-separator>

                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.oneToOne.headerFilterOneToOne.flag')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item v-close-popup>
                    <q-item-section class="list-item">
                      <q-checkbox
                        v-model="flag"
                        toggle-indeterminate
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.flagSet')"
                      ></q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-separator inset></q-separator>

                <q-expansion-item
                  :model-value="true"
                  :label="$t('workspace.oneToOne.headerFilterOneToOne.taskView')"
                  expand-icon="bi-chevron-down"
                >
                  <q-item v-close-popup>
                    <q-item-section class="list-item">
                      <q-checkbox
                        v-for="read in ListReadTask"
                        :key="read.value"
                        v-model="readTask"
                        :val="read.value"
                        :label="read.label"
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
                        @click="resetFilter"
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.reset')"
                      ></q-btn>
                      <c-btn
                        :label="$t('workspace.oneToOne.headerFilterOneToOne.apply')"
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
      v-if="showCountFilter && showFilter"
      :date="cacheDate"
      :hidden-field="hiddenField"
      :list-status="listStatus"
      @removeFilter="removeFilter"
    ></FilterTag>
    <div
      v-if="showMarkDone"
      class="header-bottom-text text-body"
    >
      {{ 'Mark done' }}
    </div>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from 'vue';
import { useChannelStore } from 'stores/channel';
import { checkDue, checkObjectIsNotDefine, maxCount } from 'src/helper/global';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import FilterTag from 'components/general/FilterTag.vue';
import { LocationQueryValue, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ListReadTask } from 'src/constants/ConstantFilter';

interface IsDate {
  to?: string;
  from?: string;
}
export default defineComponent({
  name: 'HeaderFilterOneToOne',
  components: { FilterTag, SelectDateOnAndRange },
  props: {
    selectedItem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: [
    'filter',
    'showSelect',
    'handleSelectAll',
    'markAsRead',
    'markDone',
    'onClickChannel',
  ],
  setup(props, { emit }) {
    const state = reactive<{
      status?: any | string;
      priority?: Array<string> | null;
      flag: boolean | null;
      showSelected: boolean | null;
      selectedAll: boolean;
      showCountFilter: boolean;
      readTask?: Array<string> | null;
      date: IsDate | string | null | any;
      cacheDate: IsDate | string | null | any;
      dateTime: string;
    }>({
      status: null,
      priority: null,
      flag: null,
      showSelected: false,
      selectedAll: false,
      showCountFilter: false,
      readTask: [],
      date: null,
      cacheDate: null,
      dateTime: '',
    });

    const { t } = useI18n();
    const route = useRoute();
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
      {
        value: 'CANCEL',
        label: t('workspace.channel.headerFilterChannel.cancel'),
      },
    ];
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
      const { status, priority, is_flag, readTask, is_read, start_date, end_date } =
        route.query as any;
      const query = {
        status,
        priority,
        is_flag,
        readTask,
        is_read,
        start_date,
        end_date,
      };
      state.showCountFilter = checkObjectIsNotDefine(query);
      setDateFilter(start_date, end_date);
      if (readTask) {
        state.readTask = typeof readTask !== 'string' ? [...readTask] : [readTask];
      } else {
        state.readTask = [];
      }

      state.flag = is_flag ? is_flag === 'true' : null;
      state.status =
        listStatus.find(
          (item: any) => status && item.value.toLowerCase() === status?.toLowerCase(),
        ) || null;

      state.priority =
        priority && typeof priority !== 'string' ? [...priority] : [priority];
    };
    setDefaultFilter();

    const checkShowAction = computed(() => {
      let check = [] as any;
      if (!props.selectedItem?.length || state.selectedAll) {
        return ['markDone', 'markAsRead'];
      } else {
        props.selectedItem.map((item: any) => {
          if (
            item.statusTask === 'DONE' &&
            !check.includes('markUndone') &&
            check?.length < 2
          ) {
            check.push('markUndone');
          }
          if (
            item.statusTask !== 'DONE' &&
            !check.includes('markDone') &&
            check?.length < 2
          ) {
            check.push('markDone');
          }
          if (item.reads && !check.includes('markAsUnread') && check?.length < 2) {
            check.push('markAsUnread');
          }
          if (!item.reads && !check.includes('markAsRead') && check?.length < 2) {
            check.push('markAsRead');
          }
        });
        return check;
      }
      return ['markDone', 'markAsRead'];
    });
    const channelStore = useChannelStore();

    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });
    const listMemberChannel = computed(() => {
      return channelStore.listMemberChannel;
    });
    const showModalAddMember = () => {
      channelStore.showModalAddPeople(true);
    };
    const handleFilter = (clearFilter?: boolean) => {
      state.showCountFilter = !clearFilter;
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
          start_date: undefined,
          end_date: undefined,
        };
      }
      state.cacheDate = state.date;
      // emit(
      //   'filter',
      //   {
      //     is_flag: state.flag || undefined,
      //     status: state.status?.value || undefined,
      //     priority: state.priority || undefined,
      //     readTask: state.readTask || undefined,
      //     start_date: dateTime.start_date || undefined,
      //     end_date: dateTime.end_date || undefined,
      //   },
      //   clearFilter,
      // );

      channelStore.filter = {
        ...channelStore.filter,
        is_flag: typeof state.flag === 'boolean' ? state.flag : undefined,
        status: state.status?.value || undefined,
        priority: state.priority || undefined,
        readTask: state.readTask || undefined,
        start_date: dateTime.start_date || undefined,
        end_date: dateTime.end_date || undefined,
      };
      channelStore.IsFilter = !clearFilter;
      channelStore.isShowPin = false;
      channelStore.actionReloadPageTask();
    };
    const hiddenField = computed(() => {
      return ['channelName'];
    });

    const removeFilter = (key: string) => {
      if (key === 'date') {
        state.date = null;
      } else {
        // @ts-ignore
        state[key] = null;
      }
      handleFilter();
    };
    const resetFilter = () => {
      state.status = null;
      state.priority = [];
      state.flag = null;
      state.showCountFilter = false;
      state.readTask = [];
      state.cacheDate = null;
      state.date = null;
      handleFilter(true);
    };

    const backAction = () => {
      state.showSelected = false;
      emit('showSelect', state.showSelected);
    };
    const showAction = () => {
      state.showSelected = true;
      emit('showSelect', state.showSelected);
    };
    const markDone = (value: boolean) => {
      emit('markDone', value);
    };
    const markAsRead = (value: boolean) => {
      emit('markAsRead', value);
    };

    const onClickChannel = () => {
      emit('onClickChannel');
    };
    const totalTask = computed(() => channelStore.totalTask);
    const totalPin = computed(() => channelStore.totalPin);
    const isShowPin = computed(() => route.name !== 'channel-wiki');
    const showFilter = computed(() => route.name === 'one-to-one-task');

    const showMarkDone = computed(
      () => totalTask.value > 0 && showFilter.value && !channelStore.isShowPin,
    );

    const showListPin = () => {
      channelStore.isShowPin = !channelStore.isShowPin;
    };
    return {
      ...toRefs(state),
      showModalAddMember,
      channelDetail,
      listMemberChannel,
      resetFilter,
      handleFilter,
      backAction,
      showAction,
      checkShowAction,
      markDone,
      markAsRead,
      onClickChannel,
      maxCount,
      listStatus,
      removeFilter,
      hiddenField,
      ListReadTask,
      totalTask,
      showFilter,
      totalPin,
      showMarkDone,
      showListPin,
      isShowPin,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-header.header-custom {
  top: 97px;
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
    max-width: 40%;
    &:hover {
      color: $primary;
    }

    .filter-name {
      margin-left: 8px;
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
        //width: 24px;
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
      .icon-funnel {
        margin-left: 8px;
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
  margin: 8px 0 8px 32px;
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
