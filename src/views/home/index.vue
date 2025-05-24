<template>
  <div class="home">
    <Layout>
      <!-- 头部区域 -->
      <Header v-if="state.show">
        <div class="left">
          <logo></logo>
          <Divider type="vertical" />

          <!-- <Divider type="vertical" /> -->

          <myTemplName></myTemplName>
          <!-- 标尺开关 -->
          <div class="griddy">{{ $t('grid') }}</div>
          <Tooltip :content="$t('grid')">
            <iSwitch v-model:first-name="state.ruler" v-model:last-name="state.ruler2" @on-change="rulerSwitch"
              size="small" class="switch"></iSwitch>
          </Tooltip>
          <Divider type="vertical" />
          <history></history>
        </div>

        <div class="right">
          <save></save>
          <login></login>
          <lang></lang>
        </div>
      </Header>
      <Content style="display: flex; height: calc(100vh - 64px)">
        <!-- 左侧区域 -->
        <div v-if="state.show" :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`">
          <!-- 左侧菜单 -->
          <Menu :active-name="menuActive" accordion @on-select="showToolsBar" width="80px">
            <MenuItem v-for="item in leftBar" :key="item.key" :name="item.key" class="menu-item">
            <Icon :type="item.icon" size="24" />
            <div>{{ item.name }}</div>
            </MenuItem>
          </Menu>
          <!-- 左侧组件 -->
          <div class="content" v-show="state.toolsBarShow">
            <div class="left-panel">
              <KeepAlive>
                <component :is="leftBarComponent[menuActive]" @imageChange="imageChange"></component>
              </KeepAlive>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div :class="`close-btn left-btn ${state.toolsBarShow && 'left-btn-open'}`" @click="hideToolsBar"></div>
        </div>

        <div class="workspace-container">
          <div class="resize-container">
            <div ref="workspace2" id="workspace2">
              <div id="canvas123"></div>
            </div>
          </div>

          <Divider type="vertical" class="workspaceDivider" />

          <!-- 画布区域 -->
          <div ref="workspace" id="workspace">
            <div v-if="loading" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
            <div class="canvas-box">
              <canvas id="canvas" :class="state.ruler ? 'design-stage-grid' : ''"></canvas>
              <Button class="reset-btn" @click="resetWorkspace">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M5 5h5v5H9V6.5c-2.35.97-4 3.29-4 6c0 3.58 2.91 6.5 6.5 6.5a6.5 6.5 0 0 0 6.5-6.5c0-3.08-2.14-5.66-5-6.33V5.14c3.42.7 6 3.72 6 7.36c0 4.13-3.36 7.5-7.5 7.5A7.5 7.5 0 0 1 4 12.5C4 9.72 5.5 7.3 7.74 6H5z" />
                </svg>
                <span>复位</span>
              </Button>
              <zoom></zoom>
            </div>
            <Spin size="large" fix :show="spinShow" />
          </div>
        </div>

        <!-- 属性区域 380-->
        <div class="right-bar" v-show="state.attrBarShow">
          <div v-if="state.show" style="padding-top: 10px">
            <!-- 未选择元素时 展示背景设置 -->
            <div v-show="!mixinState.mSelectMode">
              <!-- <set-size></set-size> -->
              <!-- <bg-bar></bg-bar> -->
            </div>

            <!-- 多选时展示 -->
            <div v-show="mixinState.mSelectMode === 'multiple'">
              <!-- 分组 -->
              <group></group>
              <!-- <Divider plain></Divider> -->
              <!-- 组对齐方式 -->
              <align></align>
              <!-- 居中对齐 -->
              <center-align></center-align>
            </div>

            <div v-show="mixinState.mSelectMode === 'one'" class="attr-item-box">
              <!-- <h3>快捷操作</h3> -->
              <!-- 分组 -->
              <group></group>
              <!-- <Divider plain></Divider> -->
              <Divider plain orientation="left">
                <h4>{{ $t('quick_operation') }}</h4>
              </Divider>
              <div class="bg-item" v-show="mixinState.mSelectMode">
                <lock></lock>
                <dele></dele>
                <!-- <clone></clone> -->
                <hide></hide>
                <edit></edit>
              </div>
              <!-- <Divider plain></Divider> -->
              <!-- 居中对齐 -->
              <center-align></center-align>
              <!-- 翻转 -->
              <flip></flip>
              <!-- 条形码属性 -->
              <attributeBarcode></attributeBarcode>
              <!-- 二维码 -->
              <attributeQrCode></attributeQrCode>
              <!-- 图片滤镜 -->
              <filters></filters>
              <!-- 颜色 -->
              <attributeColor></attributeColor>
              <!-- 字体属性 -->
              <attributeFont></attributeFont>
              <!-- 字体小数点 -->
              <attributeTextFloat></attributeTextFloat>
              <!-- 文字内容  -->
              <attribute-text-content></attribute-text-content>
              <!-- 骨抑制率 -->
              <boneInhibition @change-state="changeState"></boneInhibition>
              <!-- 位置信息 -->
              <attributePostion ref="attrPostionRef"></attributePostion>
              <!-- 圆角 -->
              <attributeRounded></attributeRounded>

              <!-- 新增字体样式使用 -->
              <!-- <Button @click="canvasEditor.getFontJson()" size="small">
                {{ $t('get_element_data') }}
              </Button> -->
            </div>
          </div>
          <!-- <attribute v-if="state.show"></attribute> -->
        </div>
        <!-- 右侧关闭按钮 -->
        <div :class="`close-btn right-btn ${state.attrBarShow && 'right-btn-open'}`" @click="switchAttrBar"></div>
      </Content>
    </Layout>
  </div>
</template>

<script name="Home" setup>
import { getToken, getId, setBs, getBs, getCxr } from '@/api/user';
// 导入元素
import importJson from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';
// 路由
import { useRoute } from 'vue-router';

// import fontTmpl from '@/components/fontTmpl.vue';

// 顶部组件
import logo from '@/components/logo.vue';
import align from '@/components/align.vue';
import myTemplName from '@/components/myTemplName.vue';
import centerAlign from '@/components/centerAlign.vue';
// import boneInhibition from '@/components/boneInhibition.vue';
import flip from '@/components/flip.vue';
import save from '@/components/save.vue';
import lang from '@/components/lang.vue';
import clone from '@/components/clone.vue';
import hide from '@/components/hide.vue';
import group from '@/components/group.vue';
import zoom from '@/components/zoom.vue';
import dragMode from '@/components/dragMode.vue';
import lock from '@/components/lock.vue';
import dele from '@/components/del.vue';
import login from '@/components/login';
// 左侧组件
import myMaterial from '@/components/myMaterial/index.vue';
import tools from '@/components/tools.vue';
import bgBar from '@/components/bgBar.vue';
import setSize from '@/components/setSize.vue';
import filters from '@/components/filters.vue';
// import elementData from '@/components/elementData.vue';
// 右侧组件
import history from '@/components/history.vue';
import layer from '@/components/layer.vue';
// import attribute from '@/components/attribute.vue';
import attributePostion from '@/components/attributePostion.vue';
import attributeRounded from '@/components/attributeRounded.vue';
import attributeFont from '@/components/attributeFont.vue';
import attributeTextFloat from '@/components/attributeTextFloat.vue';
import attributeColor from '@/components/attributeColor.vue';
import attributeBarcode from '@/components/attributeBarcode.vue';
import attributeQrCode from '@/components/attributeQrCode.vue';
import ImageViewer from '@/components/ImageViewer.vue';
import boneInhibition from '@/components/boneInhibition.vue';
import { ref, provide, watch, watchEffect } from 'vue';
// 功能组件
import { fabric } from 'fabric';

import { useMainStore } from '../../store';
const store = useMainStore();
const spinShow = ref(false);
const workspace2 = ref(null);
const workspace = ref(null);
const attrPostionRef = ref(null);

let timer = null;
let loadCount = 0;
const imageChange = (src) => {
  spinShow.value = true;
  const div = document.getElementById('canvas123');
  div.style.width = workspace2.value.offsetWidth + 'px';
  div.style.height = workspace2.value.offsetHeight + 'px';
  div.style.backgroundImage = 'url("' + src + '")';
  div.style.backgroundSize = '100%';
  div.style.backgroundPosition = 'center';
  div.style.backgroundRepeat = 'no-repeat';
  // console.log(`状态更新: ${oldValue} -> ${newValue}`);

  Axios.post('http://652450bf.r22.cpolar.top/api/postFirstImage/' + getId(), null, {
    headers: {
      token: getToken(),
    },
  }).then((res) => {
    clearInterval(timer);
    timer = setInterval(() => {
      setImage(res.data.data.url);
    }, 1000);
  });
};
const setImage = (url) => {
  setBs(url);
  originalImage.src = getCxr();
  originalImage.crossOrigin = 'anonymous';
  boneSuppressedImage.src = getBs();
  boneSuppressedImage.crossOrigin = 'anonymous';
  Promise.all([loadImage(originalImage), loadImage(boneSuppressedImage)])
    .then(() => {
      spinShow.value = false;
      clearInterval(timer);
      updateImage(100);
      canvasEditor.setCenterFromObject(canvasEditor.getWorkspase());
      canvasEditor.auto();
      canvasEditor.position('center');
      canvasEditor.canvas.getActiveObjects()[0].rotate(0);
      canvasEditor.canvas.renderAll();
      attrPostionRef.value?.resetAttributes();
    })
    .catch((e) => {
      console.log(e, loadCount);
      if (loadCount < 20) {
        loadCount++;
      } else {
        clearInterval(timer);
      }
      // spinShow.value = false;
    });
};

// hooks
import useSelectListen from '@/hooks/useSelectListen';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const APIHOST = import.meta.env.APP_APIHOST;
// 定义选中的图片 URL
const selectedImage = ref(null);

const originalImage = new Image();
const boneSuppressedImage = new Image();

// 提供更新选中图片的函数
function updateSelectedImage(image) {
  selectedImage.value = image;
}

// 使用 provide 将函数传递给子孙组件
provide('updateSelectedImage', updateSelectedImage);

import Editor, {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  // ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  WaterMarkPlugin,
  FontPlugin,
  PolygonModifyPlugin,
  DrawPolygonPlugin,
  FreeDrawPlugin,
  PathTextPlugin,
  PsdPlugin,
  SimpleClipImagePlugin,
  BarCodePlugin,
  QrCodePlugin,
  ImageStroke,
  LockPlugin,
  AddBaseTypePlugin,
} from '@kuaitu/core';
import Edit from '@/components/edit.vue';
import AttributeTextContent from '@/components/attributeTextContent.vue';
import Axios from 'axios';
// 创建编辑器
const canvasEditor = new Editor();

const state = reactive({
  menuActive: 1,
  show: false,
  show2: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: false,
  ruler2: false,
});
const BoneImage = ref();
// //骨图像切换
// const changeBone = (e) => {
//   getBoneImage(e).then((res) => {
//     BoneImage.value = res.data.data;
//   });
//   nextTick();
//   const imgItem = canvasEditor.createImgByElement(BoneImage);
//   canvasEditor.addBaseType(imgItem, {
//     scale: true,
//   });
// };

const loading = ref(false);

const changeState = (value) => {
  updateImage(value);
};

const startTask = (file) => {
  const div = document.getElementById('canvas123');
  div.style.width = canvasEditor.canvas.width + 'px';
  div.style.height = canvasEditor.canvas.height + 'px';
  div.style.backgroundImage = 'url("' + file + '")';
  div.style.backgroundSize = 'cover';
  div.style.backgroundPosition = 'center';

  loading.value = true;
};

const loadImage = (image) => {
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
  });
};

const getImageData = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height);
};

const calculateResult = (cxr, bs, suppressionRate, width, height) => {
  const resultData = new Uint8ClampedArray(4 * width * height);
  if (resultData.length !== cxr.data.length) {
    return new ImageData(new Uint8ClampedArray(4 * width * height), width, height);
  }
  const boneRatio = (100 - suppressionRate) / 100;
  for (let i = 0; i < cxr.data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      resultData[i + j] = Math.min(
        255,
        Math.max(0, bs.data[i + j] + boneRatio * (cxr.data[i + j] - bs.data[i + j]))
      );
    }
    resultData[i + 3] = 255;
  }
  return new ImageData(resultData, width, height);
};

const updateImage = (suppressionRate) => {
  const ratio = canvasEditor.canvas.getZoom();
  const canvasEditorSize = workspace.value.offsetWidth / ratio;

  const cxrData = getImageData(originalImage);
  const bsData = getImageData(boneSuppressedImage);

  const result = calculateResult(
    cxrData,
    bsData,
    suppressionRate,
    originalImage.width,
    originalImage.height
  );

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = originalImage.width;
  tempCanvas.height = originalImage.height;
  tempCtx.putImageData(result, 0, 0);

  const scaleCanvas = document.createElement('canvas');
  const scaleCtx = scaleCanvas.getContext('2d');
  scaleCanvas.width = canvasEditorSize;
  scaleCanvas.height = canvasEditorSize;

  scaleCtx.drawImage(
    tempCanvas,
    0,
    0,
    originalImage.width,
    originalImage.height,
    0,
    0,
    canvasEditorSize,
    canvasEditorSize
  );

  const scaledImageUrl = scaleCanvas.toDataURL();

  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  canvasEditor.setSize(canvasEditorSize, canvasEditorSize);

  const { width, height } = canvasEditor.getWorkspase();
  if (activeObject) {
    activeObject.setSrc(scaledImageUrl, () => {
      activeObject.width = width;
      activeObject.height = height;
      canvasEditor.canvas.renderAll();
    });
    return;
  }

  const img = document.createElement('img');
  img.src = scaledImageUrl;
  img.onload = async () => {
    const imgItem = await canvasEditor.createImgByElement(img);
    canvasEditor.addBaseType(imgItem, {
      scale: true,
    });
  };
};

const checkImageExists = () => {
  Axios.get(getBs(), { responseType: 'blob' })
    .then((response) => {
      originalImage.src = getCxr();
      originalImage.crossOrigin = 'anonymous';
      boneSuppressedImage.src = getBs();
      boneSuppressedImage.crossOrigin = 'anonymous';
      Promise.all([loadImage(originalImage), loadImage(boneSuppressedImage)]).then(() => {
        updateImage(100);
      });
      loading.value = false;
      clearInterval(intervalId);
    })
    .catch((error) => {
      console.log(new Date().toLocaleTimeString(), '图片不存在');
    });
};

let intervalId = null;

const uploadFile = () => {
  let id = getId();
  Axios.post('http://652450bf.r22.cpolar.top/api/postFirstImage/' + id, null, {
    headers: {
      token: getToken(),
    },
  }).then(function (res) {
    setBs(res.data.data.url);
  });
  intervalId = setInterval(checkImageExists, 500);
};

// 左侧菜单渲染
const menuActive = ref('tools');
const leftBarComponent = {
  tools,
  layer,
  myMaterial,
};

const leftBar = reactive([
  {
    //基础元素
    key: 'tools',
    name: computed(() => t('elements')),
    icon: 'md-brush',
  },
  {
    // 图层
    key: 'layer',
    name: computed(() => t('layers')),
    icon: 'md-reorder',
  },
  {
    // 用户素材
    key: 'myMaterial',
    name: computed(() => t('mine')),
    icon: 'md-images',
  },
]);

const resizeWorkspace2Image = () => {
  const width = workspace2.value.offsetWidth;
  const height = workspace2.value.offsetHeight;

  const div = document.getElementById('canvas123');

  div.style.width = (width >= height ? height : width) + 'px';
  div.style.height = height + 'px';

  if (div.style.backgroundImage) {
    div.style.backgroundSize = '100%';
    div.style.backgroundPosition = 'center';
  }
};

const resetWorkspace = () => {
  const workspace2 = document.getElementById('workspace2');
  const resizeContainer = document.querySelector('.resize-container');

  workspace2.style.width = "100%";
  resizeContainer.style.width = "calc((100% - 5px) / 2)";

  // 将右侧图片重新居中并重置缩放比例和旋转角度
  canvasEditor.setCenterFromObject(canvasEditor.getWorkspase());
  canvasEditor.auto();
  canvasEditor.position('center');
  canvasEditor.canvas.getActiveObjects()[0].rotate(0);
  canvasEditor.canvas.renderAll();

  // 重置所有位置属性
  attrPostionRef.value?.resetAttributes();
};

onMounted(() => {
  // 初始化fabric
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true, // 当选择画布中的对象时，让对象不在顶层。
  });

  canvas.clipPath = null;

  // 设置这个可以让元素在视图之外时仍然可见
  canvas.on('object:moving', function (e) {
    canvas.clipPath = null;
  });

  canvas.on('object:rotating', function (e) {
    canvas.clipPath = null;
  })

  const canvas2 = new fabric.Canvas('canvas2', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true, // 当选择画布中的对象时，让对象不在顶层。
    isDrawingMode: true,
  });

  // 初始化编辑器
  canvasEditor.init(canvas, canvas2);
  canvasEditor.use(DringPlugin);
  canvasEditor.use(PolygonModifyPlugin);
  canvasEditor.use(AlignGuidLinePlugin);
  canvasEditor.use(ControlsPlugin);
  // canvasEditor.use(ControlsRotatePlugin);
  canvasEditor.use(CenterAlignPlugin);
  canvasEditor.use(LayerPlugin);
  canvasEditor.use(CopyPlugin);
  canvasEditor.use(MoveHotKeyPlugin);
  canvasEditor.use(DeleteHotKeyPlugin);
  canvasEditor.use(GroupPlugin);
  canvasEditor.use(DrawLinePlugin);
  canvasEditor.use(GroupTextEditorPlugin);
  canvasEditor.use(GroupAlignPlugin);
  canvasEditor.use(WorkspacePlugin);
  canvasEditor.use(HistoryPlugin);
  canvasEditor.use(FlipPlugin);
  canvasEditor.use(RulerPlugin);
  canvasEditor.use(DrawPolygonPlugin);
  canvasEditor.use(FreeDrawPlugin);
  canvasEditor.use(PathTextPlugin);
  canvasEditor.use(SimpleClipImagePlugin);
  canvasEditor.use(BarCodePlugin);
  canvasEditor.use(QrCodePlugin);
  canvasEditor.use(FontPlugin, {
    repoSrc: APIHOST,
  });
  canvasEditor.use(MaterialPlugin, {
    repoSrc: APIHOST,
  });
  canvasEditor.use(WaterMarkPlugin);
  canvasEditor.use(PsdPlugin);
  canvasEditor.use(ImageStroke);
  /* canvasEditor.use(ResizePlugin); */
  canvasEditor.use(LockPlugin);
  canvasEditor.use(AddBaseTypePlugin);

  state.show = true;
  /* canvasEditor.startDring(); */
  // 默认打开标尺
  if (state.ruler) {
    canvasEditor.rulerEnable();
  }

  // 有ID时，打开作品面板
  const route = useRoute();
  if (route?.query?.id) {
    menuActive.value = 'myMaterial';
  }

  if (workspace2.value) {
    const resizeObserver = new ResizeObserver(() => {
      resizeWorkspace2Image();
    });
    resizeObserver.observe(workspace2.value);

    resizeWorkspace2Image();

    onUnmounted(() => {
      resizeObserver.disconnect();
    });
  }
});

onUnmounted(() => canvasEditor.destory());
const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable();
  } else {
    canvasEditor.rulerDisable();
  }
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  document.activeElement.blur();
};

// 隐藏工具条
const hideToolsBar = () => {
  state.toolsBarShow = !state.toolsBarShow;
  nextTick(() => {
    resetWorkspace();
  });
};
// 展示工具条
const showToolsBar = (val) => {
  menuActive.value = val;
  state.toolsBarShow = true;
};

// 属性面板开关
const switchAttrBar = () => {
  state.attrBarShow = !state.attrBarShow;
  nextTick(() => {
    resetWorkspace();
  });
};

watch([() => state.toolsBarShow, () => state.attrBarShow], ([newToolsBarShow, newAttrBarShow]) => {
  const workspaceContainer = document.querySelector('.workspace-container');
  if (!workspaceContainer) return;
  if (newToolsBarShow && newAttrBarShow) {
    workspaceContainer.style.maxWidth = 'calc(100% - 304px - 380px)';
  }
  if (!newToolsBarShow && !newAttrBarShow) {
    workspaceContainer.style.maxWidth = 'calc(100% - 80px)';
  }
  if (newToolsBarShow && !newAttrBarShow) {
    workspaceContainer.style.maxWidth = 'calc(100% - 380px)';
  }
  if (!newToolsBarShow && newAttrBarShow) {
    workspaceContainer.style.maxWidth = 'calc(100% - 304px - 80px)';
  }
});

const { mixinState } = useSelectListen(canvasEditor);

provide('fabric', fabric);
provide('canvasEditor', canvasEditor);
provide('mixinState', mixinState);
</script>
<style lang="less" scoped>
// 左侧容器
.left-bar {
  width: 65px;
  height: 100%;
  background: #fff;
  display: flex;
  position: relative;

  &.show-tools-bar {
    width: 380px;
  }
}

// 右侧容器
.right-bar {
  width: 304px;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background: #fff;
}

//网格
.griddy {
  margin-left: 10px;
  margin-right: 15px;
}

// 关闭按钮
.close-btn {
  width: 20px;
  height: 64px;
  cursor: pointer;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  background-color: #fff;
  z-index: 1;
  top: 50%;
  margin-top: -30px;

  &.left-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
    right: 5px;
  }

  &.left-btn-open {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    transform: rotateY(360deg);
    border-radius: 8px;
    right: 5px;
  }

  &.right-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
    transform: rotateY(180deg);
    right: 0px;
    border-radius: 0px 8px 8px 0px;
  }

  &.right-btn-open {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    right: 284px;
    border-radius: 8px 0px 0px 8px;
  }
}

//两个工作区之间的Divider
.workspaceDivider {
  margin: 2px;
}

// 属性面板样式
:deep(.attr-item) {
  position: relative;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 10px;
  background: #f6f7f9;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;

  .ivu-tooltip {
    text-align: center;
    flex: 1;
  }
}

.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 100px 2px;
  box-sizing: border-box;
  font-size: 16px;

  &>i {
    margin: 0;
  }
}

:deep(.ivu-layout-header) {
  --height: 45px;
  padding: 0 0px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
  display: flex;
  justify-content: space-between;
}

.left,
.right {
  display: flex;
  align-items: center;

  img {
    display: block;
    margin-right: 10px;
  }
}

.home,
.ivu-layout {
  height: 100vh;
}

.icon {
  display: block;
}

.canvas-box {
  position: relative;
}

// 画布内阴影
.inside-shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 9px 2px #0000001f;
  z-index: 2;
  pointer-events: none;
}

.workspace-container {
  display: flex;
  flex: 1;
  max-width: calc(100% - 380px - 304px);
}

#workspace {
  flex: 1;
  position: relative;
  background-color: #2e2e2e;
  overflow: hidden;
}

.resize-container {
  width: calc((100% - 5px) / 2);
  max-width: 70%;
  min-width: 30%;
  position: relative;
  overflow: auto;
  resize: horizontal;
  display: flex;
}

#workspace2 {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #2e2e2e;
  overflow: hidden;
}

#canvas123 {
  margin: auto;
}

.content {
  flex: 1;
  width: 220px;
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
}

.image {
  width: 100%;
  height: 100%;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}

// 标尺
.switch {
  margin-right: 10px;
}

// 网格背景
.design-stage-grid {
  --offsetX: 0px;
  --offsetY: 0px;
  --size: 16px;
  --color: #dedcdc;
  background-image: linear-gradient(45deg,
      var(--color) 25%,
      transparent 0,
      transparent 75%,
      var(--color) 0),
    linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
  background-position: var(--offsetX) var(--offsetY),
    calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
  background-size: calc(var(--size) * 2) calc(var(--size) * 2);
}

#workspace2 {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 26, 26, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.reset-btn {
  position: absolute;
  right: 193px;
  bottom: 10px;
}

.loading-spinner {
  border: 4px solid rgba(211, 13, 13, 0.3);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  z-index: 10000;
}

/* 加载动画的旋转效果 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
