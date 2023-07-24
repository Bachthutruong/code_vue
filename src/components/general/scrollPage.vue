<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

export default defineComponent({
  name: 'scrollPage',
  props: {
    offset: {
      type: Number,
      default: 250,
    },
    scrollType: {
      type: String,
      default: 'bottom',
      //   bottom | top | flexible
    },
    maxHeight: {
      type: String,
      default: '',
    },
    scrollTargetRef: {
      type: Object,
      default() {
        return null;
      },
    },
    activeScroll: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['loadNewDataTop', 'loadNewDataBottom'],
  setup(props, { emit }) {
    const state = reactive<{
      selectedId: string;
      loadingTop: boolean;
      loadingBottom: boolean;
      indexScroll: any;
    }>({
      selectedId: 'scrollId',
      loadingTop: false,
      loadingBottom: false,
      indexScroll: null,
    });

    const cacheIndex = (element: any) => {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      state.indexScroll = {
        scrollTop,
        scrollHeight,
      };
    };

    const setIndex = (element: any) => {
      nextTick(() => {
        const { scrollTop, scrollHeight } = state.indexScroll;
        const newScrollHeight = element.scrollHeight;
        const newClientHeight = element.clientHeight;
        const newScrollTop = scrollTop + newScrollHeight - scrollHeight - newClientHeight;
        element.scrollTop = newScrollTop;
      });
    };

    const refScroll = ref();
    const refElement = computed(() => {
      return props?.scrollTargetRef || refScroll?.value;
    });
    const scrollLoad = (element: any) => {
      nextTick(() => {
        if (element.scrollTop === 0) {
          if (!state.loadingTop) {
            cacheIndex(element);
            loadNewData();
          }
        }
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
          if (!state.loadingBottom) {
            cacheIndex(element);
            loadMoreData();
          }
        }
      });
    };

    const done = (isNotSetIndex?: boolean) => {
      const element = props?.scrollTargetRef as any;
      nextTick(() => {
        if (state.loadingTop) {
          if (!isNotSetIndex) {
            setIndex(element);
          }
          state.loadingTop = false;
        }
        if (state.loadingBottom) {
          if (!isNotSetIndex) {
            setIndex(element);
          }
          state.loadingBottom = false;
        }
      });
    };

    const loadNewData = () => {
      state.loadingTop = true;
      emit('loadNewDataTop', (isNotSetIndex?: boolean) => {
        done(isNotSetIndex);
      });
    };
    const loadMoreData = () => {
      state.loadingBottom = true;
      emit('loadNewDataBottom', (isNotSetIndex?: boolean) => {
        done(isNotSetIndex);
      });
    };

    // const handleScroll = () => {
    //   if (refElement.value.scrollTop === 0) {
    //     if (!state.loadingTop && ['top', 'flexible'].includes(props?.scrollType)) {
    //       loadNewData();
    //     }
    //   }
    //   if (
    //     refElement.value.scrollHeight - refElement.value.scrollTop ===
    //     refElement.value.clientHeight
    //   ) {
    //     if (!state.loadingBottom && ['bottom', 'flexible'].includes(props?.scrollType)) {
    //       loadMoreData();
    //     }
    //   }
    // };
    watch(props, () => {
      nextTick(() => {
        if (props?.scrollTargetRef) {
          const element = props?.scrollTargetRef as any;
          element.addEventListener(
            'scroll',
            () => {
              scrollLoad(element);
            },
            { passive: true },
          );
        }
      });
    });
    onMounted(() => {
      //  option 2 => scroll theo scrollTargetRef
      if (props?.scrollTargetRef) {
        const element = props?.scrollTargetRef as any;
        element.addEventListener(
          'scroll',
          () => {
            scrollLoad(element);
          },
          { passive: true },
        );
      }
    });
    return {
      ...toRefs(state),
      refScroll,
      // handleScroll,
      refElement,
    };
  },
});
</script>

<template>
  <!-- :id="selectedId" -->
  <div
    class="page-scroll"
    :style="{
      'max-height': maxHeight,
      'overflow-y:': !scrollTargetRef ? 'scroll' : 'inherit',
    }"
    :ref="scrollTargetRef ? undefined : refScroll"
  >
    <!--    <slot name="loadingTop">-->
    <!--      <div-->
    <!--        v-show="loadingTop"-->
    <!--        class="loadingTop row justify-center q-my-md"-->
    <!--      >-->
    <!--        <q-spinner-dots-->
    <!--          color="primary"-->
    <!--          size="40px"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </slot>-->
    <slot></slot>
    <!--    <slot name="loadingBottom">-->
    <!--      <div-->
    <!--        v-show="loadingBottom"-->
    <!--        class="loadingBottom row justify-center q-my-md"-->
    <!--      >-->
    <!--        <q-spinner-dots-->
    <!--          color="primary"-->
    <!--          size="40px"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </slot>-->
  </div>
</template>

<style scoped lang="scss">
.page-scroll {
  //overflow-anchor: auto;
}
</style>
