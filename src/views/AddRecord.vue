<script setup>
import {
  OxdForm,
  OxdText,
  OxdButton,
  OxdDivider,
  OxdFormRow,
  OxdInputField,
  OxdFormActions,
  OxdSwitchInput
} from '@ohrm/oxd'
import axios from 'axios'
import { onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { queryLastRecords } from '@/utils/helper.js'
import useBeforeUnload from '@/utils/useBeforeUnload.js'
import RecoverModal from '@/components/RecoverModal.vue'

let isChangesSaved = false

const rules = {
  title: [(value) => (!!value && value.trim() !== '') || 'Required']
}

const router = useRouter()
const { registerUnloadEvent } = useBeforeUnload(() => isChangesSaved)

const state = reactive({
  error: false,
  loading: false,
  modalState: null,
  jobTitle: {
    title: '',
    description: '',
    specification: null,
    note: ''
  }
})

const onSave = () => {
  isChangesSaved = true
  state.loading = true
  const code = state.error ? 500 : 200
  axios
    .post(`https://dummyjson.com/http/${code}`, {
      ...state.jobTitle
    })
    .finally(() => {
      onCancel()
    })
}

const onCancel = () => {
  router.push({
    name: 'home'
  })
}

const onCloseModal = ($event) => {
  state.modalState = null
  if ($event && $event.body) {
    state.jobTitle = {
      ...JSON.parse($event.body)
    }
  }
}

onBeforeMount(() => {
  queryLastRecords().then((value) => {
    if (Array.isArray(value) && value.length > 0) state.modalState = value
  })
})
</script>

<template>
  <div class="header">
    <oxd-text tag="h5">Add Job Title</oxd-text>
    <oxd-switch-input v-model="state.error" option-label="Error" label-position="left" />
  </div>
  <oxd-divider />

  <oxd-form :loading="state.loading" @submitValid="onSave">
    <oxd-form-row>
      <oxd-input-field
        label="Job Title"
        v-model="state.jobTitle.title"
        @input="registerUnloadEvent"
        :rules="rules.title"
        required
      />
    </oxd-form-row>

    <oxd-form-row>
      <oxd-input-field
        type="textarea"
        label="Job Description"
        placeholder="Type description here"
        v-model="state.jobTitle.description"
      />
    </oxd-form-row>

    <oxd-form-row>
      <oxd-input-field
        type="file"
        label="Job Specification"
        buttonLabel="Browse"
        v-model="state.jobTitle.specification"
      />
    </oxd-form-row>

    <oxd-form-row>
      <oxd-input-field
        type="textarea"
        label="Note"
        placeholder="Add note"
        v-model="state.jobTitle.note"
      />
    </oxd-form-row>

    <oxd-divider />

    <oxd-form-actions>
      <oxd-button displayType="ghost" label="Cancel" @click="onCancel" />
      <oxd-button displayType="secondary" label="Add" type="submit" class="orangehrm-left-space" />
    </oxd-form-actions>
  </oxd-form>

  <recover-modal v-if="state.modalState" :data="state.modalState" @close="onCloseModal" />
</template>
