<template>
  <div class="table">
    <div class="table-filter flex items-center">
      <div class="header-text">{{ $t('workspace.admin.title') }}</div>
      <div class="search-right flex">
        <div class="search-name">
          <c-text-field
            :placeholder="$t('workspace.admin.filter.text')"
            prepend-icon="bi-search"
            debounce="500"
            v-model="filter.search"
            @update:model-value="getStaticsAllMember"
          >
          </c-text-field>
        </div>
        <div class="choose-date">
          <select-date-on-and-range
            v-model="date"
            @actionOk="filterDate"
            min-width="360px"
            dropdown-icon="bi-caret-up-fill"
            :placeholder="$t('workspace.admin.filter.date')"
          />
        </div>
      </div>
    </div>
    <q-separator color="#F8F8F8" />
    <q-table
      class="my-sticky-column-table"
      bordered
      flat
      :loading="loading"
      :rows="rows"
      :columns="columns"
      row-key="id"
      color="amber"
      :rows-per-page-options="[10, 20, 30, 40, 50, 100]"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template #body-cell-name="{ row }">
        <td
          @click="selectedMember(row)"
          class="cursor-pointer"
          :class="row.is_deactive ? 'deactivate-item' : ''"
        >
          <div class="text-name">{{ row.name }}</div>
          <div class="text-position">{{ row.position }}</div>
        </td>
      </template>
      <template #body-cell-role="{ row }">
        <td>
          <div class="box-role">
            <div
              v-if="row.is_deactive"
              class="text-name text-negative"
            >
              {{ $t('workspace.admin.deactivatedMember') }}
            </div>
            <div
              v-else
              class="text-name"
            >
              {{ capitalizeFirstLetter(row.role) }}
            </div>
            <div v-if="showMenuAction(row)?.total">
              <q-btn-dropdown
                no-icon-animation
                dropdown-icon="bi-three-dots-vertical"
                content-class="menu-action"
                :menu-offset="[10, 10]"
              >
                <q-list
                  dense
                  class="menu-action-item"
                >
                  <template v-for="(menuItem, index) in showMenuAction(row).menu">
                    <q-item
                      v-if="menuItem.show"
                      :key="index"
                      clickable
                      v-close-popup
                      @click="menuItem.action"
                    >
                      <q-item-section>
                        <q-item-label>
                          <q-icon
                            size="16px"
                            v-if="menuItem.icon"
                            :name="menuItem.icon"
                            :color="menuItem?.color"
                          ></q-icon>
                          <span
                            class="item-title"
                            :class="`text-${menuItem?.color}`"
                            >{{ menuItem.title }}</span
                          >
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </td>
      </template>
    </q-table>
    <modalTransferAdmin @reload="getStaticsAllMember" />
    <modalChangeRoleWs @reload="getStaticsAllMember" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ref, watch } from 'vue';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
import modalTransferAdmin from 'components/admin/modalTransferAdmin.vue';
import modalChangeRoleWs from 'components/admin/modalChangeRoleWs.vue';
import StatisticService from 'src/services/statistic';

import { capitalizeFirstLetter, checkDue } from 'src/helper/global';
import NotifyServices from 'src/plugins/NotifyServices';
import { paramsStatics } from 'src/services/statistic/model';
import { date } from 'quasar';
import { RoleWs } from 'src/constants/ConstantUser';
interface IsDate {
  to?: string;
  from?: string;
}

interface memberItem {
  name: string;
  creatTask: string;
  doneTask: string;
  cancelTask: string;
  people: string;
  channel: string;
}

interface pagination {
  page: number;
  rowsPerPage: any;
  rowsNumber: number;
}

