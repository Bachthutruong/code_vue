<template>
  <div class="channel-info q-mb-lg">
    <div class="channel-info__text">
      <p class="channel-info__label">{{ aboutTabFieldName.name }}</p>
      <p class="channel-info__value">#{{ channelData.name }}</p>
    </div>
    <div
      v-if="checkOwnerEdit && hasEdit"
      class="channel-info--action"
    >
      <c-btn
        label="Edit"
        color="primary"
        flat
        @click="onEditField('name')"
      />
    </div>
  </div>

  <div class="channel-info-list q-mb-lg">
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.topic }}</p>
        <p class="channel-info__value">
          <template v-if="!!channelData.topic">
            {{ channelData.topic }}
          </template>
          <span
            v-else
            class="default-value"
          >
            {{ mapI18n('defaultFieldData.topic') }}
          </span>
        </p>
      </div>
      <div
        v-if="checkOwnerEdit"
        class="channel-info--action"
      >
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('topic')"
        />
      </div>
    </div>
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.description }}</p>
        <p class="channel-info__value">
          <template v-if="!!channelData.description">
            {{ channelData.description }}
          </template>
          <span
            v-else
            class="default-value"
          >
            {{ mapI18n('defaultFieldData.description') }}
          </span>
        </p>
      </div>
      <div
        v-if="checkOwnerEdit"
        class="channel-info--action"
      >
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('description')"
        />
      </div>
    </div>
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.createdBy }}</p>
        <p class="channel-info__value">{{ channelData.createdBy }}</p>
      </div>
    </div>
  </div>

  <div class="channel-info channel-info--files">
    <div class="channel-info__text">{{ aboutTabFieldName.files }}</div>
    <div class="channel-info__files-list">
      <template v-if="loadingFilesInChannel">
        <c-spinner />
      </template>
      <template v-else>
        <file-item
          v-for="item in filesInChannel"
          :key="item.id"
          :file-data="item"
          @click="showModalImg(item)"
        />
      </template>
    </div>
  </div>

  <modal-edit-field
    v-model="showEditField"
    v-model:text="editFieldData.value"
    :title="editFieldData.title"
    :label="editFieldData.label"
    :type-edit="editFieldData.type"
    :rules="editFieldData.rules"
    :max-length="editFieldData.maxLength"
    :text-ok="$t('global.save')"
    :loading="loading.updateField"
    @on-ok="updateChannelData"
  />
</template>

<script lang="ts">
import { computed, reactive, toRefs, watch } from 'vue';
import FileItem from 'components/general/FileItem.vue';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';
import ModalEditField, {
  TypeEditField,
} from 'components/channel/ModalChannelDetailComponents/ModalEditField.vue';
import { useI18n } from 'vue-i18n';
import { TypeRule } from 'src/model/Global';
import { IChannel, TypeFieldEdit } from 'src/model/ChannelDetail';
import { AboutTabFieldName, RulesEditField } from 'src/constants/ConstantChannelDetail';
import CSpinner from 'components/common/CSpinner.vue';
import {
  checkFileType,
  downloadFileUrl,
  formatDateDisplay,
  mapI18nMessage,
} from 'src/helper/global';
import NotifyServices from 'src/plugins/NotifyServices';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { filename } from 'src/constants/ConstantFile';

interface IState {
  showEditField: boolean;
  editFieldData: {
    fieldName: string;
    title: string;
    label: string;
    type: TypeEditField;
    rules: TypeRule[];
    maxLength: number | string;
    value: string;
  };
  channelData: {
    name: string;
    topic: string;
    description: string;
    createdBy: string;
  };
  rules: Record<TypeFieldEdit, TypeRule[]>;
  aboutTabFieldName: Record<string, string>;
  loading: {
    updateField: boolean;
  };
}

