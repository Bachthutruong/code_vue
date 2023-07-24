<template>
  <div class="channel-info q-mb-lg">
    <div class="channel-info__text">
      <p class="channel-info__label">{{ aboutTabFieldName.AddOrRemoveUsers }}</p>
      <p class="channel-info__value">
        {{ convertType(roleDetailChanel.AddOrRemoveUsers.type) }}
      </p>
    </div>
    <div class="channel-info--action">
      <c-btn
        label="Edit"
        color="primary"
        flat
        @click="onEditField('AddOrRemoveUsers')"
      />
    </div>
  </div>

  <div class="channel-info-list q-mb-lg">
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.creatChat }}</p>
        <p class="channel-info__value">
          {{ convertType(roleDetailChanel.creatChat.type) }}
        </p>
      </div>
      <div class="channel-info--action">
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('creatChat')"
        />
      </div>
    </div>
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.createTask }}</p>
        <p class="channel-info__value">
          {{ convertType(roleDetailChanel.createTask.type) }}
        </p>
      </div>
      <div class="channel-info--action">
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('createTask')"
        />
      </div>
    </div>
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.createWiki }}</p>
        <p class="channel-info__value">
          {{ convertType(roleDetailChanel.createWiki.type) }}
        </p>
      </div>
      <div class="channel-info--action">
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('createWiki')"
        />
      </div>
    </div>
  </div>

  <div class="channel-info-list q-mb-lg">
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.pinChat }}</p>
        <p class="channel-info__value">
          {{ convertType(roleDetailChanel.pinChat.type) }}
        </p>
      </div>
      <div class="channel-info--action">
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('pinChat')"
        />
      </div>
    </div>
    <div class="channel-info">
      <div class="channel-info__text">
        <p class="channel-info__label">{{ aboutTabFieldName.pinTask }}</p>
        <p class="channel-info__value">
          {{ convertType(roleDetailChanel.pinTask.type) }}
        </p>
      </div>
      <div class="channel-info--action">
        <c-btn
          label="Edit"
          color="primary"
          flat
          @click="onEditField('pinTask')"
        />
      </div>
    </div>
  </div>
  <ModalSetRoleField
    ref="refEditField"
    :title="editFieldData.title"
    :label="editFieldData.label"
    :text-ok="$t('global.save')"
    @on-ok="updateChannelData"
  />
</template>

<script lang="ts">
import { computed, reactive, ref, toRefs, watch } from 'vue';
import { useChannelStore } from 'stores/channel';
import ModalSetRoleField from 'components/channel/ModalChannelDetailComponents/ModalSetRoleField.vue';
import { useI18n } from 'vue-i18n';
import {
  IChannel,
  IRoleChanel,
  roleChannel,
  TypeFieldEditRole,
  TypeFieldRole,
} from 'src/model/ChannelDetail';
import { RoleChannel, RoleTabFieldName } from 'src/constants/ConstantChannelDetail';
import { useMainStore } from 'stores/main';

interface IState {
  editFieldData: {
    fieldName: string;
    title: string;
    label: string;
    value: roleChannel | any;
  };
  aboutTabFieldName: Record<string, string>;
}

export default {
  name: 'RolesTab',

  components: {
    ModalSetRoleField,
  },

  props: {},

  setup() {
    const i18n = useI18n();
    const { t } = useI18n();
    const mapI18n = (path: string): string => {
      return i18n.t(`workspace.channel.modalChannelDetail.roleTab.${path}`).toString();
    };

    const refEditField = ref();
    const state = reactive<IState>({
      editFieldData: {
        fieldName: '',
        label: '',
        title: '',
        value: null,
      },
      aboutTabFieldName: RoleTabFieldName,
    });

    const channelStore = useChannelStore();

    const channelDetail = computed((): IChannel => {
      return channelStore.detailChanel as IChannel;
    });

    const roleDetailChanel = computed((): IRoleChanel => {
      return channelStore.roleDetailChanel as IRoleChanel;
    });

    const mainStore = useMainStore();

    const onEditField = (fieldNameEdit: any) => {
      if (!channelDetail.value) return;
      state.editFieldData.fieldName = fieldNameEdit;
      state.editFieldData.label = t(
        'workspace.channel.modalChannelDetail.roleTab.editFieldTitle',
        {
          name: state.aboutTabFieldName[fieldNameEdit].toLowerCase(),
        },
      );
      state.editFieldData.title = state.aboutTabFieldName[fieldNameEdit];
      // @ts-ignore
      state.editFieldData.value = roleDetailChanel.value?.[fieldNameEdit];
      refEditField.value.showModal(state.editFieldData.value);
    };

    const updateChannelData = (type: roleChannel) => {
      const fieldName = state.editFieldData.fieldName as TypeFieldRole;
      channelStore.updateRoleChannel(fieldName, type);
    };

    const convertType = (type: TypeFieldEditRole) => {
      return RoleChannel?.[type]?.label;
    };
    return {
      ...toRefs(state),
      onEditField,
      mapI18n,
      updateChannelData,
      roleDetailChanel,
      convertType,
      refEditField,
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
