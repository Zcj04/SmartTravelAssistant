export const createStreamResponse = (res) => {
    //  设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    // 确保客户端每次请求都返回最新的数据
    res.setHeader('Cache-Control', 'no-cache');
    // 开启长连接
    res.setHeader('Connection', 'keep-alive');
    return {
        send:(data) => {
            try {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            } catch (error) {
                console.error('流式发送错误:', error);
            }
        },
        end:() => {
            try {
                res.write('event: end\ndata:{"done":true}\n\n');
                res.end();
            } catch (error) {
                console.error('流式结束错误:', error);
            }
        },
        error:(message) => {
            try {
                res.write(`data: ${JSON.stringify(message)}\n\n`);
                res.end();
            } catch (error) {
                console.error('流式错误错误:', error);
            }
        }
    }
}