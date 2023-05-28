<script setup>
import { OxdGrid } from '@ohrm/oxd'
import { RouterView } from 'vue-router'
import Logger from '@/components/Logger.vue'
</script>

<template>
  <oxd-grid :cols="2">
    <div class="form">
      <RouterView />
    </div>
    <div class="events">
      <Logger />
    </div>
  </oxd-grid>
</template>

<style>
html,
body {
  padding: 0;
  margin: 1rem;
  background-color: #e8eaef;
}
.form,
.events {
  padding: 1.5rem;
  box-sizing: border-box;
  background-color: #fff;
  min-height: calc(100vh - 4rem);
}
.events {
  margin: 0;
  margin-left: 1rem;
}
.orangehrm-left-space {
  margin-left: 10px;
}
.header {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
.orangehrm-modal-header {
  padding: 1.2rem;
  padding-bottom: 0.6rem;
}
.orangehrm-modal-body {
  background-color: #f6f5fb;
  padding: 1.2rem;
  border-bottom-left-radius: 1.2rem;
  border-bottom-right-radius: 1.2rem;
}
</style>
