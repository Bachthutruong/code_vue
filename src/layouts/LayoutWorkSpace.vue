<template>
  <q-layout view="lHr LpR lfr">
    <q-header
      bordered
      class="bg-white header-ws"
    >
      <q-toolbar class="top-bar">
        <div class="justify-between items-center full-width row">
          <div
            class="top-search col-9"
            v-click-outside="hiddenMenu"
          >
            <c-text-field
              :placeholder="$t('workspace.search.search')"
              prepend-icon="bi-search"
              v-model="search"
              @focus="focusSearch"
              @keyup="keyupSearch"
            >
              <template #append>
                <span
                  v-if="search"
                  class="text-body-regular cursor-pointer"
                  @click="search = ''"
                  >{{ $t('global.clear') }}</span
                >
              </template>
            </c-text-field>
            <div
              v-if="showMenu && listSearchAllRecent.length"
              class="menu-recent-search"
            >
              <q-list>
                <div class="menu-recent-search-title">
                  <span>{{ $t('workspace.search.recent.search') }}</span>
                </div>
                <q-item
                  clickable
                  v-for="(itemSearch, index) in listSearchAllRecent"
                  :key="index"
                >
                  <!--                 -->
                  <q-item-section @click="selectSearch(itemSearch)">
                    <q-icon
                      name="bi-clock"
                      size="16px"
                    ></q-icon>
                    <span>{{ itemSearch.keyword }}</span>
                  </q-item-section>
                  <q-item-section
                    side
                    @click="removeRecentSearch(itemSearch)"
                  >
                    <q-icon
                      name="bi-x"
                      size="16px"
                    ></q-icon>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-space />
          <div class="col-1 top-avatar">
            <CAvatar
              size="56px"
              @click="showDrawerRightProfile"
              :avatar="infoUser?.avatar?.url"
              :text="
                infoUser?.full_name?.split('')[0] || infoUser?.email?.split('')[0] || ''
              "
            >
            </CAvatar>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      class="menu-bar"
      behavior="desktop"
      :width="352"
    >
      <div class="item-left-bar">
        <q-item>
          <q-item-section>
            <q-item-label class="item-left-bar-name">
              <span class="text-truncate">{{ detailWorkspace?.name || '' }} </span>
              <q-icon
                name="bi-caret-down-fill"
                size="16px"
              ></q-icon>
            </q-item-label>
            <menuInfoWorkspace />
          </q-item-section>
          <q-item-section side>
            <c-btn
              color="primary"
              round
              @click="addTask"
            >
              <template #default>
                <q-icon
                  size="40px"
                  name="bi-plus"
                  class="icon-plus"
                />
              </template>
            </c-btn>
          </q-item-section>
        </q-item>
      </div>

      <q-scroll-area class="fit">
        <q-list>
          <tab-header-channel @changeTab="changeTab" />
          <q-separator
            class="hr-bottom-tab"
            v-if="hiddenDraft"
          />
          <template
            v-for="(menuItem, index) in menu"
            :key="index"
          >
            <q-item
              v-if="menuItem?.dynamicRouter"
              class="q-item--dynamic"
            >
              <q-item-section>
                <q-expansion-item
                  :default-opened="true"
                  expand-separator
                  expand-icon-class="expandIcon"
                  :id="`page-${menuItem.type}`"
                >
                  <template #header="{ expanded }">
                    <q-item-section avatar>
                      <q-icon
                        size="16px"
                        :name="`bi-${menuItem.icon}`"
                      />
                    </q-item-section>
                    <q-item-section>
                      <div>
                        {{ $t(`workspace.channel.sidebar.${menuItem.type}`) }}
                        <q-icon
                          v-if="menuItem.children?.length"
                          size="16px"
                          :name="expanded ? 'bi-caret-down-fill' : 'bi-caret-up-fill'"
                          class="down-fill"
                        />
                      </div>
                    </q-item-section>
                  </template>
                  <q-item
                    v-if="menuItem.children?.length"
                    clickable
                    :active="
                      menuItem?.children?.[0]?.id ===
                      Number($route.params[menuItem.params])
                    "
                    :id="`page-${menuItem.type}-${menuItem?.children?.[0]?.id}`"
                    active-class="active-item"
                    v-ripple
                    :class="listDragAction.includes(menuItem.type) ? 'handle' : ''"
                    @click="gotoRouterDynamic(menuItem, menuItem?.children?.[0])"
                  >
                    <q-item-section
                      avatar
                      v-if="menuItem.type !== 'oneToOne'"
                    >
                      <span class="icon-children">#</span>
                    </q-item-section>
                    <q-item-section
                      :class="{
                        'pl-12': menuItem.type == 'oneToOne',
                      }"
                    >
                      <span class="ellipsis">{{ menuItem?.children?.[0]?.name }}</span>
                    </q-item-section>

                    <q-item-section side>
                      <div>
                        <q-icon
                          v-if="menuItem?.children?.[0]?.is_mute"
                          size="20px"
                          name="bi-bell-slash"
                        />
                        <q-badge
                          v-if="menuItem?.children?.[0]?.totalUnread"
                          class="badge-total badge-total-children q-ml-sm"
                          rounded
                          color="negative"
                        >
                          <span>{{
                            maxCount(menuItem?.children?.[0]?.totalUnread)
                          }}</span>
                        </q-badge>
                      </div>
                    </q-item-section>
                    <MenuClick
                      v-if="menuAction(menuItem.type, menuItem?.children?.[0])?.length"
                      :menu="menuAction(menuItem.type, menuItem?.children?.[0])"
                    />
                  </q-item>
                  <draggable
                    v-if="menuItem.children?.length"
                    :list="menuItem.children"
                    :key="renderListChannel"
                    item-key="id"
                    group="items"
                    handle=".handle"
                    @end="setNewIndex(menuItem.children)"
                  >
                    <template #item="{ element, index }">
                      <q-item
                        v-if="index > 0"
                        clickable
                        :active="element.id === Number($route.params[menuItem.params])"
                        :id="`page-${menuItem.type}-${element.id}`"
                        active-class="active-item"
                        v-ripple
                        :class="listDragAction.includes(menuItem.type) ? 'handle' : ''"
                        @click="gotoRouterDynamic(menuItem, element)"
                      >
                        <q-item-section
                          avatar
                          v-if="menuItem.type !== 'oneToOne'"
                        >
                          <span class="icon-children">#</span>
                        </q-item-section>
                        <q-item-section
                          class="no-wrap"
                          :class="{
                            'pl-12': menuItem.type == 'oneToOne',
                          }"
                        >
                          <span class="ellipsis">{{ element.name }}</span>
                        </q-item-section>

                        <q-item-section side>
                          <div>
                            <q-icon
                              v-if="element?.is_mute"
                              size="20px"
                              name="bi-bell-slash"
                            />
                            <q-badge
                              v-if="element?.totalUnread"
                              class="badge-total badge-total-children q-ml-sm"
                              rounded
                              color="negative"
                            >
                              <span>{{ maxCount(element?.totalUnread) }}</span>
                            </q-badge>
                          </div>
                        </q-item-section>
                        <MenuClick
                          v-if="
                            menuAction(menuItem.type, element)?.length &&
                            !listDragAction.includes(menuItem.type)
                          "
                          :menu="menuAction(menuItem.type, element)"
                        />
                      </q-item>
                    </template>
                  </draggable>
                </q-expansion-item>
              </q-item-section>
              <div class="btn-add">
                <q-icon
                  v-if="menuItem.children?.length"
                  size="24px"
                  name="bi-list"
                  class="btn-list"
                  :color="
                    listDragAction.includes(menuItem.type) ? 'error-1' : 'neutral-3'
                  "
                  @click="handleDragItem(menuItem.type)"
                />
                <c-btn
                  :disable="!menuItem.children?.length"
                  color="white"
                  class="custom-button-small"
                  round
                  size="small"
                  @click="actionMenu(menuItem.name)"
                >
                  <template #default>
                    <q-icon
                      size="24px"
                      name="bi-plus"
                      color="primary"
                    />
                  </template>
                </c-btn>
              </div>
            </q-item>
            <q-item
              v-if="!menuItem?.dynamicRouter && menuItem.type !== 'calendar'"
              clickable
              :active="activeSingleItem(menuItem)"
              :id="`page-${menuItem.type}`"
              class="q-item-single"
              active-class="active-item"
              v-ripple
              @click="gotoRouterSingle(menuItem)"
            >
              <q-item-section avatar>
                <q-icon
                  size="16px"
                  :name="`bi-${menuItem.icon}`"
                />
              </q-item-section>
              <q-item-section>
                {{ $t(`workspace.channel.sidebar.${menuItem.type}`) }}
              </q-item-section>
              <q-item-section
                v-if="showCountSingleRoute(menuItem) > 0"
                side
              >
                <q-badge
                  class="badge-total"
                  rounded
                  color="negative"
                >
                  <span>{{ showCountSingleRoute(menuItem) }}</span>
                </q-badge>
              </q-item-section>
            </q-item>
            <template v-if="menuItem.type === 'calendar'">
              <q-item
                clickable
                :active="$route.name === 'calendar-view' && !$route?.query?.status"
                :id="`page-${menuItem.type}`"
                class="q-item-single q-item-calender--title"
                active-class="active-item"
                v-ripple
                @click="gotoCalendarView()"
              >
                <q-item-section avatar>
                  <q-icon
                    size="16px"
                    :name="`bi-${menuItem.icon}`"
                  />
                </q-item-section>
                <q-item-section>
                  {{ $t(`workspace.channel.sidebar.${menuItem.name}`) }}
                </q-item-section>
              </q-item>
              <q-item
                v-for="(itemCalendar, indexCalendar) in menuCalendar"
                :key="indexCalendar"
                clickable
                :active="itemCalendar.active"
                :id="`page-${menuItem.type}-${itemCalendar.type}`"
                class="q-item-single q-item-calender--menu"
                active-class="active-item"
                v-ripple
                @click="gotoCalendarList(itemCalendar)"
              >
                <q-item-section avatar>
                  <span class="icon-children">#</span>
                </q-item-section>
                <q-item-section>
                  {{ $t(`workspace.channel.sidebar.${itemCalendar.type}`) }}
                </q-item-section>
                <q-item-section side>
                  <q-badge
                    class="badge-total badge-total-children"
                    rounded
                    :color="itemCalendar.color"
                  >
                    <span>{{ maxCount(itemCalendar?.total) }}</span>
                  </q-badge>
                </q-item-section>
              </q-item>
            </template>

            <q-separator
              :key="index"
              v-if="menuItem.separator"
            />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <div class="relative-position h-100">
        <router-view />
        <q-inner-loading :showing="loadingPage">
          <q-spinner-facebook
            color="green"
            size="2rem"
          />
        </q-inner-loading>
      </div>
    </q-page-container>
    <CDrawer />
  </q-layout>
  <modalInvite />
  <modalCreateChannel />
  <modalAddOneToOne />
  <ModalCreateTask @reload="getDetailWorkspace" />
  <modalCreateAllAction @reload="getDetailWorkspace" />
  <modalCreateMessage @reload="getDetailWorkspace" />
  <modal-vue-img />
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
  toRefs,
  nextTick,
  watch,
  defineAsyncComponent,
} from 'vue';
import routesWorkspace from 'src/router/workspace';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { useChannelStore } from 'stores/channel';
import { useRoute, useRouter } from 'vue-router';
import ChannelService from 'src/services/channel';
import NotifyServices from 'src/plugins/NotifyServices';
import {
  bodyArrangeChannel,
  bodyMuteChannel,
  channelId,
  TypePositionsChannel,
} from 'src/services/channel/model';
import { useI18n } from 'vue-i18n';
import TaskService from 'src/services/task';
import ChatService from 'src/services/chat';
import WikiService from 'src/services/wiki';
import { debounce } from 'quasar';
import TabHeaderChannel from 'components/channel/TabHeaderChannel.vue';
import draggable from 'vuedraggable';

