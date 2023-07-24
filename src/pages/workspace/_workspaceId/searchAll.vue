<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import HeaderUnreadTask from 'components/unread/HeaderUnreadTask.vue';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { paramSearch, paramSearchCount } from 'src/services/search/model';
import SearchService from 'src/services/search';
import CardChannel from 'components/common/CardChannel.vue';
import CardChat from 'components/chat/CardChat.vue';
import cardChannelFilter from 'components/workspace/cardChannelFilter.vue';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import { formChat, reply } from 'src/interface/chat';
import {
  capitalizeFirstLetter,
  checkDue,
  checkFileType,
  convertArrayToString,
  downloadFileUrl,
  formatDateDisplay,
  showCheckDue,
} from 'src/helper/global';
import NotifyServices from 'src/plugins/NotifyServices';
import { useWorkspaceStore } from 'stores/workspace';
import FileItem from 'components/general/FileItem.vue';
import { IFileItem } from 'src/model/ModelFile';
import { useQuasar } from 'quasar';
import PaginationWorkSpace from 'components/general/PaginationWorkSpace.vue';
import { wsRouter } from 'src/constants/ConstantNotify';
import { filename } from 'src/constants/ConstantFile';
import { sortByCreateTime } from 'src/helper/global';

interface countTaskType {
  task: number;
  files: number;
  channel: number;
  one_to_one: number;
}

