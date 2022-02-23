<template>
  <div class="page-wrapper">
    <div class="page-header-wrapper">
      土豆列表<HomeOutlined />
    </div>
    <div class="content-wrapper">

      <div class="input-wrapper">
        <p class="handle-check-box" @click="handleCheckAllBtn">
          <icon-font type="icon-down" />
        </p>
        <a-input v-model:value="inputValue" placeholder="你想干啥？" @pressEnter="handleSaveItem" />
      </div>

      <div v-show="todoList.length > 0" class="list-wrapper">
        <div class="list-box" id="dragBox">
          <TodoItem 
              v-for="item in showList"
              :key="item.id"
              :defaultValue="item"
              @changeStatus="changeItemStatus"
              @handleDelete="handleDeleteItem"
            />
        </div>
        <div class="btn-wrapper">
          <p class="list-tips-box">{{ todoSize }} 个待办项</p>
          <div>
            <a-button type="text" :class="showListType === 'all' ? 'btn-active' : null" @click="handleFilterList('all')">全部</a-button>
            <a-button type="text" :class="showListType === 'todo' ? 'btn-active' : null" @click="handleFilterList('todo')">待办</a-button>
            <a-button type="text" :class="showListType === 'done' ? 'btn-active' : null" @click="handleFilterList('done')">完成</a-button>
          </div>

          <p class="list-tips-box">
            <a-button v-if="someItemDone" type="text" @click="handleClearList">清除已完成项</a-button>
          </p>

        </div>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TodoItem from '@/components/todoItem.vue'
import { Modal } from 'ant-design-vue'
import Sortable from 'sortablejs'

const router = useRouter()
let inputValue = ref<string>('')
let todoList = ref([])
let showList = ref([])
let showListType = ref('all')
let someItemDone = computed(() => {
  return todoList.value.some(item => item.isDone)
})
let todoSize = computed(() => {
  const todoDatas = todoList.value.filter(item => !item.isDone)
  return todoDatas.length
})

// 点击回车键之后保存当前项
function handleSaveItem(e) {
  console.log(e.target.value)
  if (e.target.value.length <= 0) return
  const sameInList = todoList.value.some(item => item.title === e.target.value)
  if (sameInList) {
    Modal.confirm({
      content: '列表中已经有相同名称的项，是否继续添加？',
      onOk() {
        setItemInList(e.target.value)
      },
      okText: '继续添加',
      cancelText: '取消',
      onCancel() {
        Modal.destroyAll();
      },
    });
  }else{
    setItemInList(e.target.value)
  }
}

// 将项添加到列表中
function setItemInList(value) {
  todoList.value.unshift({
    title: value,
    id: getRandomKey(),
    isDone: false
  })
  doFilterList()
  saveListInLocal()
  inputValue.value = ''
}

// 修改项目的选中状态
function changeItemStatus(id) {
  todoList.value.forEach(item => {
    if(item.id === id) {
      item.isDone = !item.isDone
    }
  })
  doFilterList()
  saveListInLocal()
}

// 删除一个项
function handleDeleteItem(id) {
  todoList.value = todoList.value.filter(item => item.id !== id)
  doFilterList()
  saveListInLocal()
}

// 点击按照类型查看
function handleFilterList(type) {
  showListType.value = type
  localStorage.setItem('todo_list_data-type', type)  // 如果不使用路由来区分类型的时候，可以用这个记录上次浏览的类型
  doFilterList()
}

// 过滤查看类型
function doFilterList() {
  const type = showListType.value
  if (type === 'all') {
    showList.value = todoList.value
    router.push('/all')
    return
  }

  if (type === 'todo') {
    showList.value = todoList.value.filter(item => !item.isDone)
    router.push('/todo')
    return
  }

  if (type === 'done') {
    showList.value = todoList.value.filter(item => item.isDone)
    router.push('/done')
    return
  }
}

// 点击清除已执行项
function handleClearList() {
  todoList.value.forEach(item => {
    if(item.isDone) handleDeleteItem(item.id)
  })
  doFilterList()
  saveListInLocal()
}

// 将列表数据保存在本地
function saveListInLocal() {
  localStorage.setItem('todo_list_data', JSON.stringify(todoList.value))
}

// 设置默认展示类型
function setDefaultType() {
  const pagePath = useRoute().path
  if (['/all' , '/todo' , '/done'].indexOf(pagePath) !== -1) {
    showListType.value = pagePath.substr(1)
  } else {
    // 如果不使用路由来区分类型时候，可以用这个记录上次浏览的类型
    showListType.value = localStorage.getItem('todo_list_data-type') || 'all' // 获取用户上次查看类型
  }
}

// 点击全选
function handleCheckAllBtn() {
  const isAllChecked = todoList.value.every(item => !item.isDone)
  const isSomeChecked = todoList.value.some(item => !item.isDone)
  if (isSomeChecked && !isAllChecked) {
    todoList.value.map(item => item.isDone = true)
  } else {
    todoList.value.map(item => item.isDone = !item.isDone)
  }
}

// 生成一个id
function getRandomKey() {
  const timestamp = new Date().getTime()
  const randomString = Math.random().toString(10).substr(2)
  return `${randomString}_${timestamp}`
}

function deepCloneObj(target) {
  let result
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = []
      for (const i in target) {
        result.push(deepCloneObj(target[i]))
      }
    } else if (target === null) {
      result = null
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      result = {}
      for (const i in target) {
        result[i] = deepCloneObj(target[i])
      }
    }
  } else {
    result = target
  }
  return result
}

onMounted(() => {
  const todoInfo = localStorage.getItem('todo_list_data') // 获取本地存储的list数据
  todoList.value = todoInfo ? JSON.parse(todoInfo) : []
  setDefaultType()
  doFilterList()
  const el = document.getElementById('dragBox');
  const sortable = Sortable.create(el,{
    handle: ".handleDrag",
    onEnd: (e) => {
      const {newIndex, oldIndex} = e
      const targetItem = deepCloneObj(todoList.value[oldIndex])
      todoList.value.splice(oldIndex, 1)
      todoList.value.splice(newIndex, 0, targetItem)
      saveListInLocal()
    }
  });
})

</script>

<style scoped lang="less">
  p{
    padding: 0;
    margin: 0;
  }
  .page-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .page-header-wrapper{
      height: 56px;
      line-height: 56px;
      text-align: center;
      font-size: 30px;
      color: #666;
    }
    .content-wrapper{
      width: 600px;
      .input-wrapper{
        width: 100%;
        display: flex;
        align-items: center;
        border: 1px solid rgb(214, 214, 214);
        .handle-check-box{
          width: 40px;
          cursor: pointer;
        }
        input{
          border: none;
          box-shadow: none;
        }
      }
      .list-wrapper{
        width: 100%;
        display: flex;
        flex-direction: column;
        max-height: 520px;
        .list-box{
          flex: 1;
          border: 1px solid rgb(214, 214, 214);
          overflow-y: scroll;
          padding-left: 10px;
        }
        .btn-wrapper{
          width: 100%;
          height: 44px;
          background-color: rgb(240, 240, 240);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .list-tips-box{
            width: 120px;
            height: 44px;
            line-height: 44px;
            padding: 0;
            margin: 0;
            user-select: none;
          }
          .btn-active{
            color: #009fff;
          }
        }
      }
    }
  }
</style>