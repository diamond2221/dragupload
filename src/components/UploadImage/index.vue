<template>
  <div class="uplaod-wrap">
    <div
      v-for="(item, index) in uploadList"
      :key="index"
      class="demo-upload-list"
      :style="{width: width + 'px', height: height + 'px'}"
    >
      <template v-if="item.status === 'success'">
        <img
          v-viewer
          :src="imgPath + item.url"
        >
        <div
          v-if="!disabled"
          class="demo-upload-list-cover"
        >
          <Icon
            type="ios-eye-outline"
            @click.native="handleView(item.url)"
          />
          <Icon
            type="ios-trash-outline"
            @click.native="handleRemove(item, index)"
          />
        </div>
      </template>
      <!-- <template v-else-if="item.status === 'error'">
          <Icon
            type="ios-eye-outline"
            @click.native="handleView(item.url)"
          />
      </template> -->
      <template v-else>
        <Spin fix />
      </template>
    </div>
    <label
      v-show="uploadList.length < max && !disabled"
      class="upload-ref ivu-upload"
      :style="{width: width + 'px', height: height + 'px'}"
    >
      <div
        class="ivu-upload ivu-upload-drag"
        :class="{
          'ivu-upload-dragOver': dragOver
        }"
        @dragover.prevent="dragOverHandle"
        @dragleave.prevent="dragLevelHandle"
        @drop.prevent="onDropHandle"
        @paste="onPasteHandle"
      >
        <!-- capture="camera"  -->
        <input
          v-if="max > 1"
          ref="imageUpload"
          class="ivu-upload-input"
          type="file"
          accept="image/*"
          multiple
          @change="changeHandle"
        >

        <input
          v-else
          ref="imageUpload"
          class="ivu-upload-input"
          type="file"
          accept="image/*"
          @change="changeHandle"
        >

        <div class="upload-icon-wrap">
          <Icon
            type="ios-camera"
            size="25"
          />
        </div>
      </div>
    </label>
    <!-- <Upload
      v-show="uploadList.length < max && !disabled"
      ref="upload"
      :disabled="disabled"
      class="upload-ref"
      :show-upload-list="false"
      :on-success="onSuccessHandle"
      :format="['jpg','jpeg','png']"
      :max-size="_maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="onBeforeUploadHandle"
      :on-error="onErrorHandle"
      with-credentials
      accept="image/*"
      type="drag"
      multiple
      :action="url"
    >
      <div class="upload-icon-wrap">
        <Icon
          type="ios-camera"
          size="25"
        />
      </div>
    </Upload> -->
    <Modal
      v-model="visible"
      title="预览图片"
    >
      <img
        v-if="visible"
        :src="imgPath + imgName"
        style="width: 100%"
      >
    </Modal>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
  }
  &:hover .demo-upload-list-cover {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.upload-ref {
  display: inline-block;
  ::v-deep .ivu-upload {
    height: 100%;
    .upload-icon-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
