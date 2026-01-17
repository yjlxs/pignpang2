// utils/request.js
// 根据你的实际后端地址修改这里的 BASE_URL
const BASE_URL = 'http://test-cn.your-api-server.com' // 开发环境
// const BASE_URL = 'https://your-api-domain.com' // 生产环境

const request = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: {
                'Content-Type': 'application/json',
                'Authorization': uni.getStorageSync('token') || '',
                ...options.header
            },
            success: (res) => {
                // 统一处理响应
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    console.error('请求失败:', res)
                    reject(new Error(res.data?.message || `请求失败: ${res.statusCode}`))
                }
            },
            fail: (err) => {
                console.error('网络错误:', err)
                reject(new Error('网络连接失败，请检查网络设置'))
            }
        })
    })
}

// 比赛相关 API
export const matchApi = {
    // 获取比赛列表
    getMatchList: (tournamentId, page = 1, pageSize = 10) => {
        return request({
            url: '/api/matches',
            method: 'GET',
            data: { tournamentId, page, pageSize }
        })
    },

    // 更新比赛比分
    updateMatchScore: (matchId, player1Score, player2Score) => {
        return request({
            url: `/api/matches/${matchId}/score`,
            method: 'PUT',
            data: { player1Score, player2Score }
        })
    },

    // 获取单个比赛详情
    getMatchDetail: (matchId) => {
        return request({
            url: `/api/matches/${matchId}`,
            method: 'GET'
        })
    }
}

export default request