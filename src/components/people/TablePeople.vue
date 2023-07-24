<template>
  <div>
    <q-table
      :style="cssStyle"
      :class="rows.length === 0 ? 'table-no-data' : ''"
      grid
      :card-container-class="cardContainerClass"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :pagination="pagination"
      :loading="loading"
      hide-header
    >
      <template v-slot:item="props">
        <div
          class="table-people q-pa-xs col-xs-12 col-sm-6 col-md-4"
          @click="selectedItem(props.row)"
          :class="drawerRightProfile ? 'col-md-6' : 'col-md-4'"
        >
          <q-card class="row items-center">
            <div class="table-people__img flex">
              <CAvatar
                size="72px"
                :avatar="props.row?.avatar?.url"
                :text="props.row?.name.split('')[0] || ''"
              />
            </div>
            <q-card-section>
              <div class="table-people__name ellipsis">
                {{ props?.row?.name }}
                <span v-if="infoUser?.id === props.row.id"
                  >({{ $t('workspace.peoples.you') }})</span
                >
              </div>
              <div class="table-people__job ellipsis">
                <i class="bi bi-briefcase"></i>
                {{ props.row?.position || '' }}
              </div>
              <div class="table-people__email ellipsis">
                <i class="bi bi-envelope"></i>
                {{ props.row?.email || '' }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template
        #no-data
        v-if="!loading"
      >
        <div class="no-data">
          <img
            src="~assets/default/no_results_found.svg"
            alt="no_results_found"
          />
          <p class="no-data-title">{{ $t('workspace.peoples.noResult') }}.</p>
          <p class="no-data-desc">{{ $t('workspace.peoples.otherKeyword') }}.</p>
        </div>
      </template>
      <template #bottom>
        <PaginationWorkSpace
          v-model="pagination.page"
          :max="pagesNumber"
          @update:model-value="getMembers()"
        />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import PaginationWorkSpace from 'components/general/PaginationWorkSpace.vue';
import WorkspaceService from 'src/services/workspace';
import { useRoute } from 'vue-router';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';

interface itemPeople {
  id: string | number;
  name: string;
  job: string;
  email: string;
}

interface pagination {
  page: number;
  rowsPerPage: any;
  total: number;
}

export default defineComponent({
  name: 'peoplePage',
  props: {
    search: {
      type: String,
      default: '',
    },
  },
  components: {
    PaginationWorkSpace,
  },

  setup(props) {
    const $q = useQuasar();

    const workspaceStore = useWorkspaceStore();

    const showModalProfile = () => {
      workspaceStore.showModalProfile(true);
    };

    const showModalInformation = () => {
      workspaceStore.showModalInformation(true);
    };

    const showModalSwitchAccount = () => {
      workspaceStore.showModalSwitchAccount(true);
    };

    const showDrawerRightProfile = () => {
      workspaceStore.showDrawerRightProfile(true);
    };

    const drawerRightProfile = computed(() => {
      return workspaceStore?.drawerRightProfile;
    });

    const { t } = useI18n();

    const columns = [
      { name: 'name', label: 'name', field: 'name' },
      { name: 'job', label: 'job', field: 'job' },
      { name: 'email', label: 'email', field: 'email' },
    ];

    const route = useRoute();

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    function getItemsPerPage() {
      if ($q.screen.lt.sm) {
        return 3;
      }
      if ($q.screen.lt.md) {
        return 6;
      }
      return 18;
    }
    const state = reactive<{
      rows: Array<itemPeople>;
      loading: boolean;
      selected: any | null;
      id: number;
      pagination: pagination;
    }>({
      rows: [],
      loading: false,
      selected: [],
      id: infoUser.value?.id || '',
      pagination: {
        page: 1,
        rowsPerPage: getItemsPerPage(),
        total: 0,
      },
    });

    const searchMember = computed(() => {
      return props.search || '';
    });

    watch(searchMember, () => {
      getMembers();
    });

    const filter = ref('');

    const selectedItem = (selectedItem: any) => {
      state.selected = { ...selectedItem };
      workspaceStore.setDrawerRightProfileValue(selectedItem);
      showDrawerRightProfile();
    };

    const getMembers = () => {
      state.loading = true;
      WorkspaceService.findAllMemberWorkspace(`${route.params.workspaceId}`, {
        page: state.pagination.page || 1,
        page_size: state.pagination?.rowsPerPage || 3,
        search: searchMember.value,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            state.rows = [];
            state.pagination.total = res?.data?.total;
            res?.data?.data.map((item: any) => {
              state.rows.push({
                ...item,
                name: item.full_name || item.email || '',
              });
              return item;
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.notify.getPeopleFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    getMembers();
    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, (val) => {
      if (val) getMembers();
    });
    watch(infoUser, () => {
      state.rows = state.rows.map((item: any) => {
        if (item.id === infoUser.value?.id) {
          return {
            ...infoUser.value,
            name: infoUser.value.full_name || infoUser.value.email || '',
          };
        }
        return item;
      });
    });
    watch(
      () => $q.screen.name,
      () => {
        state.pagination.rowsPerPage = getItemsPerPage();
      },
    );

    const cssStyle = computed(() => {
      return {
        // height: 'calc( 100vh - 260px)',
      };
    });

    return {
      drawerRightProfile,
      selectedItem,
      showDrawerRightProfile,
      showModalInformation,
      showModalSwitchAccount,
      showModalProfile,
      ...toRefs(state),
      infoUser,
      columns,
      filter,
      cssStyle,
      pagesNumber: computed(() =>
        Math.ceil(state.pagination.total / state.pagination.rowsPerPage),
      ),

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null;
      }),

      rowsPerPageOptions: computed(() => {
        return $q.screen.gt.xs ? ($q.screen.gt.sm ? [3, 6, 18] : [3, 6]) : [3];
      }),
      getMembers,
    };
  },
});
</script>

<style lang="scss">
.grid {
  flex-direction: column;

  .grid--2 > div:nth-child(2n + 1) {
    order: 1;
  }

  .grid--2 > div:nth-child(2n) {
    order: 2;
  }

  .grid--2:before {
    content: '';
    flex: 1 0 100% !important;
    width: 0 !important;
    order: 1;
  }

  .grid--3 > div:nth-child(3n + 1) {
    order: 1;
  }

  .grid--3 > div:nth-child(3n + 2) {
    order: 2;
  }

  .grid--3 > div:nth-child(3n) {
    order: 3;
  }

  .grid--3:before,
  .grid--3:after {
    content: '';
    flex: 1 0 100% !important;
    width: 0 !important;
    order: 2;
  }
}

.table-people {
  padding: 8px 16px;
  width: 320px;
  cursor: pointer;

  .q-card {
    box-shadow: none;
    border: 1px solid #e9eae8;
    border-radius: 8px;
  }

  .table-people__img {
    padding: 8px 16px;

    img {
      width: 72px;
      height: 72px;
    }
  }

  .q-card__section {
    padding: 0;
    width: calc(100% - 120px);

    .table-people__name {
      font-size: 16px;
      font-weight: 550;
      color: #2f2f2f;
    }

    .table-people__job {
      margin: 4px 0;
    }

    .table-people__job,
    .table-people__email {
      font-size: 14px;
      font-weight: 400;
      color: #878b87;

      i {
        margin-right: 4px;
      }
    }
  }
}

.table-no-data {
  height: calc(100vh - 260px);
  .q-table__bottom--nodata {
    height: 100%;

    .no-data {
      font-size: 14px;
      line-height: 20px;
      color: #2f2f2f;
      text-align: center;
      img {
        margin-bottom: 16px;
      }
      &-title {
        font-weight: 500;
        margin-bottom: 0;
      }

      &-desc {
        margin-bottom: 0;
      }
    }
  }
}

.q-table__bottom {
  justify-content: center;
}
</style>
