<template>
  <div>Hello {{ str.stringA }}</div>
</template>

<script setup>
import { useTranslations } from '@/hooks';

const [str, { promise }] = useTranslations('common');
</script>