import {
  scrollToId,
  maxCount,
  formatDateDisplay,
  debounceCustom,
  scrollToBottomId,
} from 'src/helper/global';
import { useCalendarStore } from 'stores/calendar';
import { IChannel } from 'src/model/ChannelDetail';
import { typeChannel, typeRoute } from 'src/interface/constStatus';
import { formChannel } from 'src/interface/cardChannel';

export default defineComponent({
  name: 'LayoutWorkSpace',
  components: {
    TabHeaderChannel,
    draggable,
    // commentEditAble,
    menuInfoWorkspace: defineAsyncComponent(
      () => import('components/layouts/menuInfoWorkspace.vue'),
    ),
    modalInvite: defineAsyncComponent(() => import('components/people/modalInvite.vue')),
    modalCreateChannel: defineAsyncComponent(
      () => import('components/channel/modalCreateChannel.vue'),
    ),
    CDrawer: defineAsyncComponent(() => import('components/common/CDrawer.vue')),
    modalAddOneToOne: defineAsyncComponent(
      () => import('components/people/modalAddOneToOne.vue'),
    ),

    ModalCreateTask: defineAsyncComponent(
      () => import('components/workspace/modalCreateTask.vue'),
    ),
    modalCreateAllAction: defineAsyncComponent(
      () => import('components/workspace/modalCreateAllAction.vue'),
    ),
    modalCreateMessage: defineAsyncComponent(
      () => import('components/workspace/modalCreateMessage.vue'),
    ),

    ModalVueImg: defineAsyncComponent(() => import('components/upfile/modalVueImg.vue')),
    // InputSearchAll
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const state = reactive<{
      listRoutesWorkspace: any;
      listShowAction: string[];
      search: string;
      showMenu: boolean;
      hiddenDraft: boolean;
      listRemoveRecentSearch: string[];
      listDragAction: string[];
      renderListChannel: number;
    }>({
      listRoutesWorkspace: routesWorkspace[0].children,
      listShowAction: ['muteChannel', 'closeConversation', 'markAsRead'],
      search: '',
      showMenu: false,
      hiddenDraft: false,
      listRemoveRecentSearch: [],
      listDragAction: [],
      renderListChannel: 0,
    });
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const workspaceStore = useWorkspaceStore();
    const channelStore = useChannelStore();
    const tabChannel = computed({
      get(): typeChannel | '' {
        return channelStore.tabChannel;
      },
      set(val: typeChannel | '') {
        channelStore.tabChannel = val;
      },
    });

    const getSideBar = () => {
      return new Promise((resolve, reject) => {
        channelStore
          .getChannelInWs(`${route.params.workspaceId}`)
          .then(() => {
            if (route.name === 'workspace-detail') {
              router.push({
                name: 'channel-detail',
                params: {
                  channelId: channelStore?.listChannel?.[0]?.id,
                },
              });
            }
            resolve(true);
          })
          .catch((err: any) => {
            NotifyServices.showMessageError(err?.errors?.message);
            if ([421, 400].includes(err?.status_code)) {
              router.push({
                name: 'list-workspace',
              });
              workspaceStore.$reset();
            }
            reject(false);
          });
      });
    };
    const getSearchAllRecent = () => {
      if (route.name === 'searchAll') {
        const query = route.query as any;
        const { keyword } = query;
        state.search = keyword || '';
      }
      workspaceStore.searchAllRecent();
    };
    const getDetailWorkspace = () => {
      if (!route?.params?.workspaceId) {
        router.push({ name: 'home' });
      }
      workspaceStore
        .getDetailWorkspace()
        .then()
        .catch((err) => {
          if (err.status_code === 404 && err.status_code === 406) {
            router.push({
              name: 'home',
            });
          }
        });
      getSideBar().then(() => {
        changeTab();
      });
      getSearchAllRecent();
    };

    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    getDetailWorkspace();
    const mainStore = useMainStore();
    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    const reloadSideBar = computed(() => {
      return mainStore.reloadSideBar;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        getSideBar().then(() => {
          changeTab();
        });
        getSearchAllRecent();
      }
    });
    watch(reloadSideBar, () => {
      if (reloadSideBar.value > 0) {
        getSideBar().then(() => {
          changeTab();
        });
      }
    });
    watch(route, () => {
      state.hiddenDraft = false;
    });

    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const notifyWs = computed(() => {
      return channelStore.notifyWs;
    });

    const menuCalendar = computed(() => {
      return [
        {
          type: 'overdue',
          total: notifyWs?.value?.calendar['overdue'] || 0,
          color: 'overdue',
          active:
            route.name === 'calendar-year' &&
            typeof route?.query?.status === 'string' &&
            'overdue' === route?.query?.status?.toLowerCase(),
        },
        {
          type: 'indue',
          total: notifyWs?.value?.calendar['indue'] || 0,
          color: 'primary',
          active:
            route.name === 'calendar-year' &&
            typeof route?.query?.status === 'string' &&
            'indue' === route?.query?.status?.toLowerCase(),
        },
        {
          type: 'done',
          total: notifyWs?.value?.calendar['done'] || 0,
          color: 'neutral-5',
          active:
            route.name === 'calendar-year' &&
            typeof route?.query?.status === 'string' &&
            'done' === route?.query?.status?.toLowerCase(),
        },
      ];
    });

    const getTotalUnread = (itemChannel: IChannel) => {
      if (tabChannel.value === 'chat') {
        return itemChannel.unread_chats;
      }
      if (tabChannel.value === 'task') {
        return itemChannel.unread_tasks;
      }
      if (tabChannel.value === 'wiki') {
        return itemChannel.unread_wiki;
      }
      return 0;
    };
    const menu = computed(() => {
      let listMenu: any = [];
      console.log('menu ===============');
      state.listRoutesWorkspace.forEach((item: any, index: number) => {
        if (tabChannel.value === 'chat' && item.meta.type === 'draft') {
          state.hiddenDraft = true;
          return;
        }
        if (index > 0 && item.meta.showMenu) {
          const itemMenu: any = {
            ...item.meta,
            name: item.name,
          };
          if (itemMenu.type === 'channel') {
            itemMenu.children = [...channelStore.listChannel].map(
              (itemChannel: IChannel) => {
                return {
                  ...itemChannel,
                  totalUnread: getTotalUnread(itemChannel),
                };
              },
            );
          }
          if (itemMenu.type === 'oneToOne' && tabChannel.value !== 'wiki') {
            itemMenu.children = [...channelStore.listOneToOne].map(
              (itemChannel: IChannel) => {
                return {
                  ...itemChannel,
                  totalUnread: getTotalUnread(itemChannel),
                };
              },
            );
          }

          listMenu.push(itemMenu);
        }
      });
      return listMenu;
    });
    const actionMenu = (name: string) => {
      if (name === 'channel-detail') {
        channelStore.showModalAddChannel(true);
      }
      if (name === 'one-to-one') {
        workspaceStore.createOneToOne = true;
        if (tabChannel.value === 'chat') {
          workspaceStore.IsShowModalAddMessage = true;
        } else {
          workspaceStore.showModalAddTask(true);
        }
      }
    };

    const showDrawerRightProfile = () => {
      workspaceStore.showDrawerRightProfile(true);
      workspaceStore.setDrawerRightProfileValue(infoUser.value);
    };

    const closeConversation = (item: any) => {
      const body: channelId = {
        channel_id: item.id,
      };
      ChannelService.closeChannelOnoToOne(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.oneToOne.notify.closeConversationSuccess'),
            );
            getSideBar();
            mainStore.getInfoUser();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.oneToOne.notify.closeConversationFailed'),
          );
        });
    };
    const muteChannel = (item: any) => {
      const body: bodyMuteChannel = {
        channel_id: item.id,
        is_mute: !item.is_mute,
      };
      ChannelService.muteChannel(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (!item.is_mute) {
              NotifyServices.showMessageSuccess(
                t('workspace.oneToOne.notify.muteChannelSuccess'),
              );
            } else {
              NotifyServices.showMessageSuccess(
                t('workspace.oneToOne.notify.unmuteChannelSuccess'),
              );
            }
            getSideBar();
            mainStore.getInfoUser();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          if (!item.is_mute) {
            NotifyServices.showMessageError(
              t('workspace.oneToOne.notify.muteChannelFailed'),
            );
          } else {
            NotifyServices.showMessageError(
              t('workspace.oneToOne.notify.unmuteChannelFailed'),
            );
          }
        });
    };

    const handleMarkAsRead = (item: any) => {
      if (tabChannel.value === 'task') {
        markAsReadTask(item);
      }
      if (tabChannel.value === 'chat') {
        markAsReadChat(item);
      }
      if (tabChannel.value === 'wiki') {
        markAsReadWiki(item);
      }
    };

    const markAsReadTask = (item: any) => {
      TaskService.markReadTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(item.id),
        task_ids: [],
        is_read: true,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.oneToOne.notify.markAsReadSuccess'),
            );
            mainStore.actionReloadAllPage();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.oneToOne.notify.markAsReadFailed'),
          );
        });
    };
    const markAsReadChat = (item: any) => {
      ChatService.readMessage({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(item.id),
        chat_ids: [],
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.oneToOne.notify.markAsReadSuccess'),
            );
            mainStore.actionReloadAllPage();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.oneToOne.notify.markAsReadFailed'),
          );
        });
    };
    const markAsReadWiki = (item: any) => {
      WikiService.markReadWiki({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(item.id),
        wiki_ids: [],
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.oneToOne.notify.markAsReadSuccess'),
            );
            mainStore.actionReloadAllPage();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.oneToOne.notify.markAsReadFailed'),
          );
        });
    };
    const addTask = () => {
      workspaceStore.createOneToOne = false;
      workspaceStore.IsShowModalAddAllActionWs = true;
    };

    const calendarStore = useCalendarStore();

    const changeFilter = (filter?: any) => {
      calendarStore.changeFilter({
        ...filter,
      });
    };
    const gotoCalendarList = (itemCalendar: any) => {
      if (route.name !== 'calendar-year') {
        router.push({
          name: 'calendar-year',
          query: {
            status: itemCalendar.type.toUpperCase(),
            start_date: formatDateDisplay(new Date(), 'YYYY'),
          },
        });
      } else {
        changeFilter({ status: itemCalendar.type.toUpperCase() });
        calendarStore.actionReloadPage();
      }
    };
    const gotoCalendarView = () => {
      if (route.name !== 'calendar-view') {
        calendarStore.clearFilter();
        router.push({
          name: 'calendar-view',
        });
      } else {
        calendarStore.clearFilter();
      }
    };

    const loadingPage = computed(() => mainStore.loadingPage);

    const focusSearch = () => {
      state.showMenu = true;
    };
    const hiddenMenu = () => {
      state.showMenu = false;
    };

    const keyupSearch = (e: any) => {
      if (e.keyCode === 13) {
        handleSearch();
      } else {
        focusSearch();
      }
    };
    const handleSearch = () => {
      if (!state.search) return;
      if (route.name !== 'searchAll') {
        router
          .push({
            name: 'searchAll',
            query: {
              keyword: state.search,
            },
          })
          .then(() => {
            hiddenMenu();
            mainStore.actionReloadAllPage();
          });
      } else {
        router
          .replace({
            name: 'searchAll',
            query: {
              ...route.query,
              keyword: state.search,
            },
          })
          .then(() => {
            hiddenMenu();
            mainStore.actionReloadAllPage();
          });
      }
    };
    const selectSearch = (item: any) => {
      state.search = item.keyword;
      handleSearch();
    };

    const pruneRecentSearch = () => {
      workspaceStore.pruneRecentSearch(state.listRemoveRecentSearch);
    };

    const debouncePruneRecent = debounce(() => {
      pruneRecentSearch();
    }, 1000);

    const removeRecentSearch = (item: any) => {
      state.listRemoveRecentSearch.push(item.id);
      workspaceStore.listSearchAllRecent = workspaceStore.listSearchAllRecent.filter(
        (itemSearch: any) => itemSearch.id !== item.id,
      );
      debouncePruneRecent();
    };

    const listSearchAllRecent = computed(() => workspaceStore.listSearchAllRecent);

    const menuAction = (type: string, itemMenu: any) => {
      const menu = [
        {
          id: 1,
          icon: '',
          title: itemMenu?.is_mute
            ? t('workspace.oneToOne.menuAction.unmuteChannel')
            : t('workspace.oneToOne.menuAction.muteChannel'),
          show: type === 'oneToOne',
          disable: itemMenu?.is_mute,
          action: () => muteChannel(itemMenu),
        },
        {
          id: 2,
          icon: '',
          title: t('workspace.oneToOne.menuAction.closeConversation'),
          show: type === 'oneToOne',
          disable: false,
          action: () => closeConversation(itemMenu),
        },
        {
          id: 3,
          icon: 'bi-eye',
          title: t('workspace.oneToOne.menuAction.markAsRead'),
          show: itemMenu?.total > 0,
          disable: itemMenu?.total === 0,
          action: () => handleMarkAsRead(itemMenu),
        },
      ];
      return menu.filter((item: any) => item.show);
    };

    const activeSingleItem = (menuItem: any) => {
      if (menuItem?.type === 'draft') {
        return ['draft-task', 'draft-wiki'].includes(route.name as string);
      }
      return menuItem.name === route.name;
    };
    const getFirstNameRoute = (type: typeRoute) => {
      if (type === 'oneToOne') {
        return 'one-to-one';
      }
      if (type === 'channel') {
        return 'channel';
      }
      if (type === 'draft') {
        return 'draft';
      }
      return '';
    };
    const gotoRouterDynamic = (menuItem: any, element: any) => {
      if (state.listDragAction.includes(menuItem.type)) return;
      router.push({
        name: `${getFirstNameRoute(menuItem.type)}-${tabChannel.value || 'chat'}`,
        params: {
          [menuItem.params]: element.id,
        },
      });
    };
    const gotoRouterSingle = (menuItem: any) => {
      if (menuItem?.type === 'draft') {
        router.push({
          name: `${getFirstNameRoute(menuItem.type)}-${tabChannel.value || 'task'}`,
        });
        return;
      }
      router.push({
        name: menuItem.name,
      });
    };
    const showCountSingleRoute = (menuItem: any) => {
      if (menuItem.type === 'draft') {
        let countDraft = 0 as number;
        if (channelStore.tabChannel === 'task') {
          countDraft = channelStore.totalCountDraftTask || 0;
        }
        if (channelStore.tabChannel === 'wiki') {
          countDraft = channelStore.totalCountDraftWiki || 0;
        }
        return maxCount(countDraft);
      }
      // @ts-ignore
      return maxCount(notifyWs.value?.[menuItem.type] || 0);
    };
    const heightChannel = computed(() => {
      if (state.hiddenDraft) {
        return 'calc((100vh - 560px) / 2)';
      }
      if (tabChannel.value === 'wiki') {
        return 'calc(100vh - 560px)';
      }
      return 'calc((100vh - 560px) / 2)';
    });

    const handleDragItem = (type: string) => {
      console.log(type);
      if (state.listDragAction.includes(type)) {
        state.listDragAction = state.listDragAction.filter(
          (item: string) => item !== type,
        );
      } else {
        state.listDragAction.push(type);
      }
    };

    // const setNewIndex = debounce((listChannel:any) => {
    //   console.log('setNewIndex')
    //   state.renderListChannel += 1;
    //   changeArrangeChannel(listChannel);
    // }, 1000);

    const setNewIndex = (listChannel: any) => {
      state.renderListChannel += 1;
      changeArrangeChannel(listChannel);
    };

    const changeArrangeChannel = debounce((listChannel: any) => {
      let positions: TypePositionsChannel[] = [];
      listChannel.forEach((item: formChannel, index: number) => {
        if (index > 0) {
          positions.push({
            channel_id: item.id,
            index: index + 1,
          });
        }
      });
      const body: bodyArrangeChannel = {
        workspace_id: Number(route?.params?.workspaceId),
        positions,
      };
      ChannelService.arrangeChannel(body).then((res: any) => {
        if (res?.status_code === 200) {
          console.log('arrangeChannel');
        }
      });
    }, 1000);

    const changeTab = () => {
      setTimeout(() => {
        if (route.name) {
          const routeType = route.meta.type as string;
          let idScroll = `page-${routeType}` as string;
          if (route?.params?.channelId) {
            idScroll = `${idScroll}-${route?.params?.channelId}`;
          }
          scrollToBottomId(idScroll);
        }
      }, 500);
    };

    // const
    return {
      ...toRefs(state),
      menu,
      leftDrawerOpen,
      infoUser,
      detailWorkspace,
      notifyWs,
      menuCalendar,
      actionMenu,
      showDrawerRightProfile,
      closeConversation,
      muteChannel,
      addTask,
      gotoCalendarList,
      gotoCalendarView,
      reloadAllPage,
      getDetailWorkspace,
      maxCount,
      loadingPage,
      focusSearch,
      hiddenMenu,
      handleSearch,
      selectSearch,
      removeRecentSearch,
      keyupSearch,
      listSearchAllRecent,
      menuAction,
      activeSingleItem,
      gotoRouterDynamic,
      heightChannel,
      gotoRouterSingle,
      showCountSingleRoute,
      handleDragItem,
      setNewIndex,
      changeTab,
    };
  },
});
</script>

