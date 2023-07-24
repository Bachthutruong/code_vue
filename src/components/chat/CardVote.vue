<script lang="ts">
import { computed, defineComponent } from 'vue';
// import { useWorkspaceStore } from 'stores/workspace';
// import { useMainStore } from 'stores/main';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';
import { formChat, TypePollVote } from 'src/interface/chat';
import MenuClickChat from 'components/chat/MenuClickChat.vue';
import MenuHoverChat from 'components/chat/MenuHoverChat.vue';
import { formatDateDisplay } from 'src/helper/global';

export default defineComponent({
  name: 'CardVote',
  components: { MenuHoverChat, MenuClickChat },
  props: {
    infoCardVote: {
      type: Object,
      default() {
        return null;
      },
    },
    showPinChat: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['pin', 'changeVote'],
  setup(props, { emit }) {
    // const workspaceStore = useWorkspaceStore();
    // const mainStore = useMainStore();
    // const infoUser = computed(() => {
    //   return mainStore.getUser;
    // });
    const { t } = useI18n();

    const channelStore = useChannelStore();
    const typeIsOneToOne = computed(() => channelStore.typeIsOneToOne);
    const getRolePermissionChannel = computed(() => {
      return channelStore.getRolePermissionChannel;
    });
    // const channelOwned = computed(() => channelStore.isOwner);
    // const workspaceRoleAdmin = computed(() => workspaceStore.workspaceRoleAdmin);
    // const workspaceRoleOwner = computed(() => workspaceStore.workspaceRoleOwner);

    const permissionPinChat = computed(
      () =>
        typeIsOneToOne.value || !!getRolePermissionChannel.value?.['pinChat'] || false,
    );

    const infoCard = computed<formChat>(() => {
      const dataCard = props.infoCardVote as formChat;
      return dataCard;
    });
    const infoVote = computed(() => {
      return infoCard.value?.pollVote as TypePollVote;
    });
    //
    // const typeChat = computed(() => infoCard.value?.chat?.typeChat);
    const closePoll = computed(() => infoVote.value?.closePoll);
    const pinChat = computed(() => infoCard.value?.pinChat);
    // const user = computed(() => infoCard.value?.user);
    // const readAll = computed(() => infoCard.value?.chat?.readAll);
    const menu = computed(() => {
      return [
        {
          icon: 'bi-pin',
          key: 'pin',
          title: pinChat.value
            ? t('workspace.chat.menuAction.unpin')
            : t('workspace.chat.menuAction.pin'),
          show: permissionPinChat.value,
          action: () => emit('pin'),
        },
      ];
    });

    const changeVote = () => {
      emit('changeVote');
    };

    const labelButton = computed(() => {
      if (closePoll.value) {
        return t('workspace.chat.cardVote.viewVotes');
      } else if (infoVote.value.votes.length === 0) {
        return t('workspace.chat.cardVote.viewOptions');
      } else {
        return t('workspace.chat.cardVote.changeVote');
      }
    });

    return {
      infoCard,
      pinChat,
      menu,
      infoVote,
      closePoll,
      changeVote,
      formatDateDisplay,
      labelButton,
    };
  },
});
</script>

<template>
  <div class="card-vote">
    <div
      :class="{
        'card-vote-pin': pinChat,
        'card-vote-received': infoCard?.chat.typeChat === 'received',
        'card-vote-sent': infoCard?.chat.typeChat === 'sent',
      }"
    >
      <div class="card-vote-body">
        <div
          v-if="showPinChat && pinChat"
          class="box-pin"
        >
          <q-icon name="bi-pin-fill"></q-icon>
          <span class="text-body-regular text-neutral-1">{{
            $t('workspace.chat.pinMessage')
          }}</span>
        </div>
        <q-card>
          <q-card-section>
            <div class="box-info-title">
              <span class="text-h5 text-neutral-1">{{ infoVote.title }}</span>
            </div>

            <div
              v-if="closePoll"
              class="box-close-poll"
            >
              {{ $t('workspace.chat.modalVote.closeContent') }}
              {{
                `${formatDateDisplay(
                  infoVote?.dueDate,
                  'MMM DD,YYYY',
                )} at ${formatDateDisplay(infoVote?.dueDate, 'h:mm A')}`
              }}
            </div>

            <div class="box-info-vote">
              <q-linear-progress
                v-for="item in infoVote.answers"
                :key="item.id"
                size="50px"
                :value="item.votes_count / infoVote.memberCount || 0"
                rounded
                color="primary-5"
                class="mb-1"
                :class="item.voted ? 'box-info-vote' : ''"
                track-color="white"
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
              <div class="bg-white">
                <c-btn
                  color="primary"
                  outline
                  class="full-width"
                  :label="labelButton"
                  @click="changeVote"
                />
              </div>
            </div>
          </q-card-section>
          <MenuClickChat :menu="menu"></MenuClickChat>
          <menu-hover-chat
            class="menu-hover-chat"
            :menu="menu"
          ></menu-hover-chat>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-vote {
  margin: 8px auto 24px;

  .box-pin {
    .q-icon {
      margin-right: 4px;
    }

    margin-bottom: 8px;
  }

  &-body {
    min-width: 560px;

    &:hover {
      .menu-hover-chat {
        opacity: 1;
        visibility: visible;
      }
    }

    .q-card {
      box-shadow: none;
      border-radius: 8px;
    }
  }

  &-normal {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;

    .q-card {
      background: #f1f1f4;
    }
  }

  &-received {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    .q-card {
      background: #f8f8f8;
      border: 1px solid #d3d3d3;
    }
  }

  &-sent {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;

    .q-card {
      background: #eaf5ff;
      border: 1px solid #1e89e5;
    }
  }

  &-pin {
    //.q-card {
    //  background: #fff8e1 !important;
    //  border: 1px solid #ffbc54 !important;
    //}
  }

  .box-info-title {
    text-align: center;
    margin-bottom: 24px;

    .text-h5 {
      font-weight: 500;
    }
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
}

.q-linear-progress {
  background: white;
  border-radius: 8px;
  border: 1px solid #d3d3d3;
}

.menu-hover-chat {
  position: absolute;
  top: 15px;
  right: 24px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-out, visibility 0.1s 0.1s linear;
}

.menu-item {
  padding: 16px 8px;
  background: #ffffff;
  border: 1px solid #e9eae8;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .q-item__section {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
  }

  .q-item:hover {
    color: #1c8c44;
  }

  .q-item {
    min-height: 32px;
    padding: 0;
    //min-width: 216px;
    span {
      white-space: nowrap;
    }
  }

  .q-icon {
    width: 36px;
    height: 36px;
  }
}

.mb-1 {
  margin-bottom: 16px;
}

.box-close-poll {
  //margin: 0 auto;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #f44436;
  margin-bottom: 24px;
}
</style>
