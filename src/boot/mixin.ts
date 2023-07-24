import { boot } from 'quasar/wrappers';

export default boot(({ app, router, redirect }) => {
  app.mixin({
    computed: {
      getRouterName(): string {
        return this.$route.name;
      },
      isMobile(): boolean {
        return this.$q.platform?.is?.mobile || false;
      },
      app_type() {
        return this.$q?.platform?.is?.mobile ? 'mobile' : 'web';
      },
    },
    methods: {},
  });
});
