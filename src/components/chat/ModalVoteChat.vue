<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
import { useChannelStore } from 'stores/channel';
import { answerItem, TypePollVote, votedItem } from 'src/interface/chat';
import { checkDue, formatDateDisplay } from 'src/helper/global';
import CConfirm from 'components/common/CConfirm.vue';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import Chat from 'src/services/chat';
import { paramsMemberPoll } from 'src/services/chat/model';
import NotifyServices from 'src/plugins/NotifyServices';
import { useWorkspaceStore } from 'stores/workspace';

interface TypeListMember {
  value: string | number;
  img: string;
  label: string;
}
export default defineComponent({
  name: 'ModalVoteChat',
  components: { CConfirm },
  methods: { formatDateDisplay, checkDue },
  emits: ['createOption', 'votePoll'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const mapI18n = (path: string): string => {
      return t(`workspace.chat.modalVote.${path}`);
    };
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const channelStore = useChannelStore();

    const state = reactive<{
      loading: boolean;
      options: Array<any>;
      voteOptions: number | string | null;
      showModalConfirm: boolean;
      infoModalConfirm: typeInfoModalConfirm;
      listMember: Array<TypeListMember>;
    }>({
      loading: false,
      options: [],
      voteOptions: null,
      showModalConfirm: false,
      infoModalConfirm: {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      },
      listMember: [],
    });

    const resetData = () => {
      state.loading = false;
      state.options = [];
      state.voteOptions = null;
    };

    const infoVote = computed<TypePollVote>(() => channelStore.infoVote as TypePollVote);
    const votes = computed<Array<votedItem>>(
      () => infoVote.value.votes as Array<votedItem>,
    );
    const answers = computed<Array<answerItem>>(
      () => infoVote.value.answers as Array<answerItem>,
    );
    const multiSelected = computed<boolean>(() => infoVote.value.multiSelected);
    const IsShowModal = computed(() => channelStore.IsShowModalVote);
    watch(IsShowModal, () => {
      if (IsShowModal.value && infoVote.value && !multiSelected.value) {
        state.voteOptions = votes.value?.[0]?.answer?.id || null;
      }
      if (!IsShowModal.value) {
        resetData();
      }
    });

    const closeModal = () => {
      resetData();
      channelStore.infoVote = null;
      channelStore.IsShowModalVote = false;
      channelStore.ownerPollVote = false;
    };

    const createOption = (index: number) => {
      if (!state.options[index]) return;
      const body = {
        poll_id: infoVote.value.id,
        content: state.options[index],
      };
      emit('createOption', body);
    };

    const addOption = () => {
      state.options.push('');
    };

    const createOptionDone = () => {
      state.options = [];
      if (infoVote.value && !multiSelected.value) {
        state.voteOptions = votes.value?.[0]?.answer?.id || null;
      }
    };

    const votePoll = () => {
      let answerIds = [] as Array<number | string>;
      infoVote.value.answers.forEach((item: answerItem) => {
        if (item.voted) answerIds.push(item.id);
      });
      const body = {
        poll_id: infoVote.value.id,
        answer_ids: multiSelected.value ? answerIds : [state.voteOptions],
      };
      emit('votePoll', body);
    };

    const voteMultipleItem = (item: answerItem) => {
      if (answers.value?.length) {
        item.voted = !item.voted;
        item.votes_count = item.voted ? item.votes_count + 1 : item.votes_count - 1;
      } else {
        item.voted = true;
        item.votes_count = item.votes_count + 1;
        channelStore.infoVote = {
          ...infoVote.value,
          memberCount: infoVote.value.memberCount + 1,
        };
      }
      console.log('infoVote.value', infoVote.value);
    };

    const voteSingleItem = (item: answerItem) => {
      if (state.voteOptions) {
        const answersResult = answers.value.map((itemAnswer: answerItem) => {
          if (itemAnswer.id === state.voteOptions) {
            return {
              ...itemAnswer,
              voted: false,
              votes_count: itemAnswer.votes_count - 1,
            };
          }
          return itemAnswer;
        });
        channelStore.infoVote = {
          ...infoVote.value,
          answers: [...answersResult],
        };
      } else {
        channelStore.infoVote = {
          ...infoVote.value,
          memberCount: infoVote.value.memberCount + 1,
        };
      }

      item.voted = true;
      item.votes_count += 1;
      state.voteOptions = item.id;
    };

    const showModalMemberVote = (item: answerItem) => {
      const params: paramsMemberPoll = {
        page: 1,
        page_size: 9999,
        channel_id: Number(channelStore.detailChanel?.id),
        answer_id: item.id,
      };
      Chat.getListMemberAnswer(params).then((res: any) => {
        if (res?.status_code === 200) {
          const dataResult = res.data.data;
          state.listMember = dataResult.map((item: any) => {
            return {
              value: item.id,
              label: item?.full_name || item?.email || '',
              img: item?.avatar?.url || '',
            };
          });
          state.showModalConfirm = true;
          state.infoModalConfirm = {
            ...state.infoModalConfirm,
            title: `${item.content} (${item.votes_count})`,
          };
        } else {
          NotifyServices.showMessageError(`${res.message}`);
        }
      });
    };
    const workspaceStore = useWorkspaceStore();

    const channelOwned = computed(
      () => channelStore.isOwner,
      // true
    );
    const workspaceRoleAdmin = computed(
      () => workspaceStore.workspaceRoleAdmin,
      // true
    );
    const workspaceRoleOwner = computed(
      () => workspaceStore.workspaceRoleOwner,
      // true
    );
    const permissionAddOptions = computed(
      () =>
        channelOwned.value ||
        workspaceRoleAdmin.value ||
        workspaceRoleOwner.value ||
        channelStore.ownerPollVote ||
        false,
    );

    const showAddOption = computed(() => {
      return (
        !infoVote.value?.closePoll &&
        state.options.length + (infoVote.value?.answers?.length || 0) < 5 &&
        permissionAddOptions.value
      );
    });

    return {
      ...toRefs(state),
      infoVote,
      IsShowModal,
      resetData,
      closeModal,
      mapI18n,
      createOption,
      addOption,
      createOptionDone,
      votePoll,
      voteSingleItem,
      voteMultipleItem,
      showModalMemberVote,
      showAddOption,
    };
  },
});
</script>

