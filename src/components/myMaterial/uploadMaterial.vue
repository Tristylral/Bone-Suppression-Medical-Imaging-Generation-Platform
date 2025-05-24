<template>
  <div class="my-material">
    <Button icon="md-cloud-upload" @click="uploadImgHandule" long type="primary">
      {{ $t('uploadBtn') }}
    </Button>
    <div class="img-group" v-if="fileList.length">
      <Tooltip
        :content="info.name"
        v-for="(info, i) in fileList"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <div :class="['tmpl-img-box', currentId == info.id && 'active-img']">
          <Icon
            type="ios-trash"
            class="del-btn"
            color="red"
            @click="removeMaterialHandle(info.id)"
          />
          <Image
            lazy
            :src="info.imgUrl"
            fit="contain"
            height="100%"
            :alt="info.id"
            @click="addImgByElement"
          />
        </div>
      </Tooltip>
    </div>
    <div class="tip" v-else>{{ $t('no_material') }}</div>

    <Spin size="large" fix :show="spinShow" />
  </div>
</template>

<script setup name="ImportTmpl">
const APP_APIHOST = import.meta.env.APP_APIHOST;
import { getFileList, uploadImg, createdMaterial, removeMaterial } from '@/api/user';
import { postImage } from '@/api/material';
import { Utils } from '@kuaitu/core';
import { inject } from 'vue';
import { useMainStore } from '../../store';
import { getToken, setId, setCxr } from '@/api/user';
import { ref, nextTick } from 'vue';
const store = useMainStore();
// 获取祖父组件提供的函数
const updateSelectedImage = inject('updateSelectedImage');
const emit = defineEmits();
const { selectFiles } = Utils;
const canvasEditor = inject('canvasEditor');
const fileList = ref([]);
const isLogin = ref(false);
const spinShow = ref(false);
const currentId = ref(null);
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then((res) => {
      fileList.value = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          imgUrl: item.url,
        };
      });
      isLogin.value = true;
    })
    .catch(() => {
      isLogin.value = false;
    })
    .finally(() => {
      spinShow.value = false;
    });
};

getFileListHandle();

// 上传素材
const uploadImgHandule = async () => {
  selectFiles({
    accept: 'image/*',
  }).then((fileList) => {
    spinShow.value = true;
    const formData = new FormData();
    const [file] = fileList;
    formData.append('files', file);
    uploadImg(formData)
      .then((res) => {
        const { data } = res.data;
        createdH(data);
      })
      .catch((err) => {
        console.log(err);
        spinShow.value = false;
      });
  });
};
// 创建素材
const createdH = (data) => {
  createdMaterial({
    data: {
      img: data.id,
      name: data.fileName,
    },
  }).finally(() => {
    getFileListHandle();
    const obj = {
      target: {
        alt: data.id,
        src: data.url,
      },
    };
    addImgByElement(obj);
  });
};

const ProcessImage = ref();

const addImgByElement = async (e) => {
  currentId.value = e.target.alt;
  setId(e.target.alt);
  setCxr(e.target.src);
  store.updateMessage(e.target.src);
  emit('imageChange', e.target.src);
};

// 删除素材
const removeMaterialHandle = (id) => {
  removeMaterial(id).finally(getFileListHandle);
};
</script>

<style scoped lang="less">
.img-group {
  background: #eeeeee;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
  gap: 20px;
}
.tmpl-img-box {
  position: relative;
  width: 180px;
  height: 180px;
  padding: 1px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
  z-index: 2;
  &.active-img::after {
    content: '';
    position: absolute;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    top: -2px;
    left: -2px;
    z-index: 1;
    background-color: #2d8cf0;
    border-radius: 5px;
  }
  .ivu-image {
    position: relative;
    background: #eeeeee;
    z-index: 2;
    border-radius: 5px;
  }

  &:hover {
    background: #e3e3e3;
    .del-btn {
      // opacity: 1;
      right: 5px;
      z-index: 3;
    }
  }
}
.ivu-tooltip + .ivu-tooltip {
  margin-top: 10px;
}

.del-btn {
  z-index: 2;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 20px;
}

.tip {
  text-align: center;
  padding: 10px;
  min-height: 100px;
  line-height: 100px;
}
</style>
