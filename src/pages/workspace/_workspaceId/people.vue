<template>
  <div>
    <q-header class="bg-white text-black header">
      <CBreadcrumbs>
        <template #right>
          <c-btn
            icon="bi-people"
            label="Invite people"
            color="primary"
            size="small"
            @click="showModalInvite"
          >
          </c-btn>
        </template>
      </CBreadcrumbs>
    </q-header>
    <div
      class="block-search"
      elevated
    >
      <c-text-field
        :placeholder="$t('workspace.peoples.labelSearch')"
        prepend-icon="bi-search"
        debounce="500"
        v-model="search"
      >
      </c-text-field>
    </div>
    <TablePeople
      :search="search"
      class="q-pa-md"
    >
    </TablePeople>
  </div>
  <!-- <CDrawer /> -->
  <modalEditProfile />
  <modalEditInformation />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import TablePeople from 'components/people/TablePeople.vue';
import { useWorkspaceStore } from 'stores/workspace';
import modalEditProfile from 'src/components/people/modalEditProfile.vue';
import modalEditInformation from 'src/components/people/modalEditInformation.vue';
import { typeChannel } from 'src/interface/constStatus';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'peoplePage',

  components: {
    TablePeople,
    modalEditProfile,
    modalEditInformation,
  },
  setup() {
    const workspaceStore = useWorkspaceStore();

    const search = ref('');
    const showModalInvite = () => {
      workspaceStore.showModalInvite(true);
    };
    const channelStore = useChannelStore();
    const route = useRoute();

    watch(route, () => {
      if (route?.name) {
        channelStore.tabChannel = (route.meta.typeChildren as typeChannel) || '';
      }
    });
    // const getMemberWorkSpace = (searchValue: string) => {
    //   const params: paramsMember = {
    //     page: 1,
    //     page_size: 999999,
    //     sort_by: 'created_at',
    //     order_by: 'ASC',
    //     search: searchValue || ''
    //   }
    //   workspaceStore.getMemberWorkSpace(`${route.params.workspaceId}`, params)
    // }
    return {
      showModalInvite,
      search,
    };
  },
});
</script>

<style lang="scss">
.header {
  top: 97px;
}
.block-search {
  padding: 20px 32px 2px;

  .q-field__control {
    background-color: #f8f8f8;
  }

  .q-field__control {
    height: 40px;
  }

  .q-field__bottom {
    padding: 0;
  }

  .q-field--with-bottom {
    padding: 0;
  }

  .q-field__marginal {
    height: 40px;
  }

  .q-icon {
    font-size: 16px;
    color: #565656;
  }
}
</style>
