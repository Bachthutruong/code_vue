<template>
  <div class="box-action-task">
    <div>
      <img
        v-if="getInfoTask?.type === 'LEAVE'"
        :src="emojiDoor"
      />
      <img
        v-if="getInfoTask?.type === 'JOIN'"
        :src="emojiParty"
      />
    </div>
    <div class="box-action-task-text">
      <div v-if="getInfoTask?.type === 'LEAVE'">
        <span v-if="!getInfoTask?.actorName"
          >{{ getInfoTask?.userName }}
          {{ $t('workspace.channel.addOrRemoveMember.leftThisChannel') }}</span
        >
        <span v-else>
          {{
            $t('workspace.channel.addOrRemoveMember.removed', {
              actor: getInfoTask?.actorName,
              user: getInfoTask?.userName,
            })
          }}</span
        >
      </div>
      <div v-if="getInfoTask?.type === 'JOIN'">
        <span v-if="getInfoTask?.actorName">{{
          $t('workspace.channel.addOrRemoveMember.added', {
            actor: getInfoTask?.actorName,
            user: getInfoTask?.userName,
          })
        }}</span>
        <span v-if="!getInfoTask?.actorName">{{
          $t('workspace.channel.addOrRemoveMember.joinOneToOne', {
            user: getInfoTask?.userName,
          })
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import emojiDoor from 'assets/emoji/emoji_door.svg';
import emojiParty from 'assets/emoji/emoji_party popper.svg';
export default defineComponent({
  name: 'addOrRemoveMember',
  props: {
    infoTask: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const getInfoTask = computed(() => {
      if (props.infoTask) {
        const dataTask = props.infoTask;
        return {
          ...dataTask,
          actorName:
            dataTask?.other?.actor?.full_name || dataTask?.other?.actor?.email || '',
          userName:
            dataTask?.other?.user?.full_name || dataTask?.other?.user?.email || '',
        };
      }
      return null;
    });
    return {
      getInfoTask,
    };
  },
  data() {
    return {
      emojiDoor,
      emojiParty,
    };
  },
});
</script>

<style scoped lang="scss">
.box-action-task {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 4px 0;
  &-text {
    margin-left: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #3c3c3c;
  }
}
</style>
