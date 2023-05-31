<template>
  <div class="table-wrapper">
    <slot name="top-panel"></slot>
    <table class="table">
      <thead class="table__head">
        <tr>
          <th
            v-for="(headCell, headerIndex) in headers"
            :key="headerIndex"
            class="table__head-cell"
          >
            {{ headCell.text }}
          </th>
        </tr>
      </thead>
      <tbody class="table__body">
        <template v-if="items.length">
          <tr
            class="table__body-row"
            v-for="(row, rowIndex) in items"
            :key="rowIndex"
          >
            <td
              v-for="(headCell, headerIndex) in headers"
              :key="headerIndex"
              class="table__body-cell"
            >
              <slot :name="headCell.alias" :row="row" :index="rowIndex">
                {{ row[headCell.alias] }}
              </slot>
            </td>
          </tr>
        </template>
        <tr v-else-if="loading" class="table__empty-row">
          <td class="table__empty-cell" :colspan="headers.length">
            Загрузка...
          </td>
        </tr>
        <tr v-else class="table__empty-row">
          <td class="table__empty-cell" :colspan="headers.length">
            Результатов не найдено
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
interface HeaderTypes {
  text?: string;
  alias: string;
}
interface Props {
  headers: HeaderTypes[];
  items: any[];
  loading: boolean;
}
defineProps<Props>();
</script>

<style lang="scss">
.table-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.table {
  background-color: #d9d9d9;
  border: 1px solid #000000;
  width: 100%;
}
.table__head {
  height: 35px;
}
.table__head-cell-icon {
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.table__head-cell {
  padding: 0 5px;
  font-weight: 500;
  text-align: center;
  border-right: 1px solid #000000;
  &:first-child,
  &:last-child {
    border-left: 1px solid #000000;
  }

  @media screen and (max-width: 425px) {
    font-size: 12px;
    padding: 0 3px;
  }
}
.table__body-cell {
  padding: 12px 5px;
  word-break: break-word;
  border: 1px solid #000000;
  text-align: center;

  @media screen and (max-width: 425px) {
    font-size: 12px;
    padding: 10px 3px;
  }
}
.table__empty-row {
  text-align: center;
  border-top: 1px solid #000000;
  font-size: 20px;
}
.table__empty-cell {
  padding: 20px;
}
</style>
