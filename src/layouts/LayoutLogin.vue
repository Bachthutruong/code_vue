<template>
  <q-layout>
    <q-page-container>
      <div class="auth-area">
        <div class="main-body">
          <div class="relative-position">
            <router-view />
            <q-inner-loading :showing="loadingPage">
              <q-spinner-facebook
                color="green"
                size="2rem"
              />
            </q-inner-loading>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed } from 'vue';
import { useMainStore } from 'stores/main';

export default {
  name: 'LayoutLogin',
  setup() {
    const mainStore = useMainStore();

    const loadingPage = computed(() => mainStore.loadingPage);

    return {
      loadingPage,
    };
  },
};
</script>

<style scoped lang="scss">
.auth-area {
  .main-body {
    min-height: 100vh;
  }
}
</style>
