<template>
    <div class="page-container chat-page">
        <div class="page-header">
            <van-nav-bar title="咨询AI助手" 
            left-arrow
            left-text="返回"
            @click-left="onBack"
            />
        </div>
        <div class="chat-container" ref="chatContainer">
            <div v-if="message.length === 0" class="chat-empty">
                <van-empty description="开始和AI助手对话吧！" />
                <div class="quick-questions">
                    <div class="quick-title">常见问题</div>
                    <van-tag v-for="question in quickQuestions" :key="question" size="large" class="quick-tag" mark @click="sendQuestion(question)">
                        {{ question }}
                    </van-tag>
                </div>
            </div>
            <div v-else class="messages-list">
                <ChatBubble v-for="msg in message" :key="msg.id" :message="msg" />
                <div class="streaming-indicator" v-if="isStreaming">
                    <van-loading type="spinner"  size="20" />
                    <span>ai助手回复中...</span>
                </div>
            </div>
        </div>
        <div class="chat-input-area">
            <van-field 
            v-model="inputText" 
            :disabled="isStreaming"
            placeholder="输入您的问题" 
           
            @keyup.enter="sendMessage">
                <template #button>
                    <van-button @click="sendMessage" type="primary" size="small" :disabled="!inputText.trim()">发送</van-button>
                </template>
                
            </van-field>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { fetchStream } from '../utils/request.js'
import { showToast } from 'vant'
import ChatBubble from '../components/ChatBubble.vue'

const message = ref([])
const chatContainer = ref(null)
const scrollToBottom = () => {
  if(chatContainer.value){
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const router = useRouter()

const quickQuestions = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
])

const inputText = ref('')


const sendMessage = () => {
  const msg = inputText.value.trim()
  if(!msg||isStreaming.value){
    return
  }
  addUserMessage(msg)
  inputText.value = ''
  fetchAIResponse(msg)
}

//获取AI助手回复
const fetchAIResponse = (userMsg) => {
  isStreaming.value = true
  message.value.push({
    id: Date.now()+1,
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString()
  })
  let fullResponse = ''
  fetchStream('chat',{message:userMsg},(chunk)=>{
    fullResponse += chunk
    const lastMessage = message.value[message.value.length-1]
    if(lastMessage&&lastMessage.role==='ai'){
      lastMessage.content = fullResponse
    }
    scrollToBottom()
  },()=>{
    isStreaming.value = false
    scrollToBottom()
  },(errMsg)=>{
    const lastMessage = message.value[message.value.length-1]
    if(lastMessage&&lastMessage.role==='ai'){
      lastMessage.content = errMsg
    }
    isStreaming.value = false
    scrollToBottom()
    showToast('ai助手回复失败')
  })
}
const isStreaming = ref(false)
const addUserMessage = (content) => {
  message.value.push({
    id: Date.now(),
    role: 'user',
    content: content,
    timestamp: new Date().toISOString()
  })
}

const sendQuestion = (question) => {
  message.value.push({
    role: 'user',
    content: question
  })
}

const onBack = () => {
    router.back()
}

const route = useRoute()
onMounted(()=>{
  if(route.query.scene === 'detail'&&route.query.city){
    inputText.value = `在${route.query.city}有哪些必去的景点？`
}})
</script>

<style>
.page-header {
  height: 46px;
}
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 0px !important;
}

.chat-container {
  height: 600px;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 60px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
} 
</style>