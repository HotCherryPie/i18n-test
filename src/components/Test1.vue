<template>
  <div>Hello</div>
</template>

<script setup>
import { useTranslations } from '@/hooks/useTranslations';

const x = useTranslations('common');
x.stringA;
</script>
