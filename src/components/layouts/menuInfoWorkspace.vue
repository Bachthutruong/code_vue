<template>
  <q-menu
    class="menu-workspace"
    :offset="[0, 8]"
    max-width="384px"
  >
    <q-list>
      <q-item class="list-item-info">
        <q-item-section
          avatar
          top
        >
          <q-avatar
            v-if="detailWorkspace?.thumbnail?.url"
            size="48px"
          >
            <img :src="detailWorkspace?.thumbnail?.url" />
          </q-avatar>
          <q-avatar
            v-else
            size="48px"
            color="purple-1"
            text-color="white"
          >
            <span class="text-uppercase">{{
              detailWorkspace?.name.split('')[0] || ''
            }}</span>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ detailWorkspace?.name }}</q-item-label>
          <q-item-label caption>
            {{ `${host}/workspace/${detailWorkspace?.id}` }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator color="#E9EAE8" />
      <!--      <q-item class="text-center list-item-price">-->
      <!--        <q-item-section>-->
      <!--          <q-item-label>-->
      <!--            <q-icon-->
      <!--              name="bi-database-check"-->
      <!--              size="16px"-->
      <!--            />-->
      <!--            Your total used storage-->
      <!--          </q-item-label>-->
      <!--          <q-item-label caption>20 GB</q-item-label>-->
      <!--        </q-item-section>-->
      <!--      </q-item>-->
      <!--      <q-separator color="#E9EAE8" />-->
      <template
        v-for="(menuItem, index) in menu"
        :key="index"
      >
        <q-item
          v-if="!menuItem?.hidden"
          class="list-item-action"
          clickable
          active-class="active-item"
          v-ripple
          @click="menuItem.action"
        >
          <q-item-section>
            {{ menuItem.title }}
          </q-item-section>
        </q-item>
        <q-separator
          v-if="menuItem.separator"
          color="#E9EAE8"
          :key="index"
        />
      </template>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useChannelStore } from 'stores/channel';
import { useMainStore } from 'stores/main';
import { RoleUSer } from 'src/constants/ConstantUser';

export default defineComponent({
  name: 'menuInfoWorkspace',

  setup() {
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const channelStore = useChannelStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const roleUser = computed(() => {
      return mainStore.getRole;
    });
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const host = computed(() => {
      return window.location.host;
    });
    const invitePeople = () => {
      workspaceStore.showModalInvite(true);
    };
    const createChannel = () => {
      channelStore.showModalAddChannel(true);
    };

    const admin = () => {
      if (actionRoleAdminWs.value) {
        router.push({
          name: 'admin',
        });
        workspaceStore.showDrawerRightProfile(false);
      }
    };
    const addWorkspace = () => {
      router.push({
        name: 'create-workspace',
      });
    };

    const signOutWorkspace = () => {
      router.push({
        name: 'home-workspace',
      });
      workspaceStore.$reset();
    };

    const actionRoleAdmin = computed(() => {
      return roleUser.value === RoleUSer['ADMIN'];
    });
    const actionRoleAdminWs = computed(() => {
      return (
        actionRoleAdmin.value ||
        workspaceStore.workspaceRoleOwner ||
        workspaceStore.workspaceRoleAdmin
      );
    });

    const menu = computed(() => {
      console.log(actionRoleAdminWs);
      return [
        {
          title: t('workspace.menuDetail.invitePeople'),
          action: () => invitePeople(),
        },
        {
          title: t('workspace.menuDetail.createChannel'),
          action: () => createChannel(),
          separator: true,
        },
        {
          title: t('workspace.menuDetail.people'),
          action: () => {
            router.push({
              name: 'people',
            });
          },
        },
        {
          title: t('workspace.menuDetail.statistic'),
          action: () => {
            router.push({
              name: 'chart',
            });
          },
          separator: true,
        },
        {
          title: t('workspace.menuDetail.admin'),
          action: () => admin(),
          hidden: !actionRoleAdminWs.value,
          separator: actionRoleAdminWs.value,
        },
        {
          title: t('workspace.menuDetail.addWorkspace'),
          action: () => addWorkspace(),
          // separator: true,
        },
        // {
        //   title: t('workspace.menuDetail.switchWorkspace'),
        //   action: () => switchWorkspace(),
        //   separator: true,
        // },
        {
          title: t('workspace.menuDetail.signOutWorkspace'),
          action: () => signOutWorkspace(),
        },
      ];
    });
    // const state = reactive<{
    //   menu: any;
    // }>({
    //   menu:
    // });

    return {
      // ...toRefs(state),
      menu,
      detailWorkspace,
      host,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-workspace {
  width: 384px;
  height: 490px;
}
.q-icon {
  margin-right: 8px;
  margin-bottom: 3px;
}
</style>
