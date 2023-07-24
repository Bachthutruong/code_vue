<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs, watch, ref } from 'vue';
import HeaderFilterChannel from 'components/channel/HeaderFilterChannel.vue';
import ModalChannelDetail from 'components/channel/ModalChannelDetail.vue';
import modalAddPeople from 'components/people/modalAddPeople.vue';
import { useChannelStore } from 'stores/channel';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface IState {
  render: number;
}
export default defineComponent({
  name: 'channelDetailPage',
  components: { modalAddPeople, ModalChannelDetail, HeaderFilterChannel },
  setup() {
    const channelStore = useChannelStore();
    const mainStore = useMainStore();
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const refPage = ref();
    const state = reactive<IState>({
      render: 0,
    });

    const resetPage = () => {
      state.render += 1;
    };

    const getChannelDetail = async () => {
      if (!route?.params?.channelId) {
        await router.push({ name: 'home' });
      }
      await channelStore.getChannelDetail(`${route?.params?.channelId}`).catch((err) => {
        if (err.status_code === 404) {
          router.push({
            name: 'home',
          });
        }
        if (err.status_code === 406) {
          // const general: IChannel = channelStore.generalChannel;
          router.push({
            name: 'workspace-detail',
          });
        }
      });
      channelStore.getRoleChannel(`${route?.params?.channelId}`).catch();
      await channelStore.getAllMemberChannel(`${route?.params?.channelId}`, {
        page: 1,
        page_size: 99999,
      });
    };

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        getChannelDetail();
      }
    });
    watch(route, () => {
      if (
        !channelStore?.detailChanel?.id ||
        (route?.params?.channelId &&
          Number(route?.params?.channelId) !== channelStore?.detailChanel?.id)
      ) {
        resetPage();
        getChannelDetail();
      }
    });
    onMounted(async () => {
      await getChannelDetail();
    });
    const onEditChannel = () => {
      channelStore.IsShowModalDetailChannel = true;
    };
    return {
      ...toRefs(state),
      refPage,
      onEditChannel,
    };
  },
});
</script>

<template>
  <div class="h-100">
    <HeaderFilterChannel :key="render" />
    <router-view />
  </div>
  <modalAddPeople />
  <modal-channel-detail />
</template>

<!--<style scoped lang="scss">-->

<!--</style>-->
