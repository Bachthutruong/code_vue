import { defineStore } from 'pinia';

export interface State {
  lang: string;
}

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () =>
    ({
      lang: 'en',
    } as State),

  getters: {
    getLang: (state) => {
      return state.lang;
    },
  },

  actions: {
    async changeLanguages(languages: string, that: any) {
      this.lang = languages;
      that.$i18n.locale = languages;
      console.log('languages', this.lang);
    },
  },
});