export default defineComponent({
  name: 'searchAll',
  components: {
    PaginationWorkSpace,
    FileItem,
    CardChannel,
    CardChat,
    HeaderUnreadTask,
    cardChannelFilter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const workspaceStore = useWorkspaceStore();
    const $q = useQuasar();

    const state = reactive<{
      tabList: Array<{ label: string; value: string; key: string }>;
      filter: paramSearch;
      listTask: Array<formChannel>;
      listFile: Array<IFileItem>;
      listOneToOne: Array<any>;
      listChannel: Array<any>;
      listChat: Array<formChat>;
      listWiki: Array<formChannel>;
      taskStatus: any;
      loading: boolean;
      total: number;
      totalPage: number;
      countTask: countTaskType;
    }>({
      filter: {
        page: 1,
        page_size: 12,
        workspace_id: Number(route?.params?.workspaceId),
        keyword: '',
        tab: 'TASK',
      },
      tabList: [
        { label: t('workspace.search.title.chat'), value: 'CHAT', key: 'chat' },
        { label: t('workspace.search.title.task'), value: 'TASK', key: 'task' },
        { label: t('workspace.search.title.wiki'), value: 'WIKI', key: 'wiki' },

        { label: t('workspace.search.title.files'), value: 'FILES', key: 'files' },
        { label: t('workspace.search.title.channel'), value: 'CHANNEL', key: 'channel' },
        {
          label: t('workspace.search.title.oneToOne'),
          value: 'ONE_TO_ONE',
          key: 'one_to_one',
        },
      ],
      listChat: [],
      listTask: [],
      listWiki: [],
      listFile: [],
      listOneToOne: [],
      listChannel: [],
      taskStatus: TaskStatusType,
      loading: false,
      total: 0,
      totalPage: 0,
      countTask: {
        task: 0,
        files: 0,
        channel: 0,
        one_to_one: 0,
      },
    });

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        state.filter = {
          ...state.filter,
          ...route?.query,
        };
        if (!state.filter.keyword) return;

        searchAll();
      }
    });

    // watch(route, () => {
    //   if (route.value > 0) {
    //     searchAll();
    //   }
    // });
    const getListReact = (item: formChat) => {
      if (!item?.reactions) return [];
      let objectEmoji = {} as any;
      const reactions = item?.reactions as any;
      reactions.forEach((item: any) => {
        if (!objectEmoji[item.emoji]) {
          objectEmoji[item.emoji] = {
            emoji: item.emoji,
            listUser: [item.user],
          };
        } else {
          objectEmoji[item.emoji] = {
            ...objectEmoji[item.emoji],
            listUser: [...objectEmoji[item.emoji].listUser, item.user],
          };
        }
        objectEmoji[item.emoji] = {
          ...objectEmoji[item.emoji],
          active:
            objectEmoji[item.emoji]?.active || item?.user?.id === infoUser?.value?.id,
          created_at: item.created_at,
        };
      });
      const arrayResult = Object.values(objectEmoji);
      return sortByCreateTime(arrayResult) || [];
    };

    const refactorItemTask = (item: any) => {
      const status = item.status?.[0]?.type || 'INDUE';
      const statusSent = item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
      let dataTask: formChannel = {
        // ...item,
        id: item.id,
        statusBackground:
          status === 'CANCEL' ? state.taskStatus[status] : state.taskStatus[statusSent],
        statusTask: status,
        radio: '',
        date: {
          status: status === 'DRAFT' ? 'draft' : statusSent,
          time: item.released_at || '',
        },
        content: item.content || '',
        due: {
          status: checkDue(item.due_at, 'minutes') > 0 ? 'due' : 'overdue',
          date: showCheckDue(item.due_at),
        },
        creator: {
          email: item?.creator?.email || '',
          full_name: item?.creator?.full_name || '',
          avatar: item?.creator?.avatar?.url || '',
          name: item.creator.full_name || item.creator.email || '',
        },
        priority: capitalizeFirstLetter(item.priority),
        attachment: convertArrayToString(item.attachments, 'originalname'),
        markDone: item.mark_done_count || 0,
        comment: item.comment_count || 0,
        flag: item.flags?.[0]?.is_flag || false,
        reads: item.read_count === item.member_count || false,
        updated: item?.status?.[0]?.updated_at,
        due_time: item?.due_at,
        is_read: item?.reads?.[0]?.is_read || false,
        is_mute: item?.mute_comments?.[0]?.is_mute || false,
        can_mark: item?.can_mark || false,
        type: item.type || '',
        other: item,
        channel: item.channel,
        can_access: item?.can_access || false,
        attachments: item?.attachments?.length || '',
      };

      if (status === 'DONE') {
        dataTask.doneTask = true;
      }
      dataTask.warning = dataTask?.due?.status === 'overdue';
      return dataTask;
    };
    const refactorItemChat = (item: any) => {
      const user = item?.sender;
      const typeChat = user?.id === infoUser?.value?.id ? 'sent' : 'received';
      let dataTask: formChat = {
        id: item.id,
        user: {
          id: user?.id,
          name: user?.full_name || user?.email,
          avatar: user?.avatar?.url || '',
        },
        chat: {
          typeChat: typeChat,
          statusChat: 'normal',
          time: item?.sent_at || '',
          text: item?.content || '',
          readAll: item?.read_count === item?.member_count,
        },
        files: item.attachments || undefined,
        pinChat: item?.is_pin || false,
        readChat: item?.reads?.[0]?.is_read || false,
        editChat: !!item?.edit_at || undefined,
        deleteChat: {
          isDeleted: !!item?.hide_at,
          user: {
            id: item?.hider?.id,
            name: item?.hider?.full_name || item?.hider?.email || '',
            avatar: '',
          },
          time: item?.hide_at || '',
        },
        other: item,
        type: item.is_poll ? 'pollVote' : 'message',
        isPoll: !!item.is_poll,
        reactions: item?.reactions || undefined,
      };
      dataTask.reactions = getListReact(dataTask);

      if (dataTask.editChat) {
        dataTask.editor = {
          id: item.editor.id,
          name: item.editor?.full_name || item.editor?.email || '',
        };
      }
      if (item?.parent?.id) {
        const parent = item?.parent;
        const parentUser = item?.parent?.sender;
        const replyItem: reply = {
          id: parent.id,
          files: parent.attachments,
          user: {
            id: parentUser?.id,
            name: parentUser?.full_name || parentUser?.email,
            avatar: parentUser?.avatar?.url || '',
          },
          text: parent.content,
          other: parent,
        };
        dataTask.reply = replyItem;
        dataTask.chat.statusChat = 'reply';
      }
      if (item?.forward_from?.id) {
        const parent = item?.forward_from;
        const parentUser = parent?.sender;
        const replyItem: reply = {
          id: parent.id,
          files: parent.attachments,
          user: {
            id: parentUser?.id,
            name: parentUser?.full_name || parentUser?.email,
            avatar: parentUser?.avatar?.url || '',
          },
          text: parent.content,
          other: parent,
        };
        dataTask.reply = replyItem;
        dataTask.chat.statusChat = 'forward';
      }
      dataTask.menu = [];
      return dataTask;
    };
    const refactorItemWiki = (item: any) => {
      const status = item?.type;
      const statusSent = item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
      let dataTask: formChannel = {
        // ...item,
        id: item.id,
        statusBackground: state.taskStatus[statusSent],
        statusTask: status,
        radio: '',
        date: {
          status: statusSent,
          time: item.released_at || '',
        },
        content: item.topic || '',
        due: {
          status: 'due',
          date: '',
        },
        creator: {
          email: item?.creator?.email || '',
          full_name: item?.creator?.full_name || '',
          avatar: item?.creator?.avatar?.url || '',
          name: item.creator?.full_name || item.creator?.email || '',
        },
        priority: '',
        attachment: convertArrayToString(item.attachments, 'originalname'),
        markDone: 0,
        comment: item?.comment_count || 0,
        flag: item.flags?.[0]?.is_flag || false,
        reads: item.read_count === item.member_count || false,
        updated: item?.status?.[0]?.updated_at,
        due_time: item?.due_at,
        is_read: item?.reads?.[0]?.is_read || false,
        is_mute: false,
        can_mark: false,
        type: item.type || '',
        other: item,
        channel: item.channel,
        can_access: true,
        attachments: item?.attachments?.length || '',
      };

      if (status === 'DONE') {
        dataTask.doneTask = true;
      }
      dataTask.warning = dataTask?.due?.status === 'overdue';
      return dataTask;
    };
    const refactorTask = (data: any) => {
      state.listTask = data.map((item: any) => {
        return refactorItemTask(item);
      });
    };
    const refactorChat = (data: any) => {
      state.listChat = data.map((item: any) => {
        return refactorItemChat(item);
      });
    };
    const refactorWiki = (data: any) => {
      state.listWiki = data.map((item: any) => {
        return refactorItemWiki(item);
      });
    };
    const searchAll = () => {
      mainStore.loadingPage = true;
      state.loading = true;
      const paramsBody: paramSearch = {
        ...state.filter,
        page: 1,
        page_size: state.filter?.page_size || 12,
        workspace_id: Number(route?.params?.workspaceId),
      };
      // if (!state.filter.keyword) return false
      searchAllCount();
      return new Promise((resolve, reject) => {
        SearchService.searchAll(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data.data;
              if (state.filter.tab === 'TASK') {
                refactorTask(responsive);
              }
              if (state.filter.tab === 'CHAT') {
                refactorChat(responsive);
              }
              if (state.filter.tab === 'WIKI') {
                refactorWiki(responsive);
              }
              if (state.filter.tab === 'FILES') {
                state.listFile = responsive.map((file: any) => {
                  return {
                    ...file,
                    name: file?.originalname || '',
                    fileType: fileType(file),
                  };
                });
              }
              if (state.filter.tab === 'ONE_TO_ONE') {
                state.listOneToOne = [...responsive];
              }
              if (state.filter.tab === 'CHANNEL') {
                state.listChannel = [...responsive];
              }
              state.total = res?.data.total;
              state.totalPage = res?.data.total_page;
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
              reject(false);
            }
          })
          .catch((err) => {
            reject(false);
            NotifyServices.showMessageError(`${err.message}`);
          })
          .finally(() => {
            state.loading = false;
            mainStore.loadingPage = false;
          });
      });
    };
    const searchAllCount = () => {
      mainStore.loadingPage = true;
      state.loading = true;
      const paramsBody: paramSearchCount = {
        keyword: state.filter.keyword || '',
        workspace_id: Number(route?.params?.workspaceId),
      };
      return new Promise((resolve, reject) => {
        SearchService.searchAllCount(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.countTask = {
                ...responsive,
              };
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
              reject(false);
            }
          })
          .catch((err) => {
            reject(false);
            NotifyServices.showMessageError(`${err.message}`);
          })
          .finally(() => {
            mainStore.loadingPage = false;
            state.loading = false;
          });
      });
    };
    const scrollTargetRef = ref();
    const changeTab = () => {
      state.filter = {
        ...state.filter,
        page_size: 12,
      };
      router.replace({
        ...route,
        query: {
          ...state.filter,
        },
      });
      if (!state.filter.keyword) return;
      searchAll();
    };
    onMounted(() => {
      state.filter = {
        ...state.filter,
        ...route?.query,
      };
      if (!state.filter.keyword) return;
      searchAll();
    });
    const onLoad = async (index: number, done: any) => {
      const maxSize = checkStatus.value.maxSize;
      if (state.loading || maxSize) {
        done();
        return;
      }
      state.loading = true;
      state.filter = {
        ...state.filter,
        page_size: Number(state.filter?.page_size) + 6,
      };
      console.log('state.filter', state.filter);
      if (!state.filter.keyword) {
        done();
        return;
      }

      await searchAll()
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          done();
        });
    };
    const drawerRightProfile = computed(() => {
      return workspaceStore?.drawerRightProfile;
    });
    const formatDate = (dateTime: any) => {
      return formatDateDisplay(dateTime, 'D/MM/YYYY');
    };
    const checkStatus = computed(() => {
      let maxSize = false;
      let noData = false;
      if (state.filter.tab === 'CHAT') {
        maxSize = state.total === state.listChat.length;
        noData = !state?.listChat.length;
      }
      if (state.filter.tab === 'TASK') {
        maxSize = state.total === state.listTask.length;
        noData = !state?.listTask.length;
      }
      if (state.filter.tab === 'WIKI') {
        maxSize = state.total === state.listWiki.length;
        noData = !state?.listWiki.length;
      }
      if (state.filter.tab === 'FILES') {
        maxSize = state.total === state.listFile.length;
        noData = !state?.listFile.length;
      }
      if (state.filter.tab === 'CHANNEL') {
        maxSize = state.total === state.listChannel.length;
        noData = !state?.listChannel.length;
      }
      if (state.filter.tab === 'ONE_TO_ONE') {
        // maxSize = state.total === state.listOneToOne.length
        noData = !state?.listOneToOne.length;
      }
      return {
        maxSize,
        noData,
      };
    });
    const redirectUrl = (payload: any) => {
      const url = location.origin;
      if (!payload) return url;
      const type = state.filter.tab;
      const channelType = payload?.channel?.type;
      const workspaceId = route?.params?.workspaceId;
      let path = workspaceId ? `${wsRouter}/${workspaceId}` : '';
      let query = '?';
      if (type === 'CHANNEL') {
        path = `${path}/C${payload.id}`;
      }
      if (type === 'ONE_TO_ONE') {
        path = `${path}/D${payload.id}`;
      }

      if (type === 'TASK') {
        if (['GENERAL', 'MANUAL'].includes(channelType)) {
          path = `${path}/C${payload?.channel?.id}/task`;
        }
        if (['ONE_TO_ONE'].includes(channelType)) {
          path = `${path}/D${payload?.channel?.id}/task`;
        }
        query = `${query}taskId=${payload?.id}`;
      }

      if (type === 'WIKI') {
        if (['GENERAL', 'MANUAL'].includes(channelType)) {
          path = `${path}/C${payload?.channel?.id}/wiki`;
        }
        if (['ONE_TO_ONE'].includes(channelType)) {
          path = `${path}/D${payload?.channel?.id}/wiki`;
        }
        query = `${query}WikiId=${payload?.id}`;
      }

      if (type === 'CHAT') {
        const channelChatType = payload?.other?.channel?.type;
        if (['GENERAL', 'MANUAL'].includes(channelChatType)) {
          path = `${path}/C${payload?.other?.channel?.id}/chat`;
        }
        if (['ONE_TO_ONE'].includes(channelChatType)) {
          path = `${path}/D${payload?.other?.channel?.id}/chat`;
        }
        query = `${query}chatId=${payload?.id}`;
      }
      return `${url}/${path}${query}`;
    };
    const clickToItem = (item: any) => {
      window && window.open(redirectUrl(item), '_blank');
    };
    const fileType = (item: any) => {
      const _file = checkFileType(item);
      return filename[_file.type];
      //   img: _file.image,
      // };
    };
    const showModalImg = (item: any) => {
      if (item.fileType === 'Image') {
        workspaceStore.setListViewFile([item]);
      } else {
        downloadFile(item);
      }
    };

    const downloadFile = (item: any) => {
      downloadFileUrl(item);
    };

    return {
      ...toRefs(state),
      scrollTargetRef,
      infoUser,
      changeTab,
      onLoad,
      drawerRightProfile,
      formatDate,
      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
          : null;
      }),
      checkStatus,
      searchAll,
      clickToItem,
      showModalImg,
    };
  },
});
</script>

