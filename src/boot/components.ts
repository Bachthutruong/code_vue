import { boot } from 'quasar/wrappers';
import CButton from 'src/components/common/CButton.vue';
import CTextField from 'src/components/common/CTextField.vue';
import CBreadcrumbs from 'src/components/common/CBreadcrumbs.vue';
import CModal from 'src/components/common/CModal.vue';
import CConfirm from 'src/components/common/CConfirm.vue';
import CSelect from 'src/components/common/CSelect.vue';
import CAvatar from 'src/components/common/CAvatar.vue';
import CDatePicker from 'src/components/common/CDatePicker.vue';
import CTextArea from 'src/components/common/CTextArea.vue';
import CUpload from 'src/components/common/CUpload.vue';
import CTooltip from 'src/components/common/CTooltip.vue';
import MenuClick from 'components/general/MenuClick.vue';
import CDateTimePicker from 'components/common/CDateTimePicker.vue';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';
import { defineAsyncComponent } from 'vue';
export default boot(({ app }) => {
  app.use(FloatingVue);

  app.component('CBtn', CButton);
  app.component('CTextField', CTextField);
  app.component('CBreadcrumbs', CBreadcrumbs);
  app.component('CModal', CModal);
  app.component('CSelect', CSelect);
  app.component('CAvatar', CAvatar);
  app.component('CDatePicker', CDatePicker);
  app.component('CDateTimePicker', CDateTimePicker);
  app.component('CTextArea', CTextArea);
  app.component('CUpload', CUpload);
  app.component('CTooltip', CTooltip);
  app.component('CConfirm', CConfirm);
  app.component(
    'MenuHoverChat',
    defineAsyncComponent(() => import('components/chat/MenuHoverChat.vue')),
  );
  app.component('MenuClick', MenuClick);
  app.component(
    'AppPickerComposition',
    defineAsyncComponent(() => import('components/emoji/AppPickerComposition.vue')),
  );
  app.component(
    'AppPickerOptions',
    defineAsyncComponent(() => import('components/emoji/AppPickerOptions.vue')),
  );
});
