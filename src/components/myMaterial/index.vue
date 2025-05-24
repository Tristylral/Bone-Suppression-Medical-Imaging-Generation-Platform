<template>
  <div class="my-material" v-if="isLogin">
    <Tabs v-model="type">
      <TabPane :label="$t('image')" name="img">
        <uploadMaterial v-if="type === 'img'" @imageChange="imageChange"></uploadMaterial>
      </TabPane>
    </Tabs>
  </div>
  <div class="tip" v-else>{{ $t('logP') }}</div>
</template>

<script setup name="ImportTmpl">
import { getFileList } from '@/api/user';
import uploadMaterial from './uploadMaterial';
const emit = defineEmits();

const type = ref('img');
const isLogin = ref(false);
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then(() => {
      isLogin.value = true;
    })
    .catch(() => {
      isLogin.value = false;
    });
};
const imageChange = (src) => {
  emit('imageChange', src);
};
getFileListHandle();
</script>

<style scoped lang="less">
.tip {
  padding: 20px;
  text-align: center;
}
</style>
