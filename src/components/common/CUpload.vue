<template>
  <div>
    <slot
      name="action"
      v-bind="{ handleUpload }"
    />
    <q-file
      v-if="showUpFile"
      v-model="model"
      v-bind="{ ...$attrs }"
      :multiple="multiple"
      :max-file-size="maxFileSize"
      max-files="5"
      ref="fileInput"
    >
      <template v-slot:prepend>
        <q-icon
          name="bi-cloud-upload"
          size="16px"
        ></q-icon>
      </template>
    </q-file>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import FileService from 'src/services/file';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'UploadFile',

  props: {
    defaultFile: {
      type: [Array, String],
      default() {
        return null;
      },
    },
    maxFileSize: {
      type: Number,
      default: 25 * 1014 * 1014,
      //  = 25mb
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    uploadPrivate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['get-file', 'get-file-before', 'remove-file'],
  setup(props, { emit }) {
    // const state = reactive<{
    //   model: any;
    // }>({
    //   model: null,
    // });
    const { t } = useI18n();

    const model: any = ref(null);
    const showUpFile: any = ref(false);
    const fileInput = ref();
    const handleUpload = () => {
      showUpFile.value = true;
      setTimeout(() => {
        fileInput.value.pickFiles();
      }, 1);
    };

    const resetData = () => {
      model.value = null;
    };

    const removeFile = (e: any) => {
      emit('remove-file', e);
      // fileInput.value.removeFile(e)
      resetData();
    };
    const checkFile = (file: any) => {
      if (file?.[0]?.size === 0) {
        removeFile(file);
        NotifyServices.showMessageError(t('upload.notify.nodata'));
        return false;
      }
      return true;
    };
    const upFile = (e: any) => {
      console.log(e);
      const check = checkFile(e);
      if (!check) return;
      // model.value = null
      fileInput.value.blur();
      let payload: any = new FormData();
      if (props.multiple) {
        for (let i = 0; i < e.length; i++) {
          payload.append('files', e[i]);
        }
      } else {
        payload.set('files', e);
      }
      emit('get-file-before', e);
      if (props.uploadPrivate) return;
      FileService.uploadFile(payload)
        .then((res: any) => {
          if (res?.status_code === 200) {
            emit('get-file', res?.data);
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          removeFile(e);
          NotifyServices.showMessageError(err?.message);
        })
        .finally(() => {
          showUpFile.value = false;
          removeFile(e);
        });
    };
    watch(model, (val) => {
      if (val) {
        upFile(val);
      }
    });

    return {
      // ...toRefs(state),
      fileInput,
      model,
      upFile,
      handleUpload,
      showUpFile,
    };
  },
});
</script>

<style scoped lang="scss">
.q-file {
  display: none;

  .q-icon {
    align-items: center;
  }
}
</style>
