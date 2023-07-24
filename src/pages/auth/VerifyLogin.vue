<template>
  <div class="login-ctrl column items-center justify-center">
    <div class="main-top">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="main-bottom">
      <template v-if="!otpResend">
        <div
          v-if="!errorOtp"
          class="block-title text-center"
        >
          {{ $t('auth.verifyTitle') }}
        </div>
        <div
          v-if="!errorOtp"
          class="block-status"
        >
          {{ $t('auth.status_1') }}
          <strong>{{ email }}</strong
          >{{ $t('auth.status_2') }}
        </div>

        <div
          v-if="errorOtp"
          class="block-title text-center error-code"
        >
          {{ $t('auth.wrongCode') }}
        </div>
        <div
          v-if="errorOtp"
          class="block-status"
        >
          {{ $t('auth.wrongStatus') }}
        </div>
      </template>
      <template v-else>
        <div
          v-if="!errorOtp"
          class="block-title text-center"
        >
          {{ $t('auth.codeResendMessage') }}
        </div>
        <div
          v-if="!errorOtp"
          class="block-status"
        >
          {{ $t('auth.status_3') }}
          <strong>{{ email }}</strong
          >{{ $t('auth.status_2') }}
        </div>
        <div
          v-if="errorOtp"
          class="block-title text-center error-code"
        >
          {{ $t('auth.wrongCode') }}
        </div>
        <div
          v-if="errorOtp"
          class="block-status"
        >
          {{ $t('auth.wrongStatus') }}
        </div>
      </template>

      <OtpInput
        ref="otpInput"
        class="block-otp"
        :class="{
          'error-code': errorOtp,
          'block-otp': true,
        }"
        @update:modelValue="handleOtp"
      />
      <div class="last-elm text-center">
        <span v-if="errorOtp">{{ $t('auth.needNewCode') }}</span>
        <span v-else-if="!errorOtp">Haven't received your code?</span>
        <a
          href="javascript:void(0)"
          @click="resendOtp"
          >{{ $t('auth.resend') }}</a
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import OtpInput from 'src/components/general/OtpInput.vue';
import { defineComponent, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { TYPE_REGISTER, TYPE_LOGIN } from 'src/constants';
import AuthService from 'src/services/auth';
import { gotoUrlPath, setToken } from 'src/helper/auth';
import { bodyRegister, bodyLogin, bodyOtp } from 'src/services/auth/model';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  components: {
    OtpInput,
  },
  name: 'VerifyLogin',
  setup() {
    const OtpInput = ref('');
    const errorOtp = ref(false);
    const otpResend = ref(false);
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    const mainStore = useMainStore();
    const workspaceStore = useWorkspaceStore();
    const email = computed(() => {
      return route?.query?.email || '';
    });

    const handleRegister = () => {
      const body: bodyRegister = {
        email: `${email.value}`,
        full_name: '',
        otp: OtpInput.value,
      };
      AuthService.register(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('auth.createAccountSuccess'));
            setToken(JSON.stringify(res.data));
            mainStore.getInfoUser();
            mainStore.setInfoFcmToken();
            if (route.query.urlPath) {
              gotoUrlPath({ router, urlPath: route.query.urlPath });
              return;
            }
            router.push({
              name: 'home',
            });
          } else {
            errorOtp.value = true;
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(`${t('auth.createAccountFailed')}`);
        });
    };

    const handleLogin = () => {
      const body: bodyLogin = {
        email: `${email.value}`,
        otp: `${OtpInput.value}`,
      };
      AuthService.login(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('auth.loginSuccess'));
            setToken(JSON.stringify(res.data));
            mainStore.getInfoUser();
            mainStore.setInfoFcmToken();
            if (route.query.urlPath) {
              gotoUrlPath({ router, urlPath: route.query.urlPath });
              return;
            }
            workspaceStore.checkWorkspaceWithLogin();
          } else {
            errorOtp.value = true;
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(`${t('auth.loginFailed')}`);
        });
    };

    const handleOtp = (otp: string) => {
      OtpInput.value = otp;
      errorOtp.value = false;
      if (!route?.query?.type || !email.value) return;
      if (route.query.type === TYPE_REGISTER) {
        handleRegister();
      }
      if (route.query.type === TYPE_LOGIN) {
        handleLogin();
      }
    };
    const resendOtp = () => {
      otpResend.value = true;
      errorOtp.value = false;
      const body: bodyOtp = {
        email: `${email.value}`,
        type: `${route.query.type}`,
      };
      AuthService.otp(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            OtpInput.value = '';
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(`${t('auth.resendFailed')}`);
        });
    };

    return {
      OtpInput,
      email,
      errorOtp,
      otpResend,
      handleOtp,
      resendOtp,
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
      color: #2f2f2f;
      padding-bottom: 8px;

      &.error-code {
        color: #f44436;
      }
    }

    .block-status {
      color: #2f2f2f;
      font-weight: 400;

      strong {
        font-weight: 500;
      }
    }

    .block-otp {
      margin: 24px 0;

      &.error-code {
        :deep(.q-field__control) {
          border-color: #f44436;
        }
      }

      :deep(.q-field) {
        margin: 0 8px;
      }

      :deep(.q-field__control) {
        height: 88px;
        color: #1c8c44;
        border: 1px solid #878b87;

        &.error-code {
          border-color: #f44436;
        }
      }

      :deep(.q-field__native) {
        font-size: 38px;
        font-weight: 500;
      }
    }

    .last-elm {
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
