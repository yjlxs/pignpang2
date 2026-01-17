<template>
  <view class="tournament-form">
    <!-- 导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left" @tap="goBack">
        <text class="navbar-icon">‹</text>
        <text class="navbar-text">返回</text>
      </view>
      <text class="navbar-title">{{ isEdit ? '编辑赛事' : '创建赛事' }}</text>
      <view class="navbar-right"></view>
    </view>
    
    <scroll-view class="form-container" scroll-y>
      <!-- 基本信息 -->
      <view class="form-section">
        <text class="section-title">基本信息</text>
        <view class="form-group">
          <view class="input-item">
            <text class="input-label">赛事名称</text>
            <input
              v-model="formData.title"
              type="text"
              placeholder="请输入赛事名称"
              class="form-input"
              :class="{ 'input-error': errors.title }"
            />
            <text v-if="errors.title" class="error-text">{{ errors.title }}</text>
          </view>
          
          <view class="input-item">
            <text class="input-label">赛事说明</text>
            <textarea
              v-model="formData.description"
              placeholder="请输入赛事说明"
              class="form-textarea"
              :class="{ 'input-error': errors.description }"
              maxlength="2000"
              auto-height
            />
            <text v-if="errors.description" class="error-text">{{ errors.description }}</text>
            <text class="char-count">{{ formData.description.length }}/2000</text>
          </view>
          
          <!-- 修改：将单个 datetime picker 拆分为 date 和 time 两个 picker -->
          <view class="input-item">
            <text class="input-label">开始时间</text>
            <view class="datetime-group">
              <picker
                mode="date"
                :value="dateValue"
                @change="onDateChange"
                class="datetime-picker"
              >
                <view class="picker-content" :class="{ 'placeholder': !dateValue }">
                  <text>{{ dateValue || '请选择日期' }}</text>
                  <text class="picker-icon">▼</text>
                </view>
              </picker>
              <picker
                mode="time"
                :value="timeValue"
                @change="onTimeChange"
                class="datetime-picker"
              >
                <view class="picker-content" :class="{ 'placeholder': !timeValue }">
                  <text>{{ timeValue || '请选择时间' }}</text>
                  <text class="picker-icon">▼</text>
                </view>
              </picker>
            </view>
            <text v-if="errors.startTime" class="error-text">{{ errors.startTime }}</text>
          </view>
          
          <view class="input-item">
            <text class="input-label">比赛地点</text>
            <input
              v-model="formData.location"
              type="text"
              placeholder="请输入比赛地点"
              class="form-input"
              :class="{ 'input-error': errors.location }"
            />
            <text v-if="errors.location" class="error-text">{{ errors.location }}</text>
          </view>
        </view>
      </view>
      
      <!-- 比赛设置 -->
      <view class="form-section">
        <text class="section-title">比赛设置</text>
        <view class="form-group">
          <view class="input-item">
            <text class="input-label">最大人数</text>
            <input
              v-model="formData.maxPlayers"
              type="number"
              placeholder="请输入最大参与人数"
              class="form-input"
              :class="{ 'input-error': errors.maxPlayers }"
            />
            <text v-if="errors.maxPlayers" class="error-text">{{ errors.maxPlayers }}</text>
          </view>
          
          <view class="input-item">
            <text class="input-label">比赛类型</text>
            <view class="radio-group">
              <view 
                v-for="type in typeOptions" 
                :key="type.value"
                class="radio-item"
                :class="{ 'selected': formData.type === type.value }"
                @tap="selectType(type.value)"
              >
                <view class="radio-dot"></view>
                <text class="radio-label">{{ type.label }}</text>
              </view>
            </view>
            <text v-if="errors.type" class="error-text">{{ errors.type }}</text>
          </view>
          
          <view class="input-item">
            <text class="input-label">积分上限</text>
            <input
              v-model="formData.level"
              type="number"
              placeholder="请输入参赛积分上限（0表示无限制）"
              class="form-input"
              :class="{ 'input-error': errors.level }"
            />
            <text v-if="errors.level" class="error-text">{{ errors.level }}</text>
            <text class="hint-text">输入0表示无积分限制</text>
          </view>
          
          <view class="input-item">
            <text class="input-label">报名费用</text>
            <input
              v-model="formData.entryFee"
              type="number"
              placeholder="请输入报名费用（元）"
              class="form-input"
              :class="{ 'input-error': errors.entryFee }"
            />
            <text v-if="errors.entryFee" class="error-text">{{ errors.entryFee }}</text>
          </view>
        </view>
      </view>
      
      <!-- 表单说明 -->
      <view class="form-tips">
        <text class="tips-title">💡 填写说明：</text>
        <view class="tips-list">
          <text class="tips-item">1. 赛事名称应简洁明了，突出赛事主题</text>
          <text class="tips-item">2. 赛事说明可包含赛制、规则、奖励等信息</text>
          <text class="tips-item">3. 建议提前至少7天发布赛事，便于选手报名</text>
          <text class="tips-item">4. 积分上限设为0则不限制选手积分</text>
          <text class="tips-item">5. 报名费用为0则表示免费参赛</text>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view class="form-bottom-space"></view>
    </scroll-view>
    
    <!-- 提交按钮 -->
    <view class="submit-bar">
      <button 
        type="primary" 
        class="submit-btn"
        :loading="submitting"
        :disabled="submitting"
        @tap="onSubmit"
      >
        {{ submitting ? '提交中...' : (isEdit ? '保存修改' : '创建赛事') }}
      </button>
    </view>
    
    <!-- 加载提示 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
