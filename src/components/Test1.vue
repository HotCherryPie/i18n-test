<template>
  <div>{{ locale.toString() }}</div>
  <div>Hello {{ str.stringA }}</div>
  <div>{{ typeof promise }}</div>
  <div>{{ promise === p2 }}</div>
</template>

<script setup>
import { useTranslations } from '@/hooks';
import { useI18n } from '@/i18n';

const { locale } = useI18n();
const [str, { promise }] = useTranslations('common');
const [, { promise: p2 }] = useTranslations('common');
</script>