<style scoped lang="scss">
@import 'src/css/main.scss';

:deep(.q-page-container) {
  padding-top: 160px !important;
  height: 100vh;
}

:deep(.menu-bar) {
  background: #f8f8f8;
  min-width: 352px;
  color: #3c3c3c;
  font-weight: 400;
  font-size: 16px;
  top: 0 !important;

  .q-scrollarea__content {
    width: 100%;
  }

  .item-left-bar {
    min-height: 96px;
    width: 100%;
    padding: 28px 20px 27px 32px;
    position: fixed;
    z-index: 1000;
    border-bottom: solid 1px #e9eae8;
    background: #f8f8f8;

    &-name {
      color: #2f2f2f;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px !important;
      padding-right: 8px;
      display: flex;

      span {
        margin-right: 6px;
        display: block;
      }

      i {
        margin-top: 6px;
      }
    }

    .q-item {
      padding: 0;
      min-height: 19px;
    }
  }

  .q-item {
    cursor: pointer;
  }

  .q-list {
    padding: 12px 16px;
    margin-top: 96px;

    .q-item {
      padding: 0 16px;
      margin: 12px 0;
      min-height: 36px;
    }

    .q-item:nth-child(2) {
      margin: 12px 0;
    }

    .q-item.q-item-calender--title {
      margin-top: 12px;
      margin-bottom: 0;
    }

    .q-item.q-item-calender--menu {
      min-height: 32px;
      margin: 0;
    }

    .q-item.q-item-single:hover {
      @extend .active-item;
    }

    .q-item.q-item--dynamic {
      padding: 12px 0;
      margin: 0;
    }

    .q-expansion-item {
      width: 100%;
      overflow: hidden;

      &__container {
        .q-item:first-child {
          //max-width: 160px;
        }

        .q-item__section--main {
          // width: fit-content;
          // max-width: max-content;
        }
      }

      &__content {
        .q-item {
          max-width: unset !important;
        }
      }

      .q-item {
        padding: 0 16px;
        min-height: 36px;
        margin: 0;
      }

      .q-expansion-item__content {
        overflow-y: scroll;
        max-height: v-bind(heightChannel);
        margin: 0;
      }

      .q-expansion-item__content .q-item {
        min-height: 32px;
      }

      :deep(.q-item .q-item-calender--menu) {
        min-height: 32px;
      }

      .q-item:hover {
        @extend .active-item;
      }
    }

    .q-item__section .down-fill {
      padding-left: 10px;
    }

    .q-item__section--side {
      padding-left: 12px;
    }

    .q-item__section--top {
      padding-top: 8px;
      padding-left: 0;
    }

    .q-item__section--avatar {
      min-width: 26px;
    }
  }

  .icon-children {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #3c3c3c;
  }

  .expandIcon {
    .q-icon {
      font-size: 16px;
    }
  }
}

.top-bar {
  padding: 20px 30px;

  .top-avatar {
    //padding-left: 22px;
    width: 56px;

    .q-avatar {
      cursor: pointer;
    }
  }

  :deep(.top-search) {
    //min-width: 654px;

    .q-field__control {
      height: 40px;
    }

    .q-field__marginal {
      height: 40px;
    }

    .q-field__bottom {
      padding: 0;
    }

    .q-field--with-bottom {
      padding: 0;
    }

    .q-icon {
      font-size: 16px;
      color: #565656;
    }

    .q-input {
      width: 100%;
    }
  }

  img {
    width: 56px;
    height: 56px;
  }
}

.icon-plus {
  color: #ffffff;
}

.btn-add {
  position: absolute;
  right: 16px;
  top: 18px;
  z-index: 9;

  .btn-list {
    padding-right: 10px;
  }

  .q-btn {
    border: 1px solid $primary;
  }
}

:deep(.q-separator) {
  background: #e9eae8;
}

.header-ws {
  z-index: 2050;
}

.custom-button-small {
  min-height: 28px;
  min-width: 28px;
}

.hr-bottom-tab {
  margin: 12px 0;
}
.pl-12 {
  padding-left: 12px;
}
</style>
