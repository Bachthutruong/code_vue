<template>
  <div class="login-ctrl column items-center justify-center">
    <div class="main-top">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="main-bottom">
      <div class="block-title text-center">{{ $t('auth.createNew') }}</div>
      <q-form
        @submit="onSubmit"
        ref="myForm"
      >
        <q-input
          class="block-input"
          outlined
          v-model.trim="formCreateAccount.email"
          :rules="ruleEmail"
          label="Email(name@email.com)"
          color="green-6"
        />
        <c-btn
          :disabled="!checkEmail(formCreateAccount.email)"
          :label="$t('auth.createWithEmail')"
          color="primary"
          :loading="loading"
          @click="onSubmit"
          class="create-email"
        />
      </q-form>

      <div class="divider text-center">
        <span>{{ $t('auth.or') }}</span>
      </div>

      <c-btn
        class="q-mb-md create-google"
        @click="signInGoogle"
        outline
        color="green-6"
      >
        <img
          class="q-mr-md"
          src="~assets/t-message/logo-google.svg"
          alt="#"
        />
        {{ $t('auth.signInGoogle') }}
      </c-btn>

      <div class="last-elm text-center">
        <span>{{ $t('auth.alreadyQuestion') }}</span>
        <a
          href="javascript:void(0)"
          @click="$router.push({ name: 'login' })"
        >
          {{ $t('auth.signInExisting') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue';
import AuthService from 'src/services/auth';
import { bodyLoginSocial, bodyOtp } from 'src/services/auth/model';
import { TYPE_REGISTER } from 'src/constants';
import NotifyServices from 'src/plugins/NotifyServices';
import { signInGoogleWithPopup } from 'src/plugins/firebase';
import { setToken } from 'src/helper/auth';
import { useRouter } from 'vue-router';
import { useWorkspaceStore } from 'stores/workspace';
import { checkEmail } from 'src/helper/validForm';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
interface formCreateAccount {
  email: string;
}

export default defineComponent({
  name: 'CreateAccount',
  mixin: ['mixin'],
  setup() {
    const mainStore = useMainStore();

    const { t } = useI18n();
    const state = reactive<{
      formCreateAccount: formCreateAccount;
      loading: boolean;
      ruleEmail: any[];
    }>({
      formCreateAccount: { email: '' },
      loading: false,
      ruleEmail: [(val: string) => checkEmail(val) || t('valid.email')],
    });
    const router = useRouter();
    const workspaceStore = useWorkspaceStore();
    const myForm = ref();

    const createEmail = () => {
      if (state.loading) return;
      const textInput = state.formCreateAccount.email.trim();
      state.loading = true;
      const body: bodyOtp = {
        email: textInput,
        type: TYPE_REGISTER,
      };
      AuthService.otp(body)
        .then((res: any) => {
          if (res.status_code === 200) {
            router.push({
              name: 'verify',
              query: {
                ...body,
              },
            });
          } else {
            NotifyServices.showMessageError(`${res?.errors.message}`);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(`${err.errorNotify}`);
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const loginSocial = (body: bodyLoginSocial) => {
      AuthService.loginSocial(body)
        .then((res) => {
          console.log(res);
          setToken(JSON.stringify(res.data));
          workspaceStore.checkWorkspaceWithLogin();
          mainStore.getInfoUser();
          mainStore.setInfoFcmToken();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const signInGoogle = () => {
      signInGoogleWithPopup()
        .then((res: any) => {
          loginSocial(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const validate = () => {
      myForm.value.validate().then((succes: any) => {
        if (succes) {
          createEmail();
        }
      });
    };

    const trimspace = (s: any) => {
      s = s.replace(/(^\s*)|(\s*$)/gi, '');
      s = s.replace(/[ ]{2,}/gi, ' ');
      s = s.replace(/\n /, '\n');
      return s;
    };

    return {
      ...toRefs(state),
      checkEmail,
      createEmail,
      signInGoogle,
      loginSocial,
      trimspace,
      onSubmit() {
        validate();
      },
      myForm,
    };
  },
  methods: {},
});
</script>

<style scoped lang="scss">
.login-ctrl {
  height: 100vh;
  .main-top {
    padding-bottom: 48px;
  }

  .main-bottom {
    display: flex;
    flex-direction: column;

    .block-title {
      font-size: 38px;
      font-weight: 500;
      line-height: 46px;
      padding-bottom: 32px;
    }

    .block-input {
      margin-bottom: 24px;
      :deep(.q-field__label) {
        font-size: 14px;
      }
    }

    .create-email {
      height: 48px;
      font-size: 16px;
      width: 437px;
    }

    .divider {
      position: relative;
      padding: 32px 0;

      &:before {
        content: '';
        width: 100%;
        height: 1px;
        background: #d3d3d3;
        position: absolute;
        top: 50%;
        left: 0;
      }

      span {
        position: relative;
        display: inline-block;
        padding: 0 7px;
        background: #fff;
        font-size: 16px;
        color: #565656;
      }
    }

    .create-google {
      :deep(.q-btn__content) {
        color: #565656;
        font-size: 16px;
        height: 54px;
      }
    }

    .last-elm {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      span {
        color: #565656;
      }
      a {
        text-decoration: none;
        color: #1e89e5;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
