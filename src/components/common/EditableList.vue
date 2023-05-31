<template>
  <div class="editable-list">
    <DataTable
      class="editable-list__table"
      :items="processedItems"
      :headers="headers"
      :loading="loading"
    >
      <template #top-panel>
        <button
          v-if="showCreateButton"
          class="editable-list__top-panel-button"
          @click="openModal"
        >
          <FontAwesomeIcon icon="plus" />
          Добавить
        </button>
      </template>

      <template v-slot:actions="{ row, index }">
        <div
          v-if="showEditButton || showDeleteButton"
          class="editable-list__table-buttons"
        >
          <button
            class="editable-list__table-button"
            @click="openModal(row.id, index)"
          >
            <FontAwesomeIcon icon="pencil" />
          </button>

          <button
            v-if="showDeleteButton"
            class="editable-list__table-button"
            @click="openDeleteModal(row.id)"
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </div>
      </template>
    </DataTable>
    <ModalComponent
      class="editable-list-modal"
      modalTitle="Удаление записи"
      :show="showDeleteModal"
      @closeModal="onCancelDeleteItem"
    >
      <template #body>
        <div class="editable-list-modal__content">
          Вы действительно хотите удалить запись?
        </div>
      </template>
      <template #footer>
        <div class="editable-list-modal__actions">
          <ButtonComponent
            text="Ок"
            class="editable-list-modal__button"
            @click="onConfirmDeleteItem"
          />
          <ButtonComponent
            text="Отмена"
            class="editable-list-modal__button"
            @click="onCancelDeleteItem"
          />
        </div>
      </template>
    </ModalComponent>
    <ModalComponent
      class="editable-list-modal"
      :modal-title="modalTitle"
      :show="showModalForm"
      v-model:values="modalForm"
      @closeModal="onCloseModalForm"
    >
      <template #body>
        <div
          v-for="field in modalFields"
          class="editable-list-modal__field-row"
        >
          <p class="editable-list-modal__field-label">{{ field.label }}</p>
          <input
            v-if="field.type === 'text'"
            class="editable-list-modal__field-input"
            v-model="modalForm[field.key]"
          />
          <Datepicker
            v-else-if="field.type === 'date'"
            class="editable-list-modal__field-input"
            inputFormat="dd.MM.yyyy"
            v-model="modalForm[field.key]"
          />
        </div>
      </template>
      <template #footer>
        <div class="editable-list-modal__actions">
          <ButtonComponent
            text="Сохранить"
            class="editable-list-modal__button"
            @click="onSaveModalForm"
          />
          <ButtonComponent
            text="Отмена"
            class="editable-list-modal__button"
            @click="onCloseModalForm"
          />
        </div>
      </template>
    </ModalComponent>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { useNotification } from "@kyvg/vue3-notification";

import Datepicker from "vue3-datepicker";

import DataTable from "@/components/common/DataTable.vue";
import ModalComponent from "@/components/common/ModalComponent.vue";
import ButtonComponent from "@/components/common/ButtonComponent.vue";

import type { HeaderTypes, modalFieldsTypes } from "@/types/TableTypes";
import type { UserParams } from "@/types/UserTypes";
const { notify } = useNotification();
import { format } from "date-fns";

const emit = defineEmits<{
  (e: "deleteItem", id: number): void;
  (e: "editItem", id: number, params: UserParams): void;
  (e: "createItem", params: UserParams): void;
}>();

interface Props {
  headers: HeaderTypes[];
  items: any[];
  loading: boolean;
  modalFields: modalFieldsTypes[];
  showEditButton: boolean;
  showDeleteButton: boolean;
  showCreateButton: boolean;
}
const props = defineProps<Props>();

const processedItems = computed(() => {
  if (!props.items.length) return [];
  return props.items.map((item: any) => {
    return {
      ...item,
      dateBirth: format(new Date(item.dateBirth), "dd.MM.yyyy"),
    };
  });
});

const modalTitle = ref("");
const showModalForm = ref(false);
const showDeleteModal = ref(false);
const currentItemId = ref();
let modalForm = reactive({} as any);

const openModal = (id: number, index: number) => {
  if (index !== null && index !== undefined) {
    currentItemId.value = id;
    modalForm = reactive({ ...props.items[index] });
    modalTitle.value = "Редактирование пользователя";
    delete modalForm.id;
  } else {
    modalTitle.value = "Создание пользователя";
    for (let i in props.modalFields) {
      modalForm = reactive({
        ...modalForm,
        [props.modalFields[i].key]: "",
      });
    }
  }
  showModalForm.value = true;
};

const onCloseModalForm = () => {
  currentItemId.value = null;
  showModalForm.value = false;
  modalForm = {};
};

const validateForm = () => {
  const mandatoryFields = props.modalFields
    .filter((item) => item.required)
    .map((item) => {
      return { key: item.key, label: item.label };
    });

  const emptyFields = mandatoryFields.filter((item) => {
    return !modalForm[item.key];
  });

  let message = null;
  if (emptyFields.length) {
    message = `Не заполнены обязательные поля: ${emptyFields
      .map((item) => item.label)
      .join(", ")}`;
  }
  return message;
};

const onSaveModalForm = () => {
  const text = validateForm();

  if (text) {
    notify({
      title: "Ошибка!",
      text,
      type: "error",
      duration: 2000,
    });
    return;
  } else {
    if (currentItemId.value !== null && currentItemId.value !== undefined) {
      emit("editItem", currentItemId.value, modalForm);
    } else {
      emit("createItem", modalForm);
    }
    showModalForm.value = false;
    modalForm = {};
  }
};

const openDeleteModal = (id: number) => {
  showDeleteModal.value = true;
  currentItemId.value = id;
};

const onConfirmDeleteItem = () => {
  emit("deleteItem", currentItemId.value);
  showDeleteModal.value = false;
};

const onCancelDeleteItem = () => {
  showDeleteModal.value = false;
};
</script>

<style lang="scss">
.editable-list__table-buttons {
  display: inline-flex;
}
.editable-list__table-button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: #242121d1;
  @media screen and (max-width: 425px) {
    svg {
      width: 13px;
    }
  }
}
.editable-list {
  .modal__content {
    width: 400px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
}
.editable-list__table table {
  table-layout: fixed;
  th {
    &:last-child {
      width: 100px;
      @media screen and (max-width: 768px) {
        width: 70px;
      }
    }
  }
}
.editable-list__actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.editable-list__content {
  margin-bottom: 50px;
  text-align: center;
}
.editable-list__button {
  width: 100px;
  height: 27px;
}
.editable-list-modal__field-row {
  margin-bottom: 10px;
}
.editable-list-modal__field-label {
  margin-bottom: 3px;
  font-size: 14px;
}
.editable-list-modal__field-input {
  width: 100%;
  height: 27px;

  padding: 3px 5px;

  border-radius: 3px;
  border: 1px solid grey;
}
.editable-list-modal__actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
}
.editable-list-modal__button {
  width: 140px;
  height: 30px;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
}
.editable-list__top-panel-button {
  width: 125px;
  height: 27px;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
