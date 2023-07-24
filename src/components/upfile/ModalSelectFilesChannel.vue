<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watchEffect } from 'vue';
import FileItem from 'components/general/FileItem.vue';
import CConfirm from 'components/common/CConfirm.vue';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import { useChannelStore } from 'stores/channel';
import ChannelService from 'src/services/channel';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ModalSelectFilesChannel',
  components: { CConfirm, FileItem },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    channelId: {
      type: [String, Number],
      default: '',
    },
    defaultFiles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ['update:modelValue', 'close', 'submit', 'update:defaultFiles'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const state = reactive<{
      infoModalConfirm: typeInfoModalConfirm;
      filesInChannel: any;
      files: any;
      selectedFile: any;
      channelId: number | string;
    }>({
      infoModalConfirm: {
        type: 'info',
        title: t('workspace.wiki.popupGetFiles.title'),
        textOk: t('workspace.wiki.popupGetFiles.textOk'),
        textCancel: t('global.cancel'),
        alignFooter: 'center',
        desc: '',
        disabled: false,
        action: () => {
          state.files = [...state.files, ...state.selectedFile].reduce((acc, current) => {
            const existingItem = acc.find((item: any) => item.id === current.id);
            if (existingItem) {
              Object.assign(existingItem, current);
            } else {
              acc.push(current);
            }
            return acc;
          }, []);
          emit('update:defaultFiles', state.files);
          closeModal();
        },
      },
      filesInChannel: [],
      files: [],
      selectedFile: [],
      channelId: '',
    });
    const channelStore = useChannelStore();

    watchEffect(() => {
      if (props?.channelId !== state?.channelId) {
        state.channelId = props.channelId;
        state.files = [];
        state.selectedFile = [];
        ChannelService.getFilesInChannel(state.channelId, {
          page: 1,
          page_size: 99999,
        }).then((res: any) => {
          if (res?.status_code === 200 && res?.data?.data) {
            state.filesInChannel = res?.data?.data;
          }
        });
      }
      if (props.defaultFiles) {
        state.selectedFile = props.defaultFiles;
      }
    });

    const disabledListFile = computed(() => {
      const mergedItems = state.files.concat(state.selectedFile);
      const idSet = new Set();
      mergedItems.forEach((item: any) => {
        idSet.add(item.id);
      });
      const uniqueIds = Array.from(idSet);
      return uniqueIds?.length >= 5;
    });
    const disabledFile = (file: any) => {
      const index = state.selectedFile.findIndex((item: any) => item.id === file.id);
      return index < 0 && disabledListFile.value;
    };
    const isShow = computed({
      get: () => {
        return props.value;
      },
      set: (val) => {
        emit('update:modelValue', val);
      },
    });

    const closeModal = () => {
      isShow.value = false;
      state.files = [];
      emit('close');
    };

    return {
      ...toRefs(state),
      disabledListFile,
      isShow,
      disabledFile,
      closeModal,
    };
  },
});
</script>

<template>
  <c-confirm
    v-model="isShow"
    :title="infoModalConfirm.title"
    :text-ok="infoModalConfirm.textOk"
    :text-cancel="infoModalConfirm.textCancel"
    :disabled="infoModalConfirm.disabled"
    :alignFooter="infoModalConfirm.alignFooter"
    @on-ok="infoModalConfirm.action"
  >
    <template
      v-if="infoModalConfirm.type === 'info'"
      #body
    >
      <div class="file-list">
        <div class="selected-files text-primary">
          {{
            $t('workspace.wiki.popupGetFiles.selectedFiles', {
              count: selectedFile?.length,
            })
          }}
        </div>
        <div
          v-for="item in filesInChannel"
          :key="item.id"
          class="box-center"
          :class="{
            disabled: disabledFile(item),
          }"
        >
          <q-checkbox
            class="q-checkbox-custom"
            color="primary"
            :disable="disabledFile(item)"
            :val="item"
            v-model="selectedFile"
          ></q-checkbox>
          <file-item :file-data="item" />
        </div>
      </div>
    </template>
  </c-confirm>
</template>

<style scoped lang="scss">
.box-center {
  display: flex;
  align-items: center;

  .q-field {
    padding-bottom: 0;
    width: calc(100% - 76px);
  }
}
.selected-files {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}

:deep(.selectedItem) {
  max-width: 500px;
}
</style>
