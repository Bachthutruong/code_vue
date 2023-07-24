<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import { date } from 'quasar';
import { paramsStatics } from 'src/services/statistic/model';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { checkDue } from 'src/helper/global';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
interface IsDate {
  to?: string;
  from?: string;
}
export default defineComponent({
  name: 'ownedWeb',
  components: { SelectDateOnAndRange },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const state = reactive<{
      date: IsDate | string | null | any;
      filter: paramsStatics;
    }>({
      date: null,
      filter: {
        start_date: undefined,
        end_date: undefined,
      },
    });

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
      console.log('filterDate');

      // getStaticsAllMember();
    };

    const resetPage = () => {
      state.date = null;
      state.filter = {
        start_date: undefined,
        end_date: undefined,
      };
    };

    const getInfoStatistic = () => {
      setDateFilter(route?.query?.start_date, route?.query?.end_date);
      console.log('state.filter', state.filter);
      state.filter = {
        ...state.filter,
      };
      // getStaticsAllMember();
    };
    getInfoStatistic();
    return {
      ...toRefs(state),
      filterDate,
    };
  },
});
</script>

<template>
  <div class="table">
    <div class="table-filter flex items-center">
      <div class="header-text">{{ $t('workspace.admin.title') }}</div>
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
</template>

<style scoped lang="scss">
.table {
  .table-header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f8f8;

    .header-left {
      padding-left: 32px;

      .header-truncate {
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        padding: 0 8px;
      }

      i {
        margin-bottom: 2px;
      }
    }

    .header-right {
      display: flex;
      padding-right: 32px;

      .back-ws {
        padding: 8px;
        margin-right: 16px;
        cursor: pointer;

        i {
          margin-right: 6px;
          margin-bottom: 2px;
        }

        span {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #565656;
        }
      }

      .header-user {
        .user-name {
          margin-left: 8px;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          color: #2f2f2f;
        }
      }
    }
  }

  .table-filter {
    justify-content: space-between;
    padding: 20px 32px 0;

    .header-text {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      padding-bottom: 20px;
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

  .q-field__marginal {
    height: 48px;
    color: #565656;
    font-size: 16px;
  }

  .q-field__control.relative-position.row.no-wrap {
    height: 48px;
  }

  .q-field--outlined .q-field__control {
    border-radius: 8px;
  }

  .my-sticky-column-table {
    padding: 24px 32px 0;
  }
}
</style>
