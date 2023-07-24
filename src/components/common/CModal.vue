<template>
  <q-dialog v-bind="$attrs">
    <q-card
      :class="classModal"
      class="CModal"
    >
      <q-card-section class="row items-center CModal-header">
        <slot
          name="title"
          v-if="title"
        >
          <div class="text-h4">{{ title }}</div>
        </slot>
        <q-space />
        <c-btn
          v-if="closeIcon"
          flat
          round
          dense
          @click="$emit('close')"
        >
          <template #default>
            <q-icon
              size="24px"
              name="bi-x-lg"
            />
          </template>
        </c-btn>
      </q-card-section>

      <q-card-section class="CModal-body">
        <slot />
      </q-card-section>
      <q-separator v-if="showFooter" />

      <q-card-actions
        class="CModal-footer"
        v-if="showFooter"
        :align="alignFooter"
      >
        <slot name="footer"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// interface IProps {
//   title?: string;
//   closeIcon?: boolean;
//   showFooter?: boolean;
//   alignFooter?: string | any;
// }

export default defineComponent({
  name: 'CModal',
  props: {
    classModal: {
      type: [String, Object, Array],
      default: '',
    },
    title: {
      type: String,
      default: 'title',
    },
    closeIcon: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    alignFooter: {
      type: String,
      default: 'right',
    },
  },
  setup() {
    // const props = defineProps<IProps>({
    //   title : {
    //
    //   }
    // })
    // labels: () => ['one', 'two']
    // {
    //   title: 'title',
    //     closeIcon: true,
    //   showFooter: true,
    //   alignFooter: 'right'
    // }
    return {};
  },
});
</script>
<style lang="scss" scoped>
.q-icon {
  color: #565656;
}

.q-separator {
  color: #e9eae8;
}
</style>
