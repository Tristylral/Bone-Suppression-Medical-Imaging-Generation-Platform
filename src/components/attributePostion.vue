<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>位置信息</h3> -->
    <Divider plain orientation="left">
      <h4>{{ $t('location_information') }}</h4>
    </Divider>
    <!-- 通用属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <Row :gutter="10">
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.left"
            @on-change="(value) => changeCommon('left', value)"
            :append="$t('left')"
          ></InputNumber>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.top"
            @on-change="(value) => changeCommon('top', value)"
            :append="$t('top')"
          ></InputNumber>
        </Col>
      </Row>
      <Form :label-width="70" class="form-wrap">
        <FormItem :label="$t('angle')">
          <Slider
            v-model="baseAttr.angle"
            :max="360"
            @on-input="(value) => changeCommon('angle', value)"
          ></Slider>
        </FormItem>
        <FormItem :label="$t('opacity')">
          <Slider
            v-model="baseAttr.opacity"
            @on-input="(value) => changeCommon('opacity', value)"
          ></Slider>
        </FormItem>
      </Form>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select';
import InputNumber from '@/components/inputNumber';

const update = getCurrentInstance();
const { mixinState, canvasEditor } = useSelect();

// 可修改的元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
  'thinTailArrow',
];

// 属性值
const baseAttr = reactive({
  opacity: 0,
  angle: 0,
  left: 0,
  top: 0,
  rx: 0,
  ry: 0,
});

// 重置所有属性
const resetAttributes = () => {
  baseAttr.opacity = 100;
  baseAttr.angle = 0;
  baseAttr.left = 0;
  baseAttr.top = 0;
  baseAttr.rx = 0;
  baseAttr.ry = 0;
};

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject && baseType.includes(activeObject.type)) {
    baseAttr.opacity = activeObject.get('opacity') * 100;
    baseAttr.left = activeObject.get('left');
    baseAttr.top = activeObject.get('top');
    baseAttr.angle = activeObject.get('angle') || 0;
  }
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    // 透明度特殊转换
    if (key === 'opacity') {
      activeObject && activeObject.set(key, value / 100);
      canvasEditor.canvas.renderAll();
      return;
    }
    // 旋转角度适配
    if (key === 'angle') {
      activeObject.rotate(value);
      canvasEditor.canvas.renderAll();
      return;
    }
    activeObject && activeObject.set(key, value);
    canvasEditor.canvas.renderAll();
  }
};

const selectCancel = () => {
  update?.proxy?.$forceUpdate();
};

defineExpose({
  resetAttributes,
});

onMounted(() => {
  // 获取字体数据
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

<style scoped lang="less">
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
