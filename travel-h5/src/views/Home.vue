<template>
    <div class="page-container">
        <div class="page-header">
            <van-nav-bar title="智能旅行助手"/>
        </div>
        <div class="page-content">
            <van-notice-bar
                left-icon="info-o"
                text="基于AI的智能旅行助手，帮助您计划和管理您的旅行。 "
                style="margin-bottom: 16px;"
            />
            <div class="card search-card">
                <div class="section-title">
                    规划你的行程
                </div>
                <van-field 
                    @click="showCityPicker = true"
                    v-model="formData.city" 
                    label="目的地" 
                    placeholder="请选择城市" 
                    is-link 
                    style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
                    readonly
                />
                <van-field 
                    v-model="formData.budget" 
                    type="number" 
                    label="预算(元)" 
                    placeholder="请输入预算金额"
                    style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
                 />
                <van-field 
                    v-model="formData.days" 
                    type="digit" 
                    label="天数" 
                    placeholder="请输入天数（天）"
                    style="background: #f7f8fa;border-radius: 8px;margin-bottom: 12px;"
                 />
                 <van-button 
                    type="primary" 
                    size="large"
                    round
                    @click="handleSubmit"
                    :loading="isLoading"
                    >开始规划
                </van-button>
                </div>
            <div class="card quick-actions">
                <div class="section-title">
                    快捷入口
                </div>
                <van-grid :column-num="2" :gutter="12" :border=false>
                    <van-grid-item @click="goPage('/chat')" icon="chat-o" text="对话" />
                    <van-grid-item @click="goPage('/profile')" icon="user-o" text="我的" />
                </van-grid> 

            </div>
            <div class="card popular-destinations">
                <div class="section-title">
                    热门目的地
                </div>
                <van-grid :column-num="4" :gutter="8" :border=false>
                    <van-grid-item @click="selectCity(city)" v-for="city in popularCitys" :key="city">  
                        <div class="city-tag" :class="{'active': city === formData.city}">
                            {{ city }}
                        </div>
                        <van-icon name="arrow-right" />
                    </van-grid-item>
                </van-grid> 
            </div>
        </div>
        <van-popup
            round
            v-model:show="showCityPicker"
            position="bottom">
            <van-picker
                title="选择目的地"
                :columns="cityColumns"
                @confirm="handleCityConfirm"
                @cancel="showCityPicker = false"
            />
        </van-popup>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { showToast } from 'vant'

    // 初始化路由
    const router = useRouter()
    // 表单数据
    const formData = reactive({
        city: '',
        budget: null,
        days: null
    })
    // 显示城市选择器
    const showCityPicker = ref(false)
    // 处理城市选择确认
    const handleCityConfirm = ({selectedOptions}) => {
        formData.city = selectedOptions[0].value
        showCityPicker.value = false
    }
    const allCitys =[
        '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
        '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
        '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
        '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
        '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
        ]
    const popularCitys = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',]
    const cityColumns = allCitys.map(city => ({
        text: city,
        value: city
    }))
    // 加载状态
    const isLoading = ref(false)
    // 提交表单
    const handleSubmit = () => {
        isLoading.value = true
        //判断目的地是否为空
        if (!formData.city) {
            showToast('请选择目的地')
            return
        }
        //判断预算是否为空
        if (!formData.budget || formData.budget < 100) {
            showToast('预算金额不能低于100元')
            return
        }
        //判断天数是否为空
        if (!formData.days || formData.days < 1 || formData.days > 30) {
            showToast('天数必须在1-30天之间')
            return
        }
        router.push({
            path: '/detail', 
            query: {
                city: formData.city,
                budget: formData.budget,
                days: formData.days
            }
        })
    }
    // 跳转页面
    const goPage = (path) => {
        router.push(path)
    }
    // 获取城市
    const selectCity = (city) => {
        formData.city = city
        showCityPicker.value = false
    }
</script>



<style scoped>
    .search-card {
        margin-bottom: 16px
    }
    .city-tag {
        padding: 8px 12px;
        border-radius: 16px;
        font-size: 14px;
        color: #666;
        background: #f7f8fa;
        transition: all 0.3s;
    }
    .active {
        background: #007AFF;
        color: #fff;
    }
</style>