<template>
  <div class="h-100">
    <HeaderUnreadTask :hasMark="false">
      <template #title>
        {{ $t('workspace.search.title.header') }} "{{ filter.keyword }}"
      </template>
    </HeaderUnreadTask>
    <div class="body-task">
      <div class="tab-list">
        <q-tabs
          v-model="filter.tab"
          @update:model-value="changeTab"
          dense
          indicator-color="primary"
          align="left"
          narrow-indicator
          class="q-tabs__custom"
        >
          <q-tab
            v-for="item in tabList"
            no-caps
            :key="item.value"
            :name="item.value"
          >
            <div class="box-item">
              <span class="box-item-text">{{ item.label }}</span>
              <q-badge
                v-if="countTask?.[item.key]"
                class="badge-total"
                rounded
                :color="filter.tab === item.value ? 'primary' : 'neutral-5'"
              >
                <span>{{ countTask?.[item.key] || 0 }}</span>
              </q-badge>
            </div>
          </q-tab>
        </q-tabs>
      </div>

      <div
        id="dataTask"
        class="data-task"
        :class="checkStatus?.noData ? 'table-no-data' : ''"
        ref="scrollTargetRef"
      >
        <template v-if="!loading && checkStatus?.noData">
          <div class="no-data">
            <img
              src="~assets/default/no_results_found.svg"
              alt="no_results_found"
            />
            <p class="no-data-title">No results found.</p>
            <p class="no-data-desc">Please try again with other keyword.</p>
          </div>
        </template>
        <template v-if="filter.tab === 'ONE_TO_ONE'">
          <div
            class="q-table__container q-table--horizontal-separator column no-wrap q-table--grid q-table--no-wrap"
            :class="checkStatus?.noData ? 'table-no-data' : ''"
          >
            <div
              :class="cardContainerClass"
              class="q-table__grid-content row"
            >
              <div
                v-for="(item, index) in listOneToOne"
                :key="index"
                class="table-people q-pa-xs col-xs-12 col-sm-6 col-md-4"
                :class="drawerRightProfile ? 'col-md-6' : 'col-md-4'"
                @click="clickToItem(item)"
              >
                <q-card class="row items-center cursor-pointer">
                  <div class="table-people__img flex">
                    <CAvatar
                      size="72px"
                      :avatar="item?.members[0].avatar?.url"
                      :text="item?.name.split('')[0] || ''"
                    />
                  </div>
                  <q-card-section>
                    <div class="table-people__name ellipsis">
                      <span
                        v-highlight="filter.keyword"
                        v-html="item?.name"
                      ></span>
                    </div>
                    <div class="table-people__job ellipsis">
                      <i class="bi bi-briefcase"></i>
                      {{ item?.members[0]?.position || '' }}
                    </div>
                    <div class="table-people__email ellipsis">
                      <i class="bi bi-envelope"></i>
                      {{ item?.members[0]?.email || '' }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
          <PaginationWorkSpace
            v-model="filter.page"
            :max="totalPage"
            @update:model-value="searchAll()"
          />
        </template>

        <q-infinite-scroll
          v-else
          @load="onLoad"
          :offset="120"
          :scroll-target="scrollTargetRef"
        >
          <template v-if="filter.tab === 'CHAT'">
            <CardChat
              v-for="(cardItem, index) in listChat"
              :key="index"
              highlight-search
              :info-card-chat="cardItem"
              :show-pin-chat="false"
              class="chat-search"
              @click="clickToItem(cardItem)"
            >
            </CardChat>
          </template>
          <template v-if="filter.tab === 'TASK'">
            <CardChannel
              v-for="(cardItem, index) in listTask"
              :key="index"
              :id="`task#${index}`"
              :formChannelInfo="cardItem"
              hidden-menu
              highlight-search
              @click="clickToItem(cardItem)"
            >
              <template #card-top>
                <div class="title-top flex items-center">
                  <p class="text-body q-mb-none">
                    {{
                      cardItem?.channel?.type === 'ONE_TO_ONE' ? 'One to one' : 'Channel'
                    }}:
                  </p>
                  <span
                    >{{ cardItem?.channel?.type === 'ONE_TO_ONE' ? '' : '#' }}
                    {{ cardItem?.channel?.name }}</span
                  >
                </div>
              </template>
              <template #left-radio>
                <q-checkbox
                  v-if="cardItem.statusTask !== 'CANCEL'"
                  checked-icon="bi-check-circle-fill"
                  unchecked-icon="bi-circle"
                  :model-value="cardItem.statusTask === 'DONE'"
                  class="mark-done-check-box"
                  :class="!cardItem.can_mark ? 'none-checkbox' : ''"
                  @click="markDoneTask(cardItem, index)"
                />
                <q-checkbox
                  v-if="cardItem.statusTask === 'CANCEL'"
                  checked-icon="bi-x-circle-fill"
                  :model-value="cardItem.statusTask === 'CANCEL'"
                  class="mark-done-check-box"
                  :class="!cardItem.can_mark ? 'none-checkbox' : ''"
                  @click="cancelTask(cardItem, index)"
                />
                <q-tooltip
                  v-if="!cardItem.is_read"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                  max-width="210px"
                  max-height="100px"
                  class="tool-tip bg-green-1"
                >
                  <h1>Unread task, you can’t mark done now</h1>
                </q-tooltip>
                <p
                  v-if="
                    cardItem?.statusTask === 'DONE' || cardItem?.statusTask === 'CANCEL'
                  "
                  class="day-date"
                  :class="!cardItem.can_mark ? 'none-checkbox' : ''"
                >
                  {{ formatDate(cardItem?.updated || '') }}
                </p>
              </template>
            </CardChannel>
          </template>
          <template v-if="filter.tab === 'WIKI'">
            <CardChannel
              v-for="(cardItem, index) in listWiki"
              :key="index"
              :id="`task#${index}`"
              :formChannelInfo="cardItem"
              hidden-menu
              highlight-search
              @click="clickToItem(cardItem)"
            >
            </CardChannel>
          </template>
          <template v-if="filter.tab === 'CHANNEL'">
            <cardChannelFilter
              v-for="(cardItem, index) in listChannel"
              :key="index"
              :id="`task#${index}`"
              :card-item="cardItem"
              highlightSearch
              @click="clickToItem(cardItem)"
            >
            </cardChannelFilter>
          </template>
          <template v-if="filter.tab === 'FILES'">
            <div
              v-for="item in listFile"
              :key="item.id"
              class="card-file cursor-pointer"
              @click="showModalImg(item)"
            >
              <file-item
                :file-data="item"
                highlightSearch
              />
            </div>
          </template>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
//.data-task {
//  height: calc(100vh - 250px);
//  max-height: calc(100vh - 250px);
//  margin-top: 32px;
//  overflow: auto;
//}

.body-task {
  //padding-top: 32px;
}

#dataTask {
  padding-top: 16px;
  height: 100%;
  max-height: 100%;
  overflow-anchor: none;
  margin-top: auto;
  display: flex;
  flex-direction: column;

  .q-infinite-scroll {
    width: 100%;
    overflow-anchor: auto;
  }
}

