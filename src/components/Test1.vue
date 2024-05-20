<template>
  <div>Hello {{ str.stringA }}</div>
</template>

<script setup>
import { useTranslations } from '@/hooks/useTranslations';

const { str, promise } = useTranslations('common');
</script>
