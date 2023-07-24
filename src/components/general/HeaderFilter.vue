<template>
  <q-header
    bordered
    class="bg-white header-custom"
  >
    <div class="header-filter flex justify-center items-center justify-between">
      <div
        class="filter-left"
        @click="onClickChannel"
      >
        #{{ channelDetail?.name }}
      </div>
      <div class="filter-right flex justify-center items-center justify-between">
        <div class="filter-icon">
          <q-btn-dropdown
            label="Filter"
            dropdown-icon="bi-funnel"
          >
            <q-expansion-item label="Status">
              <q-item v-close-popup>
                <q-item-section class="list-item">
                  <q-checkbox
                    v-model="check1"
                    label="Overdue"
                  ></q-checkbox>
                  <q-checkbox
                    color=""
                    v-model="check2"
                    label="Indue"
                  ></q-checkbox>
                  <q-checkbox
                    v-model="check3"
                    label="Done"
                  ></q-checkbox>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-separator inset></q-separator>

            <q-expansion-item label="Priority">
              <q-item v-close-popup>
                <q-item-section class="list-item">
                  <q-checkbox
                    v-model="check4"
                    label="High"
                  ></q-checkbox>
                  <q-checkbox
                    color=""
                    v-model="check5"
                    label="Medium"
                  ></q-checkbox>
                  <q-checkbox
                    color=""
                    v-model="check6"
                    label="Low"
                  ></q-checkbox>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-separator inset></q-separator>

            <q-expansion-item label="Priority">
              <q-item v-close-popup>
                <q-item-section class="list-item">
                  <q-checkbox
                    v-model="check7"
                    label="Flag set"
                  ></q-checkbox>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-list>
              <q-card class="my-card">
                <q-card-actions align="around">
                  <q-btn flat>Reset</q-btn>
                  <c-btn
                    label="Apply"
                    color="primary"
                    size="small"
                  />
                </q-card-actions>
              </q-card>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="filter-select">
          <i class="bi bi-ui-checks-grid"></i>
          <span>Select</span>
        </div>
        <div class="filter-people">
          <q-item-section>
            <q-item-label
              caption
              class="overlapping"
            >
              <template v-for="(member, index) in listMemberChannel">
                <CAvatar
                  v-if="index < 10"
                  :key="index"
                  size="32px"
                  :avatar="member?.avatar"
                  :text="member?.email.split('')[0] || ''"
                  :style="`left: ${index * -8}px`"
                />
                <q-avatar
                  v-if="index === 10"
                  :key="index"
                  size="32px"
                  color="purple-1"
                  text-color="white"
                  :style="`left: ${index * -8}px`"
                >
                  +{{ listMemberChannel.length - 10 }}
                </q-avatar>
              </template>
            </q-item-label>
          </q-item-section>
        </div>
        <div class="add-people items-center">
          <c-btn
            label="Add people"
            color="primary"
            outline
            icon="bi-person-add"
            size="small"
            @click="showModalAddMember"
          />
        </div>
      </div>
    </div>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useChannelStore } from 'stores/channel';

enum EEmitFunc {
  ON_CLICK_CHANNEL = 'onClickChannel',
}

export default defineComponent({
  name: 'HeaderFilter',

  emits: [EEmitFunc.ON_CLICK_CHANNEL],

  setup(_, { emit }) {
    const number = ref(5);

    const channelStore = useChannelStore();

    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });
    const listMemberChannel = computed(() => {
      return channelStore.listMemberChannel;
    });
    const showModalAddMember = () => {
      channelStore.showModalAddPeople(true);
    };

    const onClickChannel = () => {
      emit(EEmitFunc.ON_CLICK_CHANNEL);
    };

    return {
      showModalAddMember,
      channelDetail,
      listMemberChannel,
      number,
      check1: ref(true),
      check2: ref(true),
      check3: ref(true),
      check4: ref(true),
      check5: ref(true),
      check6: ref(true),
      check7: ref(true),
      onClickChannel,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-header.header-custom {
  top: 97px;
}
.header-filter {
  width: 100%;
  padding: 12px 32px;
  .filter-left {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: #2f2f2f;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }

  .filter-right {
    .filter-icon {
      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }
      :deep(span) {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
        text-transform: none;
      }

      .q-btn__content {
      }
    }
    .filter-select {
      padding: 0 24px 0 8px;
      i {
        width: 13px;
        height: 14px;
      }

      span {
        margin-left: 6px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
      }
    }
    .filter-people {
      .overlapping {
      }
    }

    .add-people {
      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }
    }
  }
}

.q-expansion-item {
  width: 240px;
  :deep(.q-item__section) {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 8px 0 0;
  }

  .q-expansion-item__content {
    .q-item {
      padding: 0;
      .list-item {
        padding: 0;

        .q-checkbox {
          padding-left: 8px;

          :deep(.q-checkbox__bg) {
            border: 4px solid currentColor;
            border-radius: 4px;
          }
          :deep(.q-checkbox__label) {
            font-size: 14px;
            color: #2f2f2f;
            line-height: 20px;
            font-weight: 400;
          }
        }

        .q-checkbox:last-child {
          padding-bottom: 8px;
        }
      }
    }
  }
}

.q-list {
  .q-card {
    box-shadow: none;

    .q-card__actions {
      justify-content: space-between;
      margin: 0 8px;
    }

    .q-btn {
      padding: 0 16px;

      :deep(.q-btn__content) {
        font-size: 14px;
        font-weight: 500;
        text-transform: none;
        line-height: 20px;
      }
    }
  }
}
</style>
