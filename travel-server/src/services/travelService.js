import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';
import { SystemMessage, HumanMessage, AIMessage, FunctionMessage } from '@langchain/core/messages';

class TravelService {
    constructor() {
        this.initLLM();
    }

    initLLM() {
        // 初始化LLM模型
        this.llm = new ChatOpenAI({
            configuration: {
                baseURL: process.env.DEEPSEEK_BASE_URL,
            },
            apiKey: process.env.DEEPSEEK_API_KEY,
            modelName: process.env.DEEPSEEK_MODEL,
            temperature: 0.7,
            streaming: true
        });
    }
    async recommend(city, budget, days) {
        if (budget < 100 || days < 1 || days > 30) {
            throw new Error('预算必须在100元以上，时间要在1天以上30天以下');
        }
        try {
            const response = await this.llm.invoke(this.getTravelPrompt(city, budget, days));
            console.log('LLM 完整返回：', response);
            const fullResponse = response.content || '';

            let jsonStr = '';

            // 1. 优先匹配 ```json ... ```
            const jsonBlock = fullResponse.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonBlock) {
                jsonStr = jsonBlock[1];
            } else {
                // 2. 再匹配 ``` ... ```
                const plainBlock = fullResponse.match(/```\s*([\s\S]*?)\s*```/);
                if (plainBlock) {
                    jsonStr = plainBlock[1];
                } else {
                    // 3. 直接匹配最外层 {}（加捕获组！）
                    const jsonOnly = fullResponse.match(/^\s*(\{[\s\S]*\})\s*$/);
                    if (jsonOnly) {
                        jsonStr = jsonOnly[1];
                    }
                }
            }

            if (!jsonStr) {
                return {
                    success: false,
                    error: '未找到有效 JSON',
                    rawResponse: fullResponse
                };
            }

            try {
                const data = JSON.parse(jsonStr);
                return data;
            } catch (err) {
                return {
                    success: false,
                    error: 'JSON格式错误',
                    rawResponse: jsonStr,
                    parseError: err.message
                };
            }

        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        }
    }
    getTravelPrompt(city, budget, days) {
        // 获取旅游计划提示
        return [
            new HumanMessage(`你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。

请根据以下信息为用户生成一份详细的旅游规划：
- 目的地城市：${city}
- 预算：${budget}元
- 旅行天数：${days}天

要求：
1. 每天的行程安排（上午、下午、晚上）
2. 每个景点的详细介绍
3. 交通建议
4. 预算分配明细
5. 注意事项

请以JSON格式输出，结构如下：
{
  "success": true,
  "city": "城市名",
  "days": 天数,
  "totalBudget": 总预算,
  "dailyItinerary": [
    {
      "day": 1,
      "date": "第1天",
      "morning": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "afternoon": {
        "spot": "景点名称",
        "duration": "游览时长",
        "ticket": "门票价格",
        "transportation": "交通方式",
        "description": "景点介绍"
      },
      "evening": {
        "spot": "活动名称",
        "duration": "活动时长",
        "ticket": "费用",
        "transportation": "交通方式",
        "description": "活动介绍"
      }
    }
  ],
  "budgetBreakdown": {
    "accommodation": 住宿费用,
    "food": 餐饮费用,
    "transportation": 交通费用,
    "tickets": 门票费用,
    "other": 其他费用
  },
  "tips": ["提示1", "提示2", "提示3"],
  "warnings": ["注意事项1", "注意事项2"]
}

请确保JSON格式正确，可以被解析。`),
        ]
    }

    //流式对话
    async chat(message,streamCallback) {
        // 组装参数
        const messages = [
            new SystemMessage('你是一个专业的旅游规划师，擅长根据用户的需求生成详细的旅行行程。'),
            new HumanMessage(message),
        ]

        try{
            let fullResponse = '';
            const stream = await this.llm.stream(messages,streamCallback);
            for await (const chunk of stream) {
                const content = chunk.content || ''; 
                if (content.trim() === '') {
                    continue;
                }
                fullResponse += content;
                if(streamCallback){
                    streamCallback(content);
                }} 
            return{
                success: true,
                reply: fullResponse
            }     
        }catch(err){
            return {
                success: false,
                error: err.message,
            }
        }
    }
}
export default TravelService;