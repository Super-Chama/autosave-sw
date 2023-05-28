<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { OxdText } from '@ohrm/oxd'
import {logs, registerServiceWorker} from '@/utils/helper.js'

registerServiceWorker();
</script>

<template>
  <div class="log-wrapper">
    <div v-for="log in logs" :key="log.time">
      <oxd-text tag="span" class="time"> {{ log.time.toLocaleTimeString() }}&nbsp;</oxd-text>
      <oxd-text tag="span" class="message">
        {{ log.message }}
      </oxd-text>
    </div>
  </div>
</template>

<style scoped>
.log-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
}
.time,
.message {
  font-size: 0.75rem;
  margin-bottom: 2px;
}
.time {
  font-weight: 700;
}
</style>
