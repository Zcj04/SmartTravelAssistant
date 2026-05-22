import axios from 'axios'


//创建axios实例
const request = axios.create({
    baseURL: 'http://localhost:3300/api/travel',
    timeout: 360000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//封装请求拦截器
request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
//封装响应拦截器
request.interceptors.response.use(
    response => {
        return response.data
    },  
    error => {
        return Promise.reject(error)
    }
)

export function post(url, data) {   
    return request.post(url, data)
}
export function get(url, params) {
    return request.get(url, { params })
}

//处理流式接口
export async function fetchStream(url, data,onChunk,onComplete,onError) {
    //创建一个请求控制器
    const controller = new AbortController()

    try{
        const response = await fetch(`http://localhost:3300/api/travel/${url}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
    })
        //获取响应体的可读流读取器
        const reader = response.body.getReader()
        //将二进制数据转换为字符串
        const decoder = new TextDecoder()

        //读取数据
        while(true){
            const {done, value} = await reader.read()
            if(done){
                onComplete('')
                break
            }
            const chunk = decoder.decode(value,{stream:true})
            const lines = chunk.split('\n').filter(line => line.trim()) 
            for(const line of lines) {
                console.log(line)
                try{
                    if(line.startsWith('data: ')){
                        const jsonStr = line.substring(6)
                        const data = JSON.parse(jsonStr)
                        if(data.type === 'chunk'){
                            onChunk(data.content)
                        }else if(data.done){
                            onComplete(data.data)
                        }else if(data.error){
                            onError(data.error)
                        }
                    }
                }catch(error){
                    onError('解析数据失败')
                }  
            }  
            
        }
        return controller.abort()
    }catch(error){
        onError(error)
    }
}

export default request
