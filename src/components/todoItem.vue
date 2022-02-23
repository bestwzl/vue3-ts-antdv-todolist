<template>
  <div class="item-wrapper">
    <div class="item-left-wrapper">
      <p class="item-radio-box" @click="changeStatus" :class="defaultValue.isDone ? 'item-done' : null">
        <icon-font v-if="defaultValue.isDone" type="icon-check" />
      </p>
      <p class="item-title-box" :class="defaultValue.isDone ? 'item-avtive' : null">{{ defaultValue.title }}</p>
    </div>
    <div class="item-right-wrapper">
      <p class="handle-move-box handleDrag">
        <drag-outlined />
      </p>
      <p class="handle-btn-box" @click="handleDelete">
        <close-outlined />
      </p>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';
import { Modal } from 'ant-design-vue';

import {
  DragOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';

let props = defineProps({
  defaultValue: {
    type: Object
  }
})

let defaultInfo = ref(props.defaultValue)

const emits = defineEmits(['handleDelete', 'changeStatus'])

// 点击修改状态
function changeStatus() {
  emits('changeStatus', defaultInfo.value.id)
}

// 点击删除
function handleDelete() {
  Modal.confirm({
    content: '是否确认删除本项',
    onOk() {
      emits('handleDelete', defaultInfo.value.id)
    },
    okText: '删除',
    cancelText: '取消',
    onCancel() {
      Modal.destroyAll();
    },
  })
}

</script>

<style scoped lang="less">
  p{
    padding: 0;
    margin: 0;
  }
  .item-wrapper{
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item-left-wrapper,
    .item-right-wrapper{
      display: flex;
      align-items: center;
    }
    .item-left-wrapper{
      justify-content: flex-start;
      .item-radio-box{
        width: 20px;
        height: 20px;
        border: 1px solid rgb(190, 190, 190);
        border-radius: 50%;
      }
      .item-done{
        color: rgb(6, 214, 169);
        border: 1px solid rgb(221, 221, 221);
      }
      .item-title-box{
        padding-left: 10px;
      }
      .item-avtive{
        color: rgb(175, 177, 177);
        text-decoration:line-through;
      }
    }
    .item-right-wrapper{
      justify-content: flex-end;
      .handle-btn-box,
      .handle-move-box{
        width: 40px;
        height: 40px;
        line-height: 40px;
        &:hover{
          background-color: rgb(248, 248, 248);
        }
      }
      .handle-move-box{
        cursor: move;
      }
      .handle-btn-box{
        cursor: pointer;
      }
    }
  }
</style>