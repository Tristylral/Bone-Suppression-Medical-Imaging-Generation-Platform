<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-05-20 09:18:28
 * @LastEditors: yrh
 * @LastEditTime: 2023-07-29 22:24:03
-->
<template>
  <Dropdown placement="bottom-end" @on-click="setLang">
    <Button type="text">
      {{ lang }}
      <Icon type="ios-arrow-down"></Icon>
    </Button>
    <template #list>
      <DropdownMenu>
        <DropdownItem v-for="lang in langList" :key="lang.langType" :name="lang.langType">
          {{ lang.langName }}
        </DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>

<script setup name="saveBar">
import { setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';

import { useI18n } from 'vue-i18n';

//创建实例对象
const { locale } = useI18n();

//组合语言包对象
const LANGMAP = {
  zh: '中文',
  en: 'En',
};

let langList = reactive(
  Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] }))
);

const lang = computed(() => {
  return LANGMAP[locale.value];
});

// 设置语言
const setLang = (type) => {
  locale.value = type;
  setLocal(LANG, type);
};
</script>

<style scoped lang="less"></style>
