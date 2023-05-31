import { defineStore, createPinia, setActivePinia } from "pinia";

setActivePinia(createPinia());

import UsersDataService from "@/api/services/UsersDataService";

import type { UserTypes, UserParams } from "@/types/UserTypes";

export interface UsersState {
  users: UserTypes[];
  loading: boolean;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: [],
    loading: false,
  }),

  actions: {
    async getAllUsers() {
      this.loading = true;

      try {
        const users = await UsersDataService.getAllUsers();
        this.users = users.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addUser(params: UserParams) {
      try {
        await UsersDataService.addUser(params);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteUser(id: number) {
      try {
        await UsersDataService.deleteUser(id);
      } catch (error) {
        console.error(error);
      }
    },

    async updateUser(id: number, params: UserParams) {
      try {
        await UsersDataService.updateUser(id, params);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
