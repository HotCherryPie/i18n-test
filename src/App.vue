<script setup lang="ts">
import { ref } from 'vue';

import { I18nProvider } from '@/i18n';

import Test1 from './components/Test1.vue';

const locale = ref('en-US');
</script>

<template>
  <select v-model="locale">
    <option value="en-US">en-US</option>
    <option value="ru-RU">ru-RU</option>
  </select>

  <I18nProvider :locale="locale">
    <Test1 />
  </I18nProvider>
</template>
