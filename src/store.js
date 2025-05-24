import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    message: 'Hello from Store',
  }),
  actions: {
    updateMessage(newMessage) {
      this.message = newMessage;
    },
  },
});
