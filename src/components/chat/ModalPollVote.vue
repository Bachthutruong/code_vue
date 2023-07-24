<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
import { useChannelStore } from 'stores/channel';
import {
  formatDateToIosString,
  formatIosStringToDate,
  optionsFn,
  validate,
} from 'src/helper/global';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';

interface formPollVote {
  isPin?: boolean;
  title?: string;
  options: Array<string>;
  deadLine?: string;
  multiSelect: boolean;
}

export default defineComponent({
  name: 'ModalPollVote',
  methods: { formatIosStringToDate },
  components: {},
  emits: ['createPollVote'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const mapI18n = (path: string): string => {
      return t(`workspace.chat.modalCreatePollVote.${path}`);
    };
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const channelStore = useChannelStore();
    const myForm = ref();

    const state = reactive<{
      loading: boolean;
      form: formPollVote;
      rulesTitle: Array<any>;
      errorOption: boolean;
      showModalConfirm: boolean;
      infoModalConfirm: typeInfoModalConfirm;
      typeSetDeadline: string;
    }>({
      loading: false,
      form: {
        isPin: false,
        title: '',
        options: ['', ''],
        deadLine: '',
        multiSelect: false,
      },
      rulesTitle: [(val: string) => !!val || t('global.messages.required')],
      errorOption: false,
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
      typeSetDeadline: '',
    });

    const resetData = () => {
      state.loading = false;
      state.errorOption = false;
      state.showModalConfirm = false;
      state.typeSetDeadline = '';
      state.form = {
        isPin: false,
        title: '',
        options: ['', ''],
        deadLine: '',
        multiSelect: false,
      };
    };

    const IsShowModal = computed(() => channelStore.IsShowModalCreatePollVote);
    const permission = computed(() => channelStore.getRolePermissionChannel);
    watch(IsShowModal, () => {
      resetData();
    });
    const closeModal = () => {
      resetData();
      channelStore.IsShowModalCreatePollVote = false;
    };

    const getOptionsVote = () => {
      let votes: any[] = [];
      state.form.options.forEach((item: string) => {
        if (item) {
          votes.push({
            content: item,
          });
        }
      });
      return votes;
    };

    const createPollVote = async () => {
      const answers = getOptionsVote();
      state.errorOption = answers.length < 2;
      const check = await validate(myForm.value);
      if (!check || state.errorOption) return;
      const { isPin, title, deadLine, multiSelect } = state.form;
      const body = {
        is_pin: isPin,
        title,
        answers,
        due_at: formatDateToIosString(deadLine),
        is_multi_select: multiSelect,
      };
      console.log(body);

      emit('createPollVote', body);
      closeModal();
    };

    const addOption = () => {
      state.form.options.push('');
    };

    const optionsSetDeadline = computed(() => {
      return [
        {
          label: mapI18n('action.popup.noDeadline'),
          value: '',
        },
        {
          label: mapI18n('action.popup.setTime'),
          value: 'setTime',
        },
      ];
    });

    const showPopupSetDeadline = () => {
      state.showModalConfirm = true;
      state.infoModalConfirm = {
        type: 'setTime',
        title: mapI18n('action.popup.title'),
        textOk: mapI18n('action.popup.textOk'),
        textCancel: t('global.cancel'),
        alignFooter: 'center',
        desc: '',
        disabled: false,
        action: () => {
          state.showModalConfirm = false;
        },
      };
    };

    const removeOptions = (index: number) => {
      if (state.form.options.length === 2) {
        state.form.options[index] = '';
        return;
      }
      state.form.options.splice(index, 1);
    };
    return {
      ...toRefs(state),
      myForm,
      IsShowModal,
      optionsSetDeadline,
      mapI18n,
      closeModal,
      createPollVote,
      addOption,
      showPopupSetDeadline,
      optionsFn,
      removeOptions,
      permission,
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
    :title="mapI18n('title')"
  >
    <q-form
      @submit="createPollVote"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <div class="row q-col-gutter-md">
          <div
            class="col-12"
            v-if="permission?.pinChat"
          >
            <q-checkbox
              class="q-checkbox-custom"
              color="primary"
              v-model="form.isPin"
            ></q-checkbox>
            <span class="text-body-regular text-neutral-1">
              {{ mapI18n('isPin') }}
            </span>
          </div>
          <div class="col-12">
            <div class="form-label">
              {{ mapI18n('labelDesc') }}
            </div>
            <c-text-area
              v-model="form.title"
              :rules="rulesTitle"
              class=""
              :label="mapI18n('desc')"
              max-length="200"
            />
          </div>
          <div class="col-12">
            <div class="form-label">
              {{ mapI18n('labelOptions.text') }}
              <span class="form-label-desc">
                {{ mapI18n('labelOptions.desc') }}
              </span>
            </div>
            <div
              v-if="errorOption"
              class="q-field__messages col"
            >
              {{ mapI18n('labelOptions.valid') }}
            </div>
            <div>
              <c-text-field
                v-for="(_, index) in form.options"
                :key="index"
                v-model="form.options[index]"
                :error="errorOption"
                :label="`${mapI18n('labelOptions.label')} ${index + 1}`"
                maxlength="120"
              >
                <template #append>
                  <q-icon
                    class="cursor-pointer"
                    name="bi-x-lg"
                    @click="removeOptions(index)"
                  ></q-icon>
                </template>
              </c-text-field>
            </div>
            <div
              class="action-add-options"
              v-if="form.options.length < 5"
            >
              <c-btn
                color="primary"
                size="large"
                flat
                icon="bi-plus-lg"
                :label="mapI18n('labelOptions.addOption')"
                @click="addOption"
              />
            </div>

            <q-separator color="neutral-5" />
          </div>

          <div class="col-12">
            <q-list class="list-action">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ mapI18n('action.title') }}</q-item-label>
                  <q-item-label caption>
                    <span v-if="typeSetDeadline === 'setTime'">
                      {{ form.deadLine }}
                    </span>
                    <span v-else>
                      <!-- {{ mapI18n('action.caption') }} -->
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-option-group
              :options="optionsSetDeadline"
              type="radio"
              v-model="typeSetDeadline"
              color="primary"
            />
            <div
              v-if="typeSetDeadline === 'setTime'"
              class="box-set-time"
            >
              <CDateTimePicker
                v-model="form.deadLine"
                :options="optionsFn"
                label="yyyy/mm/dd"
              >
              </CDateTimePicker>
            </div>
            <q-list class="list-action">
              <q-item>
                <q-item-section>{{ mapI18n('multiSelect') }}</q-item-section>
                <q-item-section side>
                  <q-toggle
                    color="primary"
                    v-model="form.multiSelect"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-form>
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
        :label="$t('global.create')"
        :loading="loading"
        @click="createPollVote"
      />
    </template>
  </CModal>
</template>

<style scoped lang="scss">
.form-label {
  margin-bottom: 4px;
}

.q-checkbox-custom {
  margin-right: 16px;

  :deep(.q-checkbox__inner) {
    width: 24px;
    height: 24px;
    font-size: 24px;

    .q-checkbox__bg {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border: 1.5px solid #d3d3d3;
    }
  }
}

.q-field__messages {
  color: #f44436;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 8px;
}

.action-add-options {
  margin-bottom: 16px;
}

.list-action {
  .q-item {
    padding: 12px 0;
    height: 20px;

    &__label {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #3c3c3c;

      &--caption {
        font-weight: 400;
        color: #565656;
      }
    }
  }

  margin-bottom: 8px;
}

:deep(.q-radio) {
  margin-bottom: 15px;
  width: 288px;

  .q-radio__inner {
    font-size: 24px;
    margin-right: 10px;

    .q-radio__bg {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }

  .q-radio__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
  }
}

.q-option-group {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