export default defineComponent({
  name: 'TableStatistic',
  methods: { capitalizeFirstLetter },
  components: {
    SelectDateOnAndRange,
    modalTransferAdmin,
    modalChangeRoleWs,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();

    const workspaceStore = useWorkspaceStore();

    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const state = reactive<{
      date: IsDate | string | null | any;
      rows: Array<memberItem>;
      pagination: pagination;
      loading: boolean;
      filter: paramsStatics;
    }>({
      date: null,
      rows: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      loading: false,
      filter: {
        start_date: undefined,
        end_date: undefined,
        search: '',
      },
    });
    const columns = [
      {
        name: 'name',
        required: true,
        label: 'Name and Position',
        align: 'left',
        field: 'name',
      },
      {
        name: 'role',
        required: true,
        label: 'Account role',
        align: 'left',
        field: 'role',
      },
      {
        name: 'creatTask',
        align: 'left',
        label: 'Created tasks',
        field: 'creatTask',
        // sortable: true,
      },
      {
        name: 'doneTask',
        align: 'left',
        label: 'Done/Total tasks (%)',
        field: 'doneTask',
        // sortable: true,
        // sort: (a: any, b: any) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'cancelTask',
        align: 'left',
        label: 'Cancel/Total tasks (%)',
        field: 'cancelTask',
        // sort: (a: any, b: any) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'people',
        align: 'left',
        label: 'People in Collaboration',
        field: 'people',
      },
      {
        name: 'channel',
        align: 'left',
        label: 'Channel Collaboration',
        field: 'channel',
      },
    ] as any;
    const getStaticsAllMember = () => {
      state.loading = true;
      mainStore.loadingPage = true;
      const params = {
        ...state.filter,
        page: state.pagination.page || 1,
        page_size: state.pagination?.rowsPerPage || 10,
        workspace_id: `${route.params.workspaceId}`,
      } as paramsStatics;
      router.replace({
        ...route,
        // @ts-ignore
        query: {
          ...params,
        },
      });
      StatisticService.getStatisticAllMember({
        ...params,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            console.log(res?.data);
            state.rows = [];
            state.pagination.rowsNumber = res?.data?.total;
            state.pagination.page = res?.data?.page;
            res?.data?.data.map((item: any) => {
              state.rows.push({
                ...item,
                role: item.workspace_roles?.[0].name || 'Member',
                name: item.full_name || item.email || '',
                creatTask: item?.tasks?.created || '0',
                doneTask: Number(item?.tasks?.percent_done).toFixed() || '0',
                cancelTask: Number(item?.tasks?.percent_cancel).toFixed() || '0',
                people: item?.collaborations?.people || '0',
                channel: item?.collaborations?.channel || '0',
              });
              return item;
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
            if (res.status_code === 404 || res.status_code === 406) {
              router.push({
                name: 'home',
              });
            }
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.notify.getPeopleFailed'));
        })
        .finally(() => {
          state.loading = false;
          mainStore.loadingPage = false;
        });
    };

    const resetPage = () => {
      state.date = null;
      state.filter = {
        start_date: undefined,
        end_date: undefined,
      };
      state.pagination = {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      };
    };
    watch(route, () => {
      if (
        route?.params?.workspaceId &&
        Number(route?.params?.workspaceId) !== detailWorkspace?.value?.id
      ) {
        resetPage();
        getStaticsAllMember();
      }
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

      getStaticsAllMember();
    };
    const onRequest = (request: any) => {
      console.log(request);
      const { pagination } = request;
      state.pagination = {
        page: Number(pagination.page) || 1,
        rowsPerPage: Number(pagination.rowsPerPage) || 10,
        rowsNumber: Number(pagination.rowsNumber) || 0,
      };
      getStaticsAllMember();
    };
    const selectedMember = (row: any) => {
      router.push({
        name: 'statistic',
        params: {
          memberId: row.id,
        },
      });
    };
    const getInfoStatistic = () => {
      setDateFilter(route?.query?.start_date, route?.query?.end_date);
      state.filter = {
        ...state.filter,
        search: route?.query?.search?.toString() || undefined,
      };
      state.pagination = {
        page: Number(route.query?.page) || 1,
        rowsPerPage: Number(route.query?.rowsPerPage) || 10,
        rowsNumber: Number(route.query?.rowsNumber) || 0,
      };
      getStaticsAllMember();
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
    const editProfile = () => {
      workspaceStore.showDrawerRightProfile(true);
      workspaceStore.setDrawerRightProfileValue(infoUser.value);
    };

    const transfer = (value: any) => {
      workspaceStore.showModalTransferAdmin(true, value);
    };

    const changeRole = (value: any) => {
      workspaceStore.showModalChangeRole(true, value);
    };

    const deactivate = (value: any) => {
      workspaceStore.showModalDeativate(true, value);
    };
    const activate = (value: any) => {
      workspaceStore.showModalActivate(true, value);
    };

    const menuAction = (value: any) => {
      const perMissionRoleAdmin =
        workspaceStore.workspaceRoleAdmin && value.role === (RoleWs['MEMBER'] as boolean);

      const perMissionRoleOwnerWs = workspaceStore.workspaceRoleOwner as boolean;
      const active = value.is_deactive as boolean;
      const isUser = infoUser.value?.id === (value.id as boolean);
      return [
        {
          icon: 'bi-person',
          title: t('workspace.admin.menuAction.editProfile'),
          show: isUser,
          action: () => editProfile(),
        },
        {
          icon: 'bi-arrow-return-right',
          title: t('workspace.admin.menuAction.transfer'),
          show: isUser && value.role !== RoleWs['OWNER'],
          action: () => transfer(value),
        },
        {
          icon: 'bi-person-gear ',
          title: t('workspace.admin.menuAction.changeRole'),
          show: !isUser && !active && (perMissionRoleAdmin || perMissionRoleOwnerWs),
          action: () => changeRole(value),
        },
        {
          icon: 'bi-lock',
          color: 'negative',
          title: t('workspace.admin.menuAction.deactivate'),
          show: !isUser && !active && (perMissionRoleAdmin || perMissionRoleOwnerWs),
          action: () => deactivate(value),
        },
        {
          icon: 'bi-unlock',
          title: t('workspace.admin.menuAction.activate'),
          show: !isUser && active && (perMissionRoleAdmin || perMissionRoleOwnerWs),
          action: () => activate(value),
        },
      ];
    };
    const showMenuAction = (value: any) => {
      const menu = menuAction(value) as any;
      return {
        menu,
        total: menu.filter((item: any) => item.show).length,
      };
    };
    return {
      ...toRefs(state),
      columns,
      detailWorkspace,
      infoUser,
      filterDate,
      onRequest,
      selectedMember,
      getStaticsAllMember,
      menuAction,
      showMenuAction,
    };
  },
});
</script>

<style lang="scss" scoped>
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

.my-sticky-column-table {
  border: none;

  thead tr:first-child th:first-child {
    background-color: #e7f6e9;
  }

  td:first-child {
    &.deactivate-item {
      background: #ffebee;
    }
    background-color: #e7f6e9;
  }

  th:first-child,
  td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}

th {
  text-align: left;
  font-size: 16px !important;
}

td {
  padding: 16px !important;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: #2f2f2f;
  height: 56px !important;
  font-size: 14px !important;
}

th.text-left:nth-child(1) {
  background: #e9eae8 !important;
  height: 64px;
  width: 256px;
}

th.text-left {
  background: #e9eae8 !important;
  height: 64px;
  width: 224px;
}

//td.text-left {
//  height: 64px !important;
//}

i.q-icon.notranslate.material-icons:nth-child(1) {
  font-size: 24px;
  color: #878b87;
}

i.q-icon.notranslate.material-icons:nth-child(2) {
  font-size: 24px;
  color: #2f2f2f;
}

span.q-table__bottom-item {
  font-size: 16px;
  color: #2f2f2f;
}

.q-field__native.row.items-center span {
  font-size: 16px;
}

:deep(.q-menu.q-position-engine.scroll) {
  max-height: 432px;
  visibility: visible;
  min-width: 327px;
  min-height: 67.9861px;
  top: 140px;
  left: 927.564px;
}

.table .table-filter .choose-date .q-btn {
  width: 0;
  height: 0;
  border: none;
}

.menu-workspace {
  left: 32px !important;
  top: 58px !important;
}

.box-role {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .q-btn {
    padding: 0 !important;
  }
}

.text-position {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #878b87;
}

.menu-item {
  padding: 16px 8px;
  background: #ffffff;
  border: 1px solid #e9eae8;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .q-item:hover {
    color: #1c8c44;
  }

  .q-item {
    padding: 0;
  }

  .q-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
