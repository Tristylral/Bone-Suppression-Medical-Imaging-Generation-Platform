<!--
 * @Author: yrh
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: yrh
 * @LastEditTime: 2024-05-11 19:09:45
 * @Description: 公共尺寸
-->

<template>
  <Modal v-model="modal" :title="props.title" footer-hide>
    <h3>
      {{ $t('customSize') }}
    </h3>
    <Form ref="formInline" inline :label-width="50">
      <FormItem :label="$t('width')">
        <InputNumber v-model="width" :min="1" :placeholder="$t('input')"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')">
        <InputNumber v-model="height" :min="1" :placeholder="$t('input')"></InputNumber>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="primary" @click="customSizeCreate">
          {{ $t('create') }}
        </Button>
      </FormItem>
    </Form>
    <Divider class="divider" />
  </Modal>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';
import { Message } from 'view-ui-plus';
const { canvasEditor } = useSelect();
const emit = defineEmits(['set']);

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const modal = ref(false);
const width = ref(null);
const height = ref(null);
const sizeList = ref([]);
const showSetSize = (w, h) => {
  width.value = w || null;
  height.value = h || null;
  // 获取素材
  canvasEditor.getSizeList().then((res) => {
    sizeList.value = res;
  });
  modal.value = true;
};

const customSizeCreate = async () => {
  if (width.value && height.value) {
    emit('set', width.value, height.value);
    modal.value = false;
  } else {
    Message.warning('请检查尺寸');
  }
};

defineExpose({
  showSetSize,
});
</script>
<style scoped lang="less">
h3 {
  margin-bottom: 10px;
}
.divider {
  margin-top: 0;
}
</style>
