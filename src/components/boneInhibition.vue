<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <Divider plain orientation="left">
      <h4>{{ $t('boneInhibitionRate') }}</h4>
    </Divider> -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <Form :label-width="70" class="form-wrap">
        <FormItem :label="$t('boneInhibitionRate')">
          <Slider
            v-model="baseAttr.boneInhibitionRate"
            :max="100"
            @on-change="(value) => postToServer(value)"
          ></Slider>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script setup name="boneInhibition">
import useSelect from '@/hooks/select';
import { postBoneInhibition, getNewBoneInhibition } from '@/api/material';
import { ref } from 'vue';

const { mixinState, canvasEditor } = useSelect();
const update = getCurrentInstance();

// 可修改的元素
const baseType = ['image'];

// 属性值
const baseAttr = ref({
  boneInhibitionRate: 100,
});

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject && baseType.includes(activeObject.type)) {
    baseAttr.boneInhibitionRate = activeObject.get('boneInhibitionRate');
  }
};

const emit = defineEmits();
const newBoneUrl = new Image();
//提交获取的骨抑制率，还要一个url
const postToServer = (value) => {
  emit('change-state', value);
};

const selectCancel = () => {
  update?.proxy?.$forceUpdate();
};

onMounted(() => {
  getObjectAttr();
  canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel);
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>
<style scoped>
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-slider-wrap) {
  margin-left: 10px;
  width: 180px;
}
.ivu-form-item {
  background: #f6f7f9;
  border-radius: 5px;
  padding: 0 5px;
  margin-bottom: 10px;
}

.ivu-row {
  margin-bottom: 10px;
}
</style>
