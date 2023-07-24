<template>
  <div class="create-ctrl column items-center justify-center">
    <div class="create-top">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="create-bottom text-center">
      <div class="create-title">{{ $t('workspace.workspace.create') }}</div>
      <div class="create-avatar">
        <q-avatar
          v-if="thumbnailUrl"
          size="128px"
        >
          <img
            :src="thumbnailUrl"
            alt=""
          />
        </q-avatar>
        <q-avatar
          v-else
          size="128px"
        >
          <img
            src="~assets/default/upload.svg"
            alt=""
          />
        </q-avatar>
      </div>
      <div class="create-upload">
        <C-upload
          @get-file="uploadImg"
          borderless
          accept=".jpg, image/*"
        >
          <template #action="{ handleUpload }">
            <c-btn
              v-if="thumbnailUrl"
              :label="'Change workspace’s image'"
              icon="bi-upload"
              flat
              size="small"
              @click="handleUpload"
              class="handle-upload"
            />
            <c-btn
              v-else
              :label="'Upload workspace’s image'"
              icon="bi-upload"
              flat
              size="small"
              @click="handleUpload"
              class="handle-upload"
            />
          </template>
        </C-upload>
      </div>
      <q-input
        class="create-input"
        outlined
        v-model="formModel.nameWorkSpace"
        label="Workspace name"
        color="green-6"
        @keyup.enter.stop="createWorkSpace"
      />
      <q-btn
        :disabled="!checkData(formModel)"
        @click="createWorkSpace"
        class="create-btn"
      >
        {{ $t('workspace.workspace.createWorkspace') }}
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { checkData } from 'src/helper/global.js';
import { defineComponent, reactive, toRefs } from 'vue';
import WorkspaceService from 'src/services/workspace';
import { bodyWorkspace } from 'src/services/workspace/model';
import NotifyServices from 'src/plugins/NotifyServices';
import { useRouter } from 'vue-router';

interface formCreateWorkSpace {
  nameWorkSpace: string;
}
export default defineComponent({
  name: 'CreateWorkspace',
  components: {},
  setup() {
    const state = reactive<{
      formModel: formCreateWorkSpace;
      thumbnailId: number;
      thumbnailUrl: string;
    }>({
      formModel: { nameWorkSpace: '' },
      thumbnailId: 0,
      thumbnailUrl: '',
    });

    const router = useRouter();

    const createWorkSpace = () => {
      if (!checkData(state.formModel)) return;
      console.log('createWorkSpace');
      const body: bodyWorkspace = {
        name: state.formModel.nameWorkSpace.trim() || '',
        thumbnail_id: state.thumbnailId || null,
      };
      WorkspaceService.createWorkspace(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            router.push({
              name: 'workspace',
              params: {
                workspaceId: res.data.id,
              },
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };
    const uploadImg = (listImg: any) => {
      console.log('listImg', listImg);
      state.thumbnailId = listImg[0].id;
      state.thumbnailUrl = listImg[0].url;
    };

    return {
      ...toRefs(state),
      checkData,
      createWorkSpace,
      uploadImg,
    };
  },
});
</script>

<style scoped lang="scss">
.create-ctrl {
  height: 100vh;
  .create-top {
    padding-bottom: 48px;
  }
  .create-bottom {
    display: flex;
    flex-direction: column;

    .create-title {
      font-size: 38px;
      font-weight: 500;
      line-height: 46px;
      padding-bottom: 32px;
    }

    .create-avatar {
      margin-bottom: 8px;
      img {
        object-fit: cover;
      }
    }

    .create-upload {
      display: flex;
      justify-content: center;
      padding-bottom: 44px;
      .create-upload__vector {
        width: 16px;
        height: 15px;
        margin-right: 4px;
      }
      .create-upload__filter {
        width: 171px;
        height: 22px;
      }
      .handle-upload {
        background: #f8f8f8;
        color: #565656;
      }
    }
    .create-input {
      margin-bottom: 24px;

      :deep(.q-field__label) {
        font-size: 14px;
      }
    }

    .create-btn {
      background-color: #1c8c44;
      color: #fff;
      border: none;
      height: 48px;
      width: 437px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
  }

  .q-btn {
    text-transform: none;
  }
}
</style>
