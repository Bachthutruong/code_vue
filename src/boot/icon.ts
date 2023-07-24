import { Quasar } from 'quasar';
import { boot } from 'quasar/wrappers';

import iconSet from 'quasar/icon-set/fontawesome-v6';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';

export default boot(({ app }) => {
  app.use(Quasar, {
    iconSet: iconSet,
  });
});
