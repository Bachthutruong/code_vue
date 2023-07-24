<template>
  <q-menu class="menu-workspace">
    <q-list>
      <q-item class="search-ws">
        <c-text-field
          placeholder="Find your workspace"
          prepend-icon="bi-search"
        >
        </c-text-field>
      </q-item>

      <q-list class="list-workspace">
        <q-item
          v-for="item in getAllWorkspace"
          :key="item.id"
          :class="{ 'active-item-selected': item.id === detailWorkspace.id }"
          clickable
          @click="activeWS(item)"
        >
          <q-item-section
            avatar
            top
          >
            <CAvatar
              size="40px"
              :avatar="item?.thumbnail?.url"
              :text="item?.name.split('')[0] || ''"
            >
            </CAvatar>
          </q-item-section>

          <q-item-section>
            <q-item-label
              lines="1"
              class="workspace-name"
              >{{ item?.name }}</q-item-label
            >
            <q-item-label
              lines="1"
              class="workspace-email"
              >{{ `${host}/workspace/${item.id}` }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <div
        @click="addWorkspace"
        class="menu-bottom flex items-center"
      >
        <q-icon
          name="bi-plus-circle"
          size="40px"
        ></q-icon>
        <q-item-label>{{ $t('workspace.menuDetail.signIn') }}</q-item-label>
      </div>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const workspaceStore = useWorkspaceStore();
    const host = computed(() => {
      return window.location.host;
    });
    const router = useRouter();
    const route = useRoute();

    const addWorkspace = () => {
      router.push({
        name: 'create-workspace',
      });
    };

    const activeWS = (item: any) => {
      console.log('activeWS', item);
      router.push({
        // ...route,
        name: 'dashboard',
        params: {
          workspaceId: item.id,
        },
        query: {},
      });
    };

    const getAllWorkspace = computed(() => {
      return workspaceStore.listWorkspaceOwned;
    });
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });

    return {
      getAllWorkspace,
      detailWorkspace,
      host,
      addWorkspace,
      activeWS,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-list {
  width: 384px;
  padding: 0;

  :deep(.q-item) {
    padding: 0;

    .q-field {
      width: 100%;
      //   padding: 24px 15px 0;
      .q-field__control.relative-position.row.no-wrap {
        height: 48px;
      }

      .q-field__inner.relative-position.col.self-stretch {
        padding: 24px 16px 0;
      }
      .q-field__bottom.row.items-start.q-field__bottom--animated {
        padding: 0;
      }
    }
  }
}

.list-workspace {
  overflow-y: auto;
  max-height: 400px;
  width: 384px;
  cursor: pointer;
  .q-item {
    height: 78px;
    display: flex;
    align-items: center;
    padding: 0 16px;

    .workspace-name {
      font-size: 16px;
      font-weight: 500;
      color: #2f2f2f;
      line-height: 24px;
    }
    .workspace-email {
      font-size: 14px;
      color: #878b87;
    }
  }

  .q-item:hover {
    background: #e7f6e9;
  }
}

.menu-workspace hr {
  margin: 0;
}

.menu-bottom {
  height: 72px;
  cursor: pointer;

  .q-icon {
    color: #1c8c44;
    padding: 0 12px 0 16px;
  }
  .q-item__label {
    font-size: 16px;
    color: #2f2f2f;
  }
}

.menu-bottom:hover {
  background: #e7f6e9;
}
</style>
