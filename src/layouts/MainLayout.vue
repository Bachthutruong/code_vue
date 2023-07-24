<template>
  <q-layout>
    <q-page-container>
      <div class="auth-area">
        <div class="main-body">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>

<style scoped lang="scss">
.auth-area {
  .main-body {
    min-height: 100vh;
  }
}
</style>
