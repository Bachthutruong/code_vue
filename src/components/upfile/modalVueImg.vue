<template>
  <c-modal
    v-model="isShow"
    :title="title"
    class-modal="modal-show-image"
    :showFooter="false"
    @close="closeModal"
  >
    <div
      class="box-zoomer"
      id="zoomImg"
    >
      <VZoomerGallery
        ref="vZoomer"
        :list="listImg"
        :key="selIndex"
        :mouseWheelToZoom="false"
        v-model="selIndex"
        @swipe="handleScroll"
      ></VZoomerGallery>
      <c-btn
        v-if="listImg.lenght > 1"
        color="neutral-5"
        size="large"
        icon="bi-arrow-left"
        class="btn-prev"
        round
        outline
        :disabled="selIndex === 0"
        @click="selIndex -= 1"
      />
      <c-btn
        v-if="listImg.lenght > 1"
        color="neutral-5"
        size="large"
        class="btn-next"
        icon="bi-arrow-right"
        round
        outline
        :disabled="selIndex === listImg.length - 1"
        @click="selIndex += 1"
      />
      <q-item class="q-item-box-size">
        <q-item-section side>
          <q-icon
            name="bi-dash-lg"
            color="white"
            size="24px"
            class="cursor-pointer"
            @click="actionZoomOut"
          />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="sliderValue"
            :min="1"
            :max="4"
            :step="1"
            inner-track-color="neutral-5"
            color="white"
          />
        </q-item-section>
        <q-item-section side>
          <q-icon
            name="bi-plus-lg "
            color="white"
            size="24px"
            class="cursor-pointer"
            @click="actionZoomIn"
          />
        </q-item-section>
      </q-item>
    </div>
  </c-modal>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  name: 'modalVueImg',
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const vZoomer = ref();
    const workspaceStore = useWorkspaceStore();
    const isShow = computed({
      get: () => {
        return workspaceStore.IsShowModalViewFile;
      },
      set: (val) => {
        workspaceStore.IsShowModalViewFile = val;
      },
    });
    const selIndex = ref(0);
    const sliderValue = ref(1);
    const listViewFile = computed(() => {
      if (workspaceStore.listViewFile) return workspaceStore.listViewFile;
      return [];
    });
    const listImg = computed(() => {
      if (listViewFile.value) return listViewFile.value.map((item: any) => item.url);
      return [];
    });
    const title = computed(() => {
      return listViewFile.value[selIndex.value]?.name || '';
    });
    const actionZoomOut = () => {
      if (sliderValue.value < 2) {
        sliderValue.value = 1;
      } else sliderValue.value -= 1;

      // zoomOut()
    };

    const actionZoomIn = () => {
      if (sliderValue.value > 4) {
        sliderValue.value = 5;
      } else sliderValue.value += 1;
    };

    const zoomOut = (val: number) => {
      const zoom = 1 / val;
      console.log(zoom);

      if (zoom && val > 2) vZoomer.value.zoomOut(zoom);
      else vZoomer.value.reset();
    };
    const zoomIn = (val: number) => {
      const zoom = val;
      console.log(zoom);

      vZoomer.value.zoomIn(zoom);
    };
    watch(isShow, (val) => {
      if (val) {
        nextTick(() => {
          const scrollableElement = document.getElementById('zoomImg') as any;
          if (scrollableElement)
            scrollableElement.addEventListener('wheel', handleScroll);
        });
      }
    });
    watch(sliderValue, (val, old) => {
      const zoom = val;
      if (val > old) {
        zoomIn(zoom);
      } else {
        zoomOut(zoom);
      }
    });
    const closeModal = () => {
      isShow.value = false;
      emit('close');
    };

    const handleScroll = (event: any) => {
      let delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        actionZoomOut();
      } else if (delta > 0) {
        actionZoomIn();
      }
    };
    // onMounted(() => {
    // })
    return {
      isShow,
      title,
      closeModal,
      selIndex,
      listImg,
      sliderValue,
      vZoomer,
      zoomOut,
      zoomIn,
      actionZoomOut,
      actionZoomIn,
      handleScroll,
    };
  },
});
</script>

<!--<style scoped></style>-->
