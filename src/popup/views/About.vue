<template>
  <div class="about">
    <div class="btn-group">
      <el-button @click="handleClickOpen" size="mini" class="open">
        打开主页
      </el-button>
      <el-button @click="handleClickLogout" size="mini" class="logout">
        退出登录
      </el-button>
    </div>
    <el-progress
      class="upload-progress"
      v-if="isupload"
      :percentage="uploadDercentage"
    />
    <el-upload
      class="upload-demo"
      drag
      :http-request="handleUploadImg"
      accept="image/*"
      ><upload-filled />
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
    <div v-if="photo" class="link-list">
      <el-input
        :modelValue="item.url"
        :readonly="true"
        size="mini"
        class="link-item"
        v-for="(item, index) in photo"
        :key="item.key"
      >
        <template #prepend>{{ item.key }}</template>
        <template #append>
          <el-button @click="handleClickCopy(index)" type="primary" size="mini">
            复制
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>
<script>
import { logout } from '@/services/api'
import { useRouter } from 'vue-router'
import { getDomain, addPhoto, getPhoto } from '../../services/api'
import { ref } from 'vue-demi'
import * as clipboard from 'clipboard-polyfill/text'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const router = useRouter()
    let uploadDercentage = ref(0)
    let isupload = ref(false)
    let photo = ref(null)

    function handleClickOpen() {
      window.open(getDomain())
    }

    async function handleClickLogout() {
      await logout()
      router.replace({ name: 'Home' })
    }
    async function handleUploadImg({ file }) {
      isupload.value = true
      uploadDercentage.value = 0
      let photoID = await addPhoto(file)
      if (String(photoID).includes('Error')) {
        uploadDercentage.value = 100
        isupload.value = false
        ElMessage({ message: photoID, type: 'error' })
        return false
      }
      uploadDercentage.value = 50
      let _photo = await getPhoto(photoID)
      photo.value = [
        {
          key: 'preview',
          url: `${getDomain()}/view?p=${_photo.id}`
        },
        // 原始直链
        {
          key: 'direct',
          url: `${getDomain()}/${_photo.url}`,
          width: _photo.width,
          height: _photo.height
        }
      ]
      if (_photo.sizeVariants.thumb)
        // 方形缩略图
        photo.value.push({
          key: 'thumb',
          url: `${getDomain()}/${_photo.sizeVariants.thumb.url}`,
          width: _photo.sizeVariants.thumb.width,
          height: _photo.sizeVariants.thumb.height
        })
      if (_photo.sizeVariants.small)
        // 缩略图
        photo.value.push({
          key: 'small',
          url: `${getDomain()}/${_photo.sizeVariants.small.url}`,
          width: _photo.sizeVariants.small.width,
          height: _photo.sizeVariants.small.height
        })
      uploadDercentage.value = 100
      setTimeout(() => {
        isupload.value = false
      }, 300)
    }

    function handleClickCopy(index) {
      clipboard.writeText(photo.value[index].url).then(
        () => {
          ElMessage({
            message: '复制成功.',
            type: 'success',
            duration: 1000
          })
        },
        () => {
          ElMessage({
            message: '复制失败.',
            type: 'error',
            duration: 1000
          })
        }
      )
    }

    return {
      uploadDercentage,
      isupload,
      photo,
      handleUploadImg,
      handleClickOpen,
      handleClickLogout,
      handleClickCopy
    }
  }
}
</script>
<style lang="less" scoped>
.about {
  position: relative;
  .btn-group {
    position: absolute;
    top: -32px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .upload-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
    :deep(.el-upload-dragger) {
      width: 300px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    :deep(.el-upload-list) {
      display: none;
    }
  }
  .upload-progress {
    padding-bottom: 10px;
  }
  .link-list {
    padding-bottom: 10px;
    .link-item {
      margin-bottom: 10px;
      :deep(.el-input-group__prepend) {
        padding: 0;
        width: 50px;
        text-align: center;
      }
    }
  }
}
</style>
