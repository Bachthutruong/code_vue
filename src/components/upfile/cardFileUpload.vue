<template>
  <div
    v-if="fileType.type === 'Image'"
    class="card-img relative-position col cursor-pointer"
  >
    <CAvatar
      size="60px"
      rounded
      :avatar="defaultFiles?.url"
      @click="showImg()"
    />
    <q-inner-loading :showing="!defaultFiles?.id">
      <q-spinner
        color="primary"
        size="18px"
        :thickness="3"
      />
    </q-inner-loading>
    <div
      v-if="defaultFiles?.id && showRemoveItem"
      class="card-img-remove"
    >
      <q-icon
        class="cursor-pointer"
        size="16px"
        name="bi-x"
        @click="removeFile"
      />
    </div>
  </div>

  <q-item
    v-else
    class="card-upload col-6 cursor-pointer"
  >
    <q-item-section
      avatar
      @click="downloadFile()"
    >
      <CAvatar
        size="32px"
        rounded
        :avatar="fileType?.img"
      />
    </q-item-section>

    <q-item-section
      class="card-upload-body"
      @click="downloadFile()"
    >
      <q-item-label class="card-upload-body-name ellipsis">
        {{ defaultFiles?.name || defaultFiles?.originalname || '' }}</q-item-label
      >
      <q-item-label
        class="card-upload-body-type"
        caption
        lines="1"
        >{{ fileType?.type || 'File' }}</q-item-label
      >
    </q-item-section>

    <q-item-section
      side
      class="card-upload-action"
    >
      <q-spinner
        v-if="!defaultFiles?.id"
        color="primary"
        size="24px"
        :thickness="4"
      />
      <q-icon
        v-if="defaultFiles?.id && showRemoveItem"
        class="cursor-pointer action-remove"
        size="16px"
        name="bi-x"
        @click="removeFile"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from 'vue';
import { checkFileType, downloadFileUrl } from 'src/helper/global';
import { filename } from 'src/constants/ConstantFile';
export default defineComponent({
  name: 'cardFileUpload',
  components: {},
  props: {
    defaultFiles: {
      type: Object,
      default() {
        return null;
      },
    },
    showRemoveItem: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: Array,
      default() {
        return [];
      },
    },
    isDownload: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['removeFile', 'showModalImg'],
  setup(props, { emit }) {
    const state = reactive<{
      model: any;
    }>({
      model: {},
    });
    const fileType = computed(() => {
      // @ts-ignore
      const _file = checkFileType(props?.defaultFiles);

      return {
        type: filename[_file.type],
        img: _file.image,
      };
    });
    const removeFile = () => {
      emit('removeFile', props.defaultFiles);
    };
    const showImg = () => {
      emit('showModalImg');
    };
    const downloadFile = () => {
      if (!props.defaultFiles?.id || !props.isDownload) return;
      // @ts-ignore
      downloadFileUrl(props?.defaultFiles);
    };
    return {
      ...toRefs(state),
      fileType,
      removeFile,
      showImg,
      downloadFile,
    };
  },
});
</script>

<style lang="scss" scoped>
.card-img-remove {
  .q-icon {
    color: #fff;
  }
}

.action-remove {
  color: #3c3c3c;
}
</style>