<template>
  <CModal
    v-model="IsShowModal"
    classModal="modal-task-channel modal-invite"
    alignFooter="center"
    @close="closeModal"
    :title="infoVote?.closePoll ? mapI18n('closeTitle') : mapI18n('title')"
    :show-footer="!infoVote?.closePoll"
  >
    <div class="modal-invite-body">
      <div class="row q-col-gutter-md">
        <div class="box-title">
          {{ infoVote?.title || '' }}
        </div>
        <div
          v-if="infoVote?.closePoll"
          class="col-12 box-close-poll"
        >
          {{ mapI18n('closeContent') }}
          {{
            `${formatDateDisplay(
              infoVote?.dueDate,
              'MMM DD,YYYY',
            )} at ${formatDateDisplay(infoVote?.dueDate, 'h:mm A')}`
          }}
        </div>
        <div class="box-info-vote col-12">
          <div
            v-for="(item, index) in infoVote?.answers"
            :key="item.id"
            class="box-center mb-1"
          >
            <q-checkbox
              v-if="infoVote?.multiSelected"
              class="q-checkbox-custom"
              color="primary"
              :disable="infoVote?.closePoll"
              :model-value="infoVote.answers[index].voted"
              @update:model-value="voteMultipleItem(item)"
            ></q-checkbox>
            <q-radio
              v-if="!infoVote?.multiSelected"
              color="primary"
              :val="item.id"
              :disable="infoVote?.closePoll"
              :model-value="voteOptions"
              @update:model-value="voteSingleItem(item)"
            />
            <q-linear-progress
              size="50px"
              :value="item.votes_count / infoVote.memberCount || 0"
              rounded
              color="primary-5"
              track-color="white"
              :class="infoVote.answers[index].voted ? 'box-info-vote-active' : ''"
            >
              <div class="absolute-full box-info-vote-item">
                <div class="box-info-vote-content">
                  <span class="">{{ item.content }}</span>
                </div>
                <div class="box-info-vote-count">
                  <span class="">{{ item.votes_count }}</span>
                </div>
              </div>
            </q-linear-progress>
            <div class="icon-action">
              <q-icon
                class="cursor-pointer"
                name="bi-chevron-right"
                size="20px"
                @click="showModalMemberVote(item)"
              ></q-icon>
            </div>
          </div>
          <div
            v-for="(item, index) in options"
            :key="item.id"
            class="box-center mb-1"
          >
            <q-checkbox
              v-if="infoVote?.multiSelected"
              class="q-checkbox-custom"
              color="primary"
              disable
              :val="false"
            ></q-checkbox>
            <q-radio
              v-if="!infoVote?.multiSelected"
              color="primary"
              disable
              :val="null"
            />
            <c-text-field
              class="w-100"
              v-model="options[index]"
              :label="`${mapI18n('labelOption')} ${index + infoVote?.answers.length + 1}`"
              maxlength="120"
              @keydown.enter="createOption(index)"
            >
            </c-text-field>
          </div>
          <div
            class="action-add-options"
            v-if="showAddOption"
          >
            <c-btn
              color="primary"
              size="large"
              flat
              icon="bi-plus-lg"
              :label="mapI18n('addOption')"
              @click="addOption"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        outline
        :label="$t('global.cancel')"
        @click="closeModal"
      />
      <c-btn
        size="large"
        color="primary"
        :label="$t('global.submit')"
        :loading="loading"
        @click="votePoll"
      />
    </template>
  </CModal>
  <c-confirm
    v-model="showModalConfirm"
    :title="infoModalConfirm.title"
    :show-footer="false"
  >
    <div class="chanel-list">
      <q-list>
        <q-item
          v-for="opt in listMember"
          :key="opt.value"
          :clickable="false"
        >
          <q-item-section avatar>
            <CAvatar
              size="32px"
              :avatar="opt?.img"
              :text="opt?.label?.split('')[0] || 'A'"
            ></CAvatar>
          </q-item-section>
          <q-item-section class="text-body-regular text-neutral-1 ellipsis label-opt"
            >{{ opt?.label || '' }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </c-confirm>
</template>

<style scoped lang="scss">
.box-title {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #2f2f2f;
  margin: 0 auto;
  text-align: center;
}

.box-info-vote {
  &-active {
    border: 1px solid #1c8c44 !important;
  }

  &-item {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
  }

  &-content {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #2f2f2f;
    display: flex;
    align-items: center;
    word-break: break-word;
    margin-right: 16px;
  }

  &-count {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #1c8c44;
    display: flex;
    align-items: center;
  }
}

.action-add-options {
  margin-bottom: 16px;
}

.box-center {
  display: flex;
  align-items: center;

  .q-field {
    padding-bottom: 0;
    width: calc(100% - 76px);
  }
}

.q-linear-progress {
  background: white;
  border-radius: 8px;
  border: 1px solid #d3d3d3;
}

.icon-action {
  margin-left: 16px;
}

.box-close-poll {
  margin: 0 auto;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #f44436;
}

.chanel-list {
  height: calc(100vh - 400px);
  overflow-y: scroll;

  .q-item__section--avatar {
    min-width: 32px;
  }

  .q-item {
    padding: 8px 0;
  }

  .label-opt {
  }
}
</style>
