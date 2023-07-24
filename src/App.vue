<template>
  <router-view/>
  <CNotify
    v-model="showNotify"
  />
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, ref, watch} from 'vue';
import CNotify from "components/common/CNotify.vue";
import {useMainStore} from "stores/main";
import {useRoute} from "vue-router";
// import {}
export default defineComponent({
  name: 'App',
  components: {
    CNotify
  },
  setup() {
    const showNotify = ref(true)
    const route = useRoute();
    showNotify.value = !!route.params.workspaceId;
    watch(route, () => {
      showNotify.value = !!route.params.workspaceId;
    })
    const mainStore = useMainStore();

    const warningTitleCSS = 'color:red; font-size:60px; font-weight: bold; -webkit-text-stroke: 1px black;';
    const warningDescCSS = 'font-size: 18px;';
    if (process.env.NODE_ENV !== 'development') {
      console.log('%cStop!', warningTitleCSS);
      console.log("%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a Tmessage feature or \"hack\" someone's account, it is a scam and will give them access to your Tmessage account.", warningDescCSS);
      // console.log('%cSee https://dev.tmessage.net/ for more information.', warningDescCSS);
    }
    onMounted(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register(`${location.origin}/firebase-messaging-sw.js`)
          .then(function (registration) {
            console.log("Registration successful");
          })
          .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
          });

      }

      document.addEventListener('visibilitychange', function () {
        mainStore.isPageActive = !document.hidden;
      });
    })
    return {
      showNotify,
    }
  },
});
</script>
