<template>
  <q-dialog
    v-bind="$attrs"
    seamless
    position="right"
  >
    <div class="cursor-pointer">
      <template v-for="(formNotify, index) in listNotify">
        <cardNotify
          v-if="index > listNotify.length - 4 && formNotify.show"
          :form-notify="formNotify"
          :key="index"
          @close="formNotify.show = false"
        ></cardNotify>
      </template>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useMainStore } from 'stores/main';
import cardNotify from 'components/general/cardNotify.vue';
import {
  formatNotify,
  notifyType,
  typeToChat,
  typeToTaskDetail,
  typeToTaskDetailComment,
} from 'src/constants/ConstantNotify';
import { formNotify } from 'src/interface/notify';

import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'CNotify',
  components: {
    cardNotify,
  },
  setup() {
    const showNotify = ref(true);
    const mainStore = useMainStore();
    const listNotify = computed(() => {
      return mainStore.listNotify;
    });
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const route = useRoute();

    const channel = new BroadcastChannel('background-message-channel');
    channel.addEventListener('message', (event) => {
      // document.addEventListener('visibilitychange', function() {
      //   if (document.hidden) {
      //     const url = `${location.origin}/sound/messenger-fb.mp3`;
      //     const audio = new Audio(url);
      //     audio.play();
      //   }
      // });
      // getPayload(event?.data)
      console.log(11, event.data);

      const payload = event.data as any;

      const checkNotify = !!notifyType[payload?.data?.type] as boolean;
      if (
        Number(payload?.data?.workspace_id) === Number(route?.params?.workspaceId) &&
        Number(payload?.data?.actor_id) !== Number(infoUser.value?.id) &&
        checkNotify
      ) {
        let newNotify = formatNotify(event.data) as formNotify;

        if (route?.name && route.params.channelId === payload.data.channel_id) {
          if (
            ['channel-chat', 'one-to-one-chat'].includes(route?.name as string) &&
            typeToChat.includes(payload?.data?.type)
          ) {
            newNotify.show = false;
          }

          if (
            route.query?.taskId === payload.data.task_id &&
            [...typeToTaskDetailComment].includes(payload?.data?.type)
          ) {
            newNotify.show = false;
          }
        }
        const duplicatedItem = listNotify.value.find(
          (item: formNotify) => item.id === newNotify.id,
        );
        if (duplicatedItem) return;
        mainStore.addListNotify(newNotify);
        mainStore.actionReloadAllPage();
      }
    });
    // window.onfocus(())
    return {
      showNotify,
      listNotify,
    };
  },

  data() {
    return {
      notify: true,
    };
  },
  validations: function () {
    return {};
  },
});
</script>
