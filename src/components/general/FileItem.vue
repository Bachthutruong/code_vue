<template>
  <div class="file-item cursor-pointer">
    <img
      class="file-item__type"
      :src="imageType.image"
      alt=""
    />
    <div class="file-item-info">
      <p
        v-if="highlightSearch"
        class="file-item-info__name"
        v-highlight="searchText"
        v-html="content"
      ></p>
      <p
        v-else
        class="file-item-info__name"
        v-html="content"
      ></p>
      <p class="file-item-info__created-by">{{ createdBy }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, PropType } from 'vue';
import { IFileItem } from 'src/model/ModelFile';
import { checkFileType, formatDateDisplay } from 'src/helper/global';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

export default {
  name: 'FileItem',

  props: {
    fileData: {
      type: Object as PropType<IFileItem>,
      default: () => ({}),
    },
    highlightSearch: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: any) {
    const i18n = useI18n();

    const imageType = computed(() => {
      const fileType = checkFileType(props.fileData);
      return {
        type: fileType.type,
        image: fileType.image,
      };
    });

    const createdBy = computed(() => {
      const fullName = props.fileData?.uploaded_by?.full_name || '';
      const createdAt = formatDateDisplay(props.fileData?.created_at);
      return i18n.t('global.file.createdBy', [fullName, createdAt]);
    });
    const route = useRoute();
    const searchText = computed(() => {
      if (props.highlightSearch) {
        return route?.query?.keyword || '';
      }
      return '';
    });
    const content = computed(() => {
      return props?.fileData?.originalname;
    });
    return {
      imageType,
      createdBy,
      content,
      searchText,
    };
  },
};
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  &__type {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 8px;
  }
  &-info {
    p {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 0;
    }
    &__name {
      color: #2f2f2f;
      font-weight: 500;
    }
    &__created-by {
      font-weight: 400;
      color: #878b87;
    }
  }
}
</style>
