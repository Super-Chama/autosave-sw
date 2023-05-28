<script setup>
import { reactive, defineProps, defineEmits } from 'vue'
import { OxdDialog, OxdText, OxdCardTable } from '@ohrm/oxd'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const state = reactive({
  headers: [
    {
      name: 'clientId',
      title: 'ID',
      style: {
        flex: '20%'
      }
    },
    {
      name: 'body',
      title: 'Data',
      style: {
        flex: '50%'
      },
      cellType: 'oxd-table-cell-truncate',
    },
    {
      name: 'time',
      title: 'Timestamp',
      style: {
        flex: '20%'
      }
    },
    {
      name: 'actions',
      title: 'Actions',
      style: { flex: '10%' },
      cellType: 'oxd-table-cell-actions',
      cellConfig: {
        delete: {
          onClick(item) {
            emit('close', item)
          },
          component: 'oxd-icon-button',
          props: {
            name: 'arrow-counterclockwise'
          }
        }
      }
    }
  ]
})
</script>

<template>
  <oxd-dialog @update:show="$emit('close')" :style="{ maxWidth: '800px', padding: '0' }">
    <div class="orangehrm-modal-header">
      <oxd-text type="card-title"> Unsaved data found </oxd-text>
    </div>
    <div class="orangehrm-modal-body">
      <oxd-card-table :selectable="false" :items="data" :headers="state.headers" />
    </div>
  </oxd-dialog>
</template>