.tab-list {
  margin: 16px 16px 0 16px;
}

.card-file {
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  height: 58px;
  padding: 0 8px;
  margin: 0 32px 24px 32px;

  &:hover {
    border: 1px solid #1c8c44;
  }
}

.q-tab--inactive {
  opacity: 1;
}

.box-item {
  display: flex;

  .bg-primary {
    span {
      color: white;
    }
  }

  &-text {
    margin-right: 4px;

    span {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #878b87;
    }
  }

  span {
    color: #565656;
  }
}

// ono to one
.grid {
  flex-direction: column;

  .grid--2 > div:nth-child(2n + 1) {
    order: 1;
  }

  .grid--2 > div:nth-child(2n) {
    order: 2;
  }

  .grid--2:before {
    content: '';
    flex: 1 0 100% !important;
    width: 0 !important;
    order: 1;
  }

  .grid--3 > div:nth-child(3n + 1) {
    order: 1;
  }

  .grid--3 > div:nth-child(3n + 2) {
    order: 2;
  }

  .grid--3 > div:nth-child(3n) {
    order: 3;
  }

  .grid--3:before,
  .grid--3:after {
    content: '';
    flex: 1 0 100% !important;
    width: 0 !important;
    order: 2;
  }
}

.table-people {
  padding: 8px 16px;
  width: 320px;
  cursor: pointer;

  .q-card {
    box-shadow: none;
    border: 1px solid #e9eae8;
    border-radius: 8px;
  }

  .table-people__img {
    padding: 8px 16px;

    img {
      width: 72px;
      height: 72px;
    }
  }

  .q-card__section {
    padding: 0;
    width: calc(100% - 120px);

    .table-people__name {
      font-size: 16px;
      font-weight: 550;
      color: #2f2f2f;
    }

    .table-people__job {
      margin: 4px 0;
    }

    .table-people__job,
    .table-people__email {
      font-size: 14px;
      font-weight: 400;
      color: #878b87;

      i {
        margin-right: 4px;
      }
    }
  }
}

.table-no-data {
  height: calc(100vh - 260px);

  .q-table__bottom--nodata {
    height: 100%;
  }

  .no-data {
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
    text-align: center;

    img {
      margin-bottom: 16px;
    }

    &-title {
      font-weight: 500;
      margin-bottom: 0;
    }

    &-desc {
      margin-bottom: 0;
    }
  }
}

.title-top {
  margin-bottom: 5px;
  font-weight: 500;

  span {
    color: #1c8c44;
    margin-left: 5px;
  }
}

.badge-total {
  min-width: 23px;
  min-height: 16px;
  //border-radius: 6px;
  //padding: 0px 8px;
}

.mark-done-check-box {
  padding-bottom: 10px;
  padding-left: 15px;
}

.tool-tip {
  background: #e7f6e9 !important;

  h1 {
    font-size: 16px;
    line-height: 24px;
    color: #2f2f2f;
    font-weight: 400;
    margin-left: 16px;
  }
}

.chat-search {
  padding: 0 32px;
}
</style>
