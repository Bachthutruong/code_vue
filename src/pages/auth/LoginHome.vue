<template>
  <div class="login-ctrl column items-center justify-center">
    <div class="main-top">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="main-bottom">
      <div class="block-title text-center">{{ $t('auth.signInTitle') }}</div>
      <q-form
        @submit="onSubmit"
        ref="myForm"
      >
        <q-input
          class="block-input"
          :rules="ruleEmail"
          outlined
          v-model.trim="formLoginAccount.email"
          label="Email(name@email.com)"
          color="green-6"
        />
        <c-btn
          :disabled="!checkEmail(formLoginAccount.email)"
          :loading="loading"
          @click="onSubmit"
          :label="$t('auth.signInEmail')"
          class="btn-signin"
        />
      </q-form>

      <div class="divider text-center">
        <span>{{ $t('auth.or') }}</span>
      </div>

      <c-btn
        class="q-mb-md btn-google"
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
        <span>{{ $t('auth.newToTMessage') }}</span>
        <a
          href="javascript:void(0)"
          @click="$router.push({ name: 'create-account' })"
          >{{ $t('auth.createAccount') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue';
import AuthService from 'src/services/auth';
import { bodyLoginSocial, bodyOtp } from 'src/services/auth/model';
import { useRouter, useRoute } from 'vue-router';
import { TYPE_LOGIN } from 'src/constants';
import NotifyServices from 'src/plugins/NotifyServices';
import { gotoUrlPath, setToken } from 'src/helper/auth';
import { signInGoogleWithPopup } from 'src/plugins/firebase';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { useI18n } from 'vue-i18n';
import { checkEmail } from 'src/helper/validForm';
interface formLogin {
  email: string;
}

export default defineComponent({
  name: 'CreateAccount',
  setup() {
    const state = reactive<{
      formLoginAccount: formLogin;
      loading: boolean;
      ruleEmail: any[];
    }>({
      formLoginAccount: { email: '' },
      loading: false,
      ruleEmail: [(val: string) => checkEmail(val) || t('valid.email')],
    });
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const mainStore = useMainStore();
    const workspaceStore = useWorkspaceStore();
    const myForm = ref();

    const handleOtp = () => {
      if (state.loading) return;
      const inputText = state.formLoginAccount.email.trim();
      state.loading = true;
      const body: bodyOtp = {
        email: inputText,
        type: TYPE_LOGIN,
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
          NotifyServices.showMessageError(`${err.message}`);
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const loginSocial = (body: bodyLoginSocial) => {
      AuthService.loginSocial(body)
        .then((res) => {
          console.log(res);
          if (res) {
            setToken(JSON.stringify(res.data));
            mainStore.getInfoUser();
            if (route.query.urlPath) {
              gotoUrlPath({ router, urlPath: route.query.urlPath });
              return;
            }
            workspaceStore.checkWorkspaceWithLogin();
            mainStore.setInfoFcmToken();
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(`${err.message}`);
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
      myForm.value.validate().then((success: any) => {
        console.log(success);
        if (success) {
          handleOtp();
        }
      });
    };

    return {
      ...toRefs(state),
      handleOtp,
      signInGoogle,
      onSubmit() {
        validate();
      },
      myForm,
      checkEmail,
    };
  },
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
      width: 100%;

      :deep(.q-field__label) {
        font-size: 14px;
      }
    }

    .btn-signin {
      background-color: #1c8c44;
      color: #ffffff;
      min-height: 48px;
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

    .btn-google {
      font-size: 16px;
      :deep(.q-btn__content) {
        color: #565656;
      }
      height: 54px;
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