// 使用 Vue 2 Options API
export default {
  name: 'TournamentForm',
  data() {
    return {
      isEdit: false,
      submitting: false,
      loading: false,
      
      // 表单数据
      formData: {
        title: '',
        description: '',
        startTime: '',
        location: '11F',
        maxPlayers: '32',
        type: 'SINGLES',
        level: '1800',
        entryFee: '30'
      },
      
      // 分开存储日期和时间
      dateValue: '',
      timeValue: '',
      
      // 表单错误信息
      errors: {},
      
      // 比赛类型选项
      typeOptions: [
        { value: 'SINGLES', label: '单打' },
        { value: 'DOUBLES', label: '双打' },
        { value: 'TEAM', label: '团体' }
      ]
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    // 初始化表单
    async initForm() {
      // 获取页面参数
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const tournamentId = currentPage.options.id
      
      if (tournamentId) {
        this.isEdit = true
        await this.loadTournamentData(tournamentId)
      } else {
        // 创建模式：设置默认值
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        
        // 设置日期和时间默认值
        this.dateValue = this.formatDate(nextWeek)
        this.timeValue = this.formatTime(nextWeek)
        this.updateStartTime()
        
        // 设置默认的赛事说明
        this.formData.description = `赛事信息：

比赛赛制：三局两胜
替补人数：不限
分组数量：4
每组出线人数：4
淘汰赛对阵：默认对阵

赛事规程：
1.本次比赛执行国家体育总局最新审定的《乒乓球竞赛规则》及本次赛事特别规定。
2.比赛为11分制，三局二胜。
3.第一阶段为小组赛，第二阶段为淘汰赛（当报名人数不满36人时，当天比赛或将会被取消）。
4.前三名获奖选手必须参加颁奖仪式，如不参加则视为放弃名次和奖励。
5.请参赛运动员对自己的身体健康和言行举止负责，赛事方不对因选手自身问题产生的变故负责。
组委会可根据报名人数适当调整赛制。
6.本次比赛使用红双喜starcar。
7.本次比赛成绩录入积分系统。
8.年龄超过70岁的球友以及患有心脏病、高血压、心脑血管疾病的球友谢绝参赛。
9.参赛选手当天带好身份证件以备查验，不能出示有效身份证件者按弃权处理。
10.比赛无故弃权且不听劝阻的选手将取消本次比赛的所有名次及奖励；禁止赌博；禁止在公共场所抽烟（厕所及走道内）。
11.如发现有违体育道德的行为，可向组织方申诉，不得争吵、乃至损坏赛场设施、组织方有权根据现场情况对争议双方采取必要的合理处置。
12.参加比赛者视为自愿参加，请参赛者斟酌自己的身体状况。

奖品：
第一名 1200元+1瓶价值￥588的赛湖之梦醇柔3号+证书+流动奖杯
第二名 800元+1瓶价值￥388的赛湖之梦醇柔2号+证书
第三名 500元+1瓶价值￥288的赛湖之梦醇柔1号+证书
第四名 300元+1瓶价值￥199的青瓷赛里木第一坛+证书

若报名参赛人数超过48人，则
增加并列第五名150元+证书

增加小组全胜奖：
免下一场参赛报名费（可抵扣￥60）

增加整场全胜奖：
￥300 + 追加一份冠军奖品（醇柔3号）`
      }
    },
    
    // 格式化日期（用于 date picker）
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    // 格式化时间（用于 time picker）
    formatTime(date) {
      if (!date) return ''
      const d = new Date(date)
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    },
    
    // 格式化时间为完整字符串（用于显示）
    formatDateTimeForDisplay() {
      if (!this.dateValue || !this.timeValue) return ''
      return `${this.dateValue} ${this.timeValue}`
    },
    
    // 更新开始时间（合并日期和时间）
    updateStartTime() {
      if (this.dateValue && this.timeValue) {
        this.formData.startTime = this.formatDateTimeForDisplay()
      }
    },
    
    // 日期选择器变化
    onDateChange(e) {
      this.dateValue = e.detail.value
      this.updateStartTime()
    },
    
    // 时间选择器变化
    onTimeChange(e) {
      this.timeValue = e.detail.value
      this.updateStartTime()
    },
    
    // 解析 picker 选择的时间为 ISO 格式
    parsePickerTime() {
      if (!this.dateValue || !this.timeValue) return ''
      return `${this.dateValue}T${this.timeValue}:00`
    },
    
    // 选择比赛类型
    selectType(type) {
      this.formData.type = type
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 表单验证
    validateForm() {
      this.errors = {}
      let isValid = true
      
      // 验证赛事名称
      if (!this.formData.title.trim()) {
        this.errors.title = '请输入赛事名称'
        isValid = false
      } else if (this.formData.title.length < 2) {
        this.errors.title = '赛事名称至少2个字符'
        isValid = false
      } else if (this.formData.title.length > 50) {
        this.errors.title = '赛事名称不能超过50个字符'
        isValid = false
      }
      
      // 验证赛事说明
      if (!this.formData.description.trim()) {
        this.errors.description = '请输入赛事说明'
        isValid = false
      } else if (this.formData.description.length < 10) {
        this.errors.description = '赛事说明至少10个字符'
        isValid = false
      } else if (this.formData.description.length > 2000) {
        this.errors.description = '赛事说明不能超过2000个字符'
        isValid = false
      }
      
      // 验证开始时间
      if (!this.dateValue || !this.timeValue) {
        this.errors.startTime = '请选择开始日期和时间'
        isValid = false
      } else {
        const selectedTime = new Date(`${this.dateValue}T${this.timeValue}:00`)
        const now = new Date()
        if (selectedTime < now) {
          this.errors.startTime = '开始时间不能早于当前时间'
          isValid = false
        }
      }
      
      // 验证比赛地点
      if (!this.formData.location.trim()) {
        this.errors.location = '请输入比赛地点'
        isValid = false
      } else if (this.formData.location.length < 2) {
        this.errors.location = '比赛地点至少2个字符'
        isValid = false
      } else if (this.formData.location.length > 100) {
        this.errors.location = '比赛地点不能超过100个字符'
        isValid = false
      }
      
      // 验证最大人数
      if (!this.formData.maxPlayers) {
        this.errors.maxPlayers = '请输入最大参与人数'
        isValid = false
      } else {
        const maxPlayers = parseInt(this.formData.maxPlayers)
        if (isNaN(maxPlayers) || maxPlayers < 2) {
          this.errors.maxPlayers = '最大人数必须至少为2'
          isValid = false
        } else if (maxPlayers > 1000) {
          this.errors.maxPlayers = '最大人数不能超过1000'
          isValid = false
        }
      }
      
      // 验证积分上限
      if (!this.formData.level) {
        this.errors.level = '请输入积分上限'
        isValid = false
      } else {
        const level = parseInt(this.formData.level)
        if (isNaN(level) || level < 0) {
          this.errors.level = '积分上限必须为非负整数'
          isValid = false
        } else if (level > 10000) {
          this.errors.level = '积分上限不能超过10000'
          isValid = false
        }
      }
      
      // 验证报名费用
      if (!this.formData.entryFee) {
        this.errors.entryFee = '请输入报名费用'
        isValid = false
      } else {
        const entryFee = parseFloat(this.formData.entryFee)
        if (isNaN(entryFee) || entryFee < 0) {
          this.errors.entryFee = '报名费用必须为非负数'
          isValid = false
        } else if (entryFee > 10000) {
          this.errors.entryFee = '报名费用不能超过10000元'
          isValid = false
        }
      }
      
      return isValid
    },
    
    // 加载赛事数据（编辑模式）
    async loadTournamentData(tournamentId) {
      this.loading = true
      try {
        // 这里需要你真实的 API 调用
        // const res = await getTournamentById(tournamentId)
        // const tournament = res.data
        
        // 模拟数据
        const tournament = {
          title: '春季乒乓球锦标赛',
          description: '一年一度的春季乒乓球比赛...',
          startTime: '2024-03-15T14:00:00',
          location: '市体育馆',
          maxPlayers: 64,
          type: 'SINGLES',
          level: 1800,
          entryFee: 50
        }
        
        // 填充表单数据
        const startTime = tournament.startTime ? new Date(tournament.startTime) : null
        
        this.formData = {
          title: tournament.title || '',
          description: tournament.description || '',
          startTime: startTime ? `${this.formatDate(startTime)} ${this.formatTime(startTime)}` : '',
          location: tournament.location || '11F',
          maxPlayers: String(tournament.maxPlayers || '32'),
          type: tournament.type || 'SINGLES',
          level: String(tournament.level || '1800'),
          entryFee: String(tournament.entryFee || '30')
        }
        
        // 设置日期和时间
        if (startTime) {
          this.dateValue = this.formatDate(startTime)
          this.timeValue = this.formatTime(startTime)
        }
        
      } catch (error) {
        console.error('加载赛事数据失败:', error)
        uni.showToast({
          title: '获取赛事信息失败',
          icon: 'none'
        })
        this.goBack()
      } finally {
        this.loading = false
      }
    },
    
    // 提交表单
    async onSubmit() {
      // 验证表单
      if (!this.validateForm()) {
        // 滚动到第一个错误位置
        const firstErrorKey = Object.keys(this.errors)[0]
        if (firstErrorKey) {
          uni.pageScrollTo({
            selector: `.${firstErrorKey}-error`,
            duration: 300
          })
        }
        return
      }
      
      this.submitting = true
      
      try {
        // 准备提交数据
        const submitData = {
          title: this.formData.title.trim(),
          description: this.formData.description.trim(),
          startTime: this.parsePickerTime(),
          location: this.formData.location.trim(),
          maxPlayers: parseInt(this.formData.maxPlayers),
          type: this.formData.type,
          level: parseInt(this.formData.level),
          entryFee: parseFloat(this.formData.entryFee)
        }
        
        if (this.isEdit) {
          // 获取当前页面参数中的赛事ID
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const tournamentId = currentPage.options.id
          
          if (!tournamentId) {
            throw new Error('赛事ID不存在')
          }
          
          // 这里需要你真实的 API 调用
          // await updateTournament(tournamentId, submitData)
          
          uni.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          // 这里需要你真实的 API 调用
          // await createTournament(submitData)
          
          uni.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          })
        }
        
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({
          title: error.message || '操作失败',
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.tournament-form {
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

/* 自定义导航栏 */
.custom-navbar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background-color: #ffffff;
  border-bottom: 2rpx solid #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
}

.navbar-icon {
  font-size: 48rpx;
  color: #333;
}

.navbar-text {
  font-size: 32rpx;
  color: #333;
}

.navbar-title {
  flex: 2;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  flex: 1;
}

/* 表单容器 */
.form-container {
  flex: 1;
  padding: 30rpx;
}

/* 表单区块 */
.form-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
  display: block;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

/* 输入项 */
.input-item {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

/* 输入框 */
.form-input {
  height: 88rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1989fa;
  background-color: #fff;
}

.form-input::placeholder {
  color: #adb5bd;
}

.form-input.input-error {
  border-color: #ff4444;
  background-color: #fff5f5;
}

/* 文本域 */
.form-textarea {
  min-height: 200rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 30rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #1989fa;
  background-color: #fff;
}

.form-textarea.input-error {
  border-color: #ff4444;
  background-color: #fff5f5;
}

/* 字符计数 */
.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #adb5bd;
  margin-top: 10rpx;
}

/* 日期时间选择器组 */
.datetime-group {
  display: flex;
  gap: 20rpx;
}

.datetime-picker {
  flex: 1;
}

.picker-content {
  height: 88rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-content.placeholder {
  color: #adb5bd;
}

.picker-icon {
  color: #adb5bd;
  font-size: 24rpx;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 30rpx;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 30rpx;
  background-color: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-item.selected {
  background-color: #e8f3ff;
  border-color: #1989fa;
}

.radio-dot {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #dee2e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio-item.selected .radio-dot {
  border-color: #1989fa;
  background-color: #1989fa;
}

.radio-item.selected .radio-dot::after {
  content: '';
  width: 16rpx;
  height: 16rpx;
  background-color: #fff;
  border-radius: 50%;
}

.radio-label {
  font-size: 28rpx;
  color: #333;
}

.radio-item.selected .radio-label {
  color: #1989fa;
  font-weight: 500;
}

/* 错误文本 */
.error-text {
  font-size: 24rpx;
  color: #ff4444;
  margin-top: 10rpx;
  display: block;
}

/* 提示文本 */
.hint-text {
  font-size: 24rpx;
  color: #6c757d;
  margin-top: 10rpx;
  display: block;
}

/* 表单提示 */
.form-tips {
  background: #e8f3ff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  border-left: 8rpx solid #1989fa;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1989fa;
  margin-bottom: 20rpx;
  display: block;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tips-item {
  font-size: 26rpx;
  color: #495057;
  line-height: 1.6;
  display: block;
}

/* 底部占位 */
.form-bottom-space {
  height: 160rpx;
}

/* 提交按钮栏 */
.submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.submit-btn {
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 500;
  background-color: #1989fa;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:disabled {
  opacity: 0.6;
}

.submit-btn:active {
  transform: scale(0.98);
}

/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #1989fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #333;
}

/* 安全区域适配 */
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
       only screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3),
       only screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) {
  .submit-bar {
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  }
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .form-section {
    padding: 30rpx;
  }
  
  .datetime-group {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .radio-item {
    justify-content: flex-start;
  }
}
</style>