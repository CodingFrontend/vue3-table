<template>
  <div class="users-list">
    <h1 class="users-list__title">Пользователи</h1>
    <EditableList
      :items="processedItems"
      :modalFields="modalFields"
      :headers="tableHeaders"
      :loading="isLoading"
      showEditButton
      showDeleteButton
      showCreateButton
      @deleteItem="onDeleteItem"
      @editItem="onEditItem"
      @createItem="onCreateItem"
    />
  </div>
</template>
<script setup lang="ts">
import EditableList from "@/components/common/EditableList.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { useUsersStore } from "@/stores/users";
import { storeToRefs } from "pinia";

import type { UserParams } from "@/types/UserTypes";

const tableHeaders = reactive([
  {
    text: "Фамилия",
    alias: "lastName",
  },
  {
    text: "Имя",
    alias: "name",
  },
  {
    text: "Дата рождения",
    alias: "dateBirth",
  },
  {
    text: "",
    alias: "actions",
  },
]);
const modalFields = reactive([
  {
    type: "text",
    key: "lastName",
    label: "Фамилия",
    required: true,
  },
  {
    type: "text",
    key: "name",
    label: "Имя",
  },
  {
    type: "date",
    key: "dateBirth",
    label: "Дата рождения",
    required: true,
  },
]);
const isLoading = ref(false);
const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);
const { getAllUsers, deleteUser, updateUser, addUser } = usersStore;

const processedItems = computed(() => {
  if (!users.value.length) return [];
  return users.value.map((item: any) => {
    return {
      ...item,
      dateBirth: new Date(item.dateBirth),
    };
  });
});

const onDeleteItem = (id: number) => {
  deleteUser(id).then(() => {
    getAllUsers();
  });
};

const onEditItem = (id: number, params: UserParams) => {
  updateUser(id, params).then(() => {
    getAllUsers();
  });
};

const onCreateItem = (params: UserParams) => {
  addUser(params).then(() => {
    getAllUsers();
  });
};

onMounted(() => {
  isLoading.value = true;
  getAllUsers().then(() => {
    isLoading.value = false;
  });
});
</script>
<style lang="scss" scoped>
.users-list {
  padding: 0 20px;
  width: 100%;
  height: 100%;
  @media screen and (max-width: 768px) {
    padding: 0;
  }
}

.users-list__title {
  margin-bottom: 30px;

  @media screen and (max-width: 425px) {
    font-size: 25px;
  }
}
</style>