export default {
  name: 'AboutTab',

  components: { CSpinner, ModalEditField, FileItem },

  props: {
    loadingFilesInChannel: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const i18n = useI18n();
    const mapI18n = (path: string): string => {
      return i18n.t(`workspace.channel.modalChannelDetail.aboutTab.${path}`).toString();
    };
    const state = reactive<IState>({
      showEditField: false,
      editFieldData: {
        fieldName: '',
        title: '',
        label: '',
        type: 'textField',
        rules: [],
        maxLength: 250,
        value: '',
      },
      channelData: {
        name: '',
        topic: '',
        description: '',
        createdBy: '',
      },
      rules: {
        name: RulesEditField.name,
        topic: RulesEditField.topic,
        description: RulesEditField.description,
      },
      aboutTabFieldName: AboutTabFieldName,
      loading: {
        updateField: false,
      },
    });

    const channelStore = useChannelStore();

    const route = useRoute();
    const channelId = route?.params?.channelId as string;

    const channelDetail = computed((): IChannel => {
      return channelStore.detailChanel as IChannel;
    });
    const hasEdit = computed(() => channelDetail.value?.type !== 'GENERAL');
    const filesInChannel = computed(() => channelStore.filesInChannel);

    const mainStore = useMainStore();
    const userId = mainStore.getUser?.id;
    const checkOwnerEdit = computed(
      () => userId === channelDetail.value?.owner?.id || actionRoleAdminWs.value,
    );
    const workspaceStore = useWorkspaceStore();

    const roleAdminWeb = computed(() => {
      return mainStore.roleAdminWeb;
    });
    const actionRoleAdminWs = computed(() => {
      return (
        roleAdminWeb.value ||
        workspaceStore.workspaceRoleOwner ||
        workspaceStore.workspaceRoleAdmin
      );
    });
    watch(
      channelDetail,
      () => {
        const fullName = channelDetail.value?.owner?.full_name || '';
        const createdAt = formatDateDisplay(channelDetail.value?.created_at);
        state.channelData.createdBy = i18n.t('global.createdBy', [fullName, createdAt]);
        state.channelData.name = channelDetail.value?.name || '';
        state.channelData.topic = channelDetail.value?.topic || '';
        state.channelData.description = channelDetail.value?.description || '';
      },
      { immediate: true },
    );

    const onEditField = (fieldNameEdit: TypeFieldEdit) => {
      if (!channelDetail.value) return;
      state.editFieldData.fieldName = fieldNameEdit;
      state.editFieldData.title = mapI18n(`editFieldTitle.${fieldNameEdit}`);
      state.editFieldData.label = mapI18n(`editFieldLabel.${fieldNameEdit}`);
      state.editFieldData.rules = state.rules[fieldNameEdit];
      state.editFieldData.value = channelDetail.value[fieldNameEdit] || '';
      if (fieldNameEdit === 'name') {
        state.editFieldData.type = 'textField';
      } else {
        state.editFieldData.type = 'textArea';
      }
      state.showEditField = true;
    };

    const reloadChannelData = () => {
      mainStore.actionReloadAllPage();
      channelStore.getChannelDetail(channelId).then();
    };

    const updateChannelData = () => {
      state.loading.updateField = true;
      const fieldName = state.editFieldData.fieldName;
      const body: Record<string, string> = {};
      body[fieldName] = state.editFieldData.value;
      channelStore
        .updateChannel(channelId, body)
        .then(() => {
          state.showEditField = false;
          const message = mapI18nMessage('updateSuccess', [
            state.aboutTabFieldName[fieldName],
          ]);
          NotifyServices.showMessageSuccess(message);
          reloadChannelData();
        })
        .catch((err) => {
          if (err.status_code === 406) {
            state.showEditField = false;
            reloadChannelData();
          }
        })
        .finally(() => {
          state.loading.updateField = false;
        });
    };

    const fileType = (item: any) => {
      const _file = checkFileType(item);
      return filename[_file.type];
    };
    const showModalImg = (item: any) => {
      if (fileType(item) === 'Image') {
        workspaceStore.setListViewFile([item]);
      } else {
        downloadFile(item);
      }
    };
    const downloadFile = (item: any) => {
      console.log(item);
      downloadFileUrl(item);
    };
    return {
      ...toRefs(state),
      onEditField,
      mapI18n,
      updateChannelData,
      hasEdit,
      filesInChannel,
      checkOwnerEdit,
      actionRoleAdminWs,
      showModalImg,
    };
  },
};
</script>

<style lang="scss" scoped>
.channel-info {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  p {
    font-size: 14px;
    color: #2f2f2f;
    line-height: 20px;
  }
  &__label {
    font-weight: 500;
    margin-bottom: 4px;
  }
  &__value {
    margin-bottom: 0;
    font-weight: 400;
  }
  &--action {
    height: 20px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.channel-info-list {
  background: #fff;
  border-radius: 16px;
  .channel-info {
    border-radius: unset;
    background: unset;
    border-bottom: 1px solid #e9eae8;
    &:last-child {
      border: 0;
    }
    .default-value {
      color: #878b87;
    }
  }
}

.channel-info--files {
  display: flex;
  flex-direction: column;
  .channel-info__files-list {
    width: 100%;
    margin: 0 -8px;
    max-height: 224px;
    overflow-y: auto;
  }
}
</style>
