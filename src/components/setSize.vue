<!--
 * @Author: yrh
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: yrh
 * @LastEditTime: 2024-05-21 15:38:38
 * @Description: 尺寸设置
-->

<template>
  <div v-if="!mixinState.mSelectMode" class="attr-item-box">
    <!-- <h3>{{ $t('bgSeting.size') }}</h3> -->
    <Divider plain orientation="left">
      <h4>{{ $t('bgSetting_size') }}</h4>
    </Divider>
    <Form :label-width="40" inline class="form-wrap">
      <FormItem :label="$t('width')" prop="name">
        <InputNumber disabled v-model="width" readonly @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
        <InputNumber disabled v-model="height" readonly @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="text" @click="showSetSize">
          <Icon type="md-create" />
        </Button>
      </FormItem>
    </Form>

    <!-- <Divider plain></Divider> -->
    <!-- 修改尺寸 -->
    <modalSzie :title="$t('setSizeTip')" ref="modalSizeRef" @set="handleConfirm"></modalSzie>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select';
import modalSzie from '@/components/common/modalSzie';

const { mixinState, canvasEditor } = useSelect();

const DefaultSize = {
  width: 900,
  height: 900,
};

const modalSizeRef = ref(null);

let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);

onMounted(() => {
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on('sizeChange', (w, h) => {
    width.value = w;
    height.value = h;
  });
});

const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
};

const showSetSize = () => {
  modalSizeRef.value.showSetSize(width.value, height.value);
};
const handleConfirm = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
};
</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
}

:deep(.ivu-input-number) {
  margin-left: 10px;
  width: 60px;
}
.form-wrap {
  display: flex;
}
</style>
