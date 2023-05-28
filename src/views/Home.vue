<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { OxdButton } from '@ohrm/oxd'
import { RouterLink } from 'vue-router'
</script>

<template>
  <router-link to="/add" v-slot="{ navigate }">
    <oxd-button label="Add Record" @click="navigate" />
  </router-link>
</template>
