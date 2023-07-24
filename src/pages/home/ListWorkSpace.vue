<template>
  <div class="list-ctrl column items-center justify-center">
    <div class="create-change">
      <div class="change-content">
        {{ $t('workspace.workspace.listWorkspace.signed') }}
        <span>{{ infoUser?.email || '' }}. </span>
        <a
          href="javascript:void(0)"
          @click="showModalSwitchAccount"
          >{{ $t('workspace.workspace.switch') }}</a
        >
      </div>
    </div>
    <div class="list-logo">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="list-top items-center">
      <div class="list-title text-center">
        <span>{{ $t('workspace.workspace.listWorkspace.welcomeBack') }}</span>
        {{ $t('workspace.workspace.listWorkspace.stay') }}
      </div>
      <div class="list-desc">
        {{ $t('workspace.workspace.listWorkspace.chooseWorkspace') }}
      </div>
    </div>

    <ListRoom class="list-room" />

    <div class="list-bottom row items-center">
      <img
        src="~assets/t-message/archery.svg"
        alt=""
      />
      <div class="list-bottom__desc">
        {{ $t('workspace.workspace.listWorkspace.differentTeam') }}
        <a
          href="javascript:void(0)"
          @click="$router.push({ name: 'create-workspace' })"
          >{{ $t('workspace.workspace.listWorkspace.anotherWorkspace') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ListRoom from 'src/components/general/ListRoom.vue';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  name: 'ListWorkSpace',
  components: {
    ListRoom,
  },
  setup() {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const workspaceStore = useWorkspaceStore();

    const showModalSwitchAccount = () => {
      workspaceStore.showModalSwitchAccount(true);
    };
    return {
      ListRoom,
      infoUser,
      showModalSwitchAccount,
    };
  },
});
</script>

<style scoped lang="scss">
.list-ctrl {
  flex-wrap: nowrap;
  padding-top: 50px;
  //height: 100vh;

  .list-logo {
    padding-bottom: 48px;
  }
  .list-top {
    display: flex;
    flex-direction: column;

    .list-title {
      font-size: 38px;
      font-weight: 500;
      line-height: 46px;
      color: #2f2f2f;

      span {
        color: #1c8c44;
      }
    }

    .list-desc {
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      color: #878b87;
      padding-bottom: 31px;
    }
  }

  .list-room {
    :deep(.q-list) {
      width: 672px;
      .q-item {
        width: 672px;
      }
    }
  }

  .list-bottom {
    padding-top: 8px;
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    .list-bottom__desc {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #565656;

      a {
        color: #1e89e5;
        text-decoration: none;
      }
    }
  }
}
.create-change {
  background-color: #e7f6e9;
  border-radius: 100px;
  margin-bottom: 36px;
  .change-content {
    font-size: 14px;
    padding: 8px 16px;
    color: #000;
    span {
      font-weight: 500;
      padding-right: 24px;
    }
    a {
      text-decoration: none;
      color: #1c8c44;
    }

    a:hover {
      text-decoration: underline;
    }
  }
}
</style>
