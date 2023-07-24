<template>
  <q-dialog v-model="isShowModal">
    <q-card class="CModal modal-calendar-timetable">
      <c-btn
        class="close-btn"
        flat
        round
        dense
        @click="closeModal"
      >
        <template #default>
          <q-icon
            size="24px"
            name="bi-x-lg"
          />
        </template>
      </c-btn>

      <q-card-section
        class="CModal-body"
        horizontal
      >
        <q-card-section class="w-100 body-calendar">
          <calendar-timetable :member-id="memberInfo?.id"></calendar-timetable>
        </q-card-section>
        <q-card-section class="body-info">
          <CAvatar
            size="160px"
            :avatar="drawerRightProfileValue?.avatar?.url || ''"
            :text="drawerRightProfileValue?.full_name?.split('')[0] || ''"
          ></CAvatar>
          <div class="body-info-member">
            <span class="text-h4">{{ drawerRightProfileValue?.name || 'N/A' }}</span>
            <div class="d-flex">
              <span class="text-body">{{ $t('workspace.drawer.position') }}:</span>
              <span class="text-body-regular">{{
                drawerRightProfileValue?.position || 'N/A'
              }}</span>
            </div>
            <div class="d-flex">
              <span class="text-body">{{ $t('workspace.drawer.department') }}:</span>
              <span class="text-body-regular">{{
                drawerRightProfileValue?.department || 'N/A'
              }}</span>
            </div>
            <div class="d-flex">
              <span class="text-body">{{ $t('workspace.drawer.location') }}:</span>
              <span class="text-body-regular">{{
                drawerRightProfileValue?.location || 'N/A'
              }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import CalendarTimetable from 'components/calendar/calendarTimetable.vue';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  name: 'modalCalendarTimetable',
  components: { CalendarTimetable },
  props: {},
  setup() {
    const workspaceStore = useWorkspaceStore();
    const isShowModal = computed({
      get() {
        return workspaceStore.IsShowModalCalendarTimetable;
      },
      set(val: boolean) {
        workspaceStore.IsShowModalCalendarTimetable = val;
      },
    });
    const memberInfo = computed(() => workspaceStore.drawerValue);
    const closeModal = () => {
      workspaceStore.IsShowModalCalendarTimetable = false;
    };
    const drawerRightProfileValue = computed(() => {
      return {
        ...workspaceStore?.drawerValue,
        name:
          workspaceStore?.drawerValue?.full_name ||
          workspaceStore?.drawerValue?.email ||
          '',
      };
    });
    return {
      isShowModal,
      memberInfo,
      closeModal,
      drawerRightProfileValue,
    };
  },
});
</script>
<style lang="scss" scoped>
.q-icon {
  color: #565656;
}

.q-separator {
  color: #e9eae8;
}

.body-info {
  background-color: #f8f8f8;
  position: relative;
  display: flex;
  min-width: 288px;
  padding: 96px 0;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  &-member {
    display: flex;
    padding: 0 20px;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    color: #3c3c3c;
    span {
      margin-bottom: 6px;
    }
    .text-body {
      margin-right: 4px;
    }
  }
}

.close-btn {
  position: absolute;
  top: 22px;
  right: 16px;
  z-index: 10;
}
</style>
