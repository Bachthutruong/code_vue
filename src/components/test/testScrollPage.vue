<template>
  <!--     :

    :items="items"

    -->
  <q-virtual-scroll
    ref="virtualListRef"
    :virtual-scroll-sticky-size-start="20"
    :virtual-scroll-item-size="50"
    :items-size="size"
    :items-fn="getItems"
    separator
    v-slot="{ item, index }"
  >
    <async-component
      :key="index"
      :index="item.index"
      :sent="item.sent"
    ></async-component>
  </q-virtual-scroll>
</template>

<script>
import { QChatMessage, QSkeleton } from 'quasar';
import { h, defineComponent, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

const AsyncComponent = defineComponent({
  props: {
    index: Number,
    sent: Boolean,
  },

  setup(props) {
    const asyncContent = ref(null);

    let timer;

    onBeforeMount(() => {
      timer = setTimeout(() => {
        asyncContent.value = {
          sent: props.sent,
          name: props.sent === true ? 'me' : 'Someone else',
          avatar:
            props.sent === true
              ? 'https://cdn.quasar.dev/img/avatar4.jpg'
              : 'https://cdn.quasar.dev/img/avatar3.jpg',
          stamp: `${Math.floor(props.index / 1000)} minutes ago`,
          text: [`Message with id ${props.index}`],
        };
      }, 300 + Math.random() * 2000);
    });

    onBeforeUnmount(() => {
      clearTimeout(timer);
    });

    return () => {
      if (asyncContent.value === Object(asyncContent.value)) {
        return h(QChatMessage, {
          class: 'q-mx-sm',
          key: props.index,
          ...asyncContent.value,
        });
      }

      const content = [
        h(QSkeleton, {
          class: 'on-left on-right',
          animation: 'none',
          type: 'text',
          width: '150px',
          height: '100px',
        }),
      ];

      content[props.sent === true ? 'push' : 'unshift'](
        h(QSkeleton, {
          animation: 'none',
          type: 'QAvatar',
        }),
      );

      return h(
        'div',
        {
          class: `row no-wrap items-center q-mx-sm justify-${
            props.sent === true ? 'end' : 'start'
          }`,
          style: 'height: 108px',
          key: props.index,
        },
        content,
      );
    };
  },
});

const size = ref(400);
const allItems = Array(size.value)
  .fill(null)
  .map((_, index) => ({
    index,
    sent: Math.random() > 0.5,
  }));
export default {
  components: {
    AsyncComponent,
  },

  setup() {
    const virtualListRef = ref(null);
    const virtualListIndex = ref(allItems.length - 1);

    const items = ref([]);
    const callAPi = (from, size) => {
      const items = [];
      for (let i = 0; i < size; i++) {
        items.push(allItems[from + i]);
      }
      return items;
    };

    onMounted(() => {
      items.value = callAPi(0, 20);
      virtualListRef.value.scrollTo(virtualListIndex.value);
    });
    return {
      size,
      virtualListRef,
      virtualListIndex,
      items,
      onVirtualScroll(details) {
        console.log(details);
        items.value = callAPi(details.from, details.to - details.from);
      },
      executeScroll() {
        virtualListRef.value.scrollTo(virtualListIndex.value, 'start-force');
      },
      getItems(from, size) {
        console.log('from', from);
        console.log('size', size);
        const items = callAPi(from, size);

        console.log('items', items);
        return Object.freeze(items);
      },
    };
  },
};
</script>
