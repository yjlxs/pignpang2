<template>
  <view class="register">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="nav-left" @tap="onClickLeft">
        <text class="back-icon">‹</text>
        <text class="back-text">返回</text>
      </view>
      <text class="nav-title">用户注册</text>
      <view class="nav-right"></view>
    </view>
    
    <view class="form-container">
      <view class="form-group">
        <text class="form-label">昵称</text>
        <input
          v-model="formData.nickname"
          class="form-input"
          placeholder="请输入昵称"
          placeholder-class="placeholder"
          :maxlength="20"
        />
      </view>
      
      <view class="form-group">
        <text class="form-label">密码</text>
        <input
          v-model="formData.password"
          type="password"
          class="form-input"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
      </view>
      
      <view class="form-group">
        <text class="form-label">手机号</text>
        <input
          v-model="formData.phone"
          class="form-input"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
          type="number"
          maxlength="11"
        />
      </view>
      
      <!-- 新增字段：性别 -->
      <view class="form-group">
        <text class="form-label">性别</text>
        <view class="radio-group">
          <view 
            class="radio-item"
            @tap="formData.gender = 'male'"
          >
            <view class="radio-circle" :class="{ 'radio-selected': formData.gender === 'male' }">
              <view v-if="formData.gender === 'male'" class="radio-inner"></view>
            </view>
            <text class="radio-label">男</text>
          </view>
          <view 
            class="radio-item"
            @tap="formData.gender = 'female'"
          >
            <view class="radio-circle" :class="{ 'radio-selected': formData.gender === 'female' }">
              <view v-if="formData.gender === 'female'" class="radio-inner"></view>
            </view>
            <text class="radio-label">女</text>
          </view>
        </view>
      </view>
      
      <!-- 新增字段：身份证号 -->
      <view class="form-group">
        <text class="form-label">身份证号</text>
        <input
          v-model="formData.idCard"
          class="form-input"
          placeholder="请输入身份证号"
          placeholder-class="placeholder"
          :maxlength="18"
        />
      </view>
      
      <!-- 新增字段：所属学校 -->
      <view class="form-group">
        <text class="form-label">所属学校</text>
        <input
          v-model="formData.school"
          class="form-input"
          placeholder="请输入学校名称"
          placeholder-class="placeholder"
          :maxlength="50"
        />
      </view>
      
      <!-- 新增字段：年级 -->
      <view class="form-group">
        <text class="form-label">年级</text>
        <view class="picker-container">
          <picker 
            :range="gradeOptions" 
            :value="gradeIndex"
            @change="onGradeChange"
          >
            <view class="picker-input">
              {{ formData.grade || '请选择年级' }}
            </view>
          </picker>
          <text class="picker-arrow">▼</text>
        </view>
      </view>
      
      <!-- 新增字段：专业 -->
      <view class="form-group">
        <text class="form-label">专业</text>
        <input
          v-model="formData.major"
          class="form-input"
          placeholder="请输入专业名称"
          placeholder-class="placeholder"
          :maxlength="30"
        />
      </view>
      
      <button 
        class="submit-btn" 
        type="primary" 
        @tap="onSubmit"
      >
        注册
      </button>
    </view>

    <view class="login-link" @tap="goToLogin">
      <text>已有账号？去登录</text>
    </view>
  </view>
</template>

<script>
// 使用 Vue 2 Options API
export default {
  name: 'Register',
  data() {
    return {
      formData: {
        nickname: '',
        password: '',
        phone: '',
        gender: '',      // 新增：性别
        idCard: '',      // 新增：身份证号
        school: '',      // 新增：所属学校
        grade: '',       // 新增：年级
        major: ''        // 新增：专业
      },
      gradeIndex: -1,    // 年级选择器索引
      gradeOptions: [
        '大一', '大二', '大三', '大四',
        '研一', '研二', '研三',
        '博一', '博二', '博三', '博四'
      ]
    }
  },
  methods: {
    // 表单验证
    validateForm() {
      if (!this.formData.nickname.trim()) {
        uni.showToast({
          title: '请填写昵称',
          icon: 'none'
        })
        return false
      }
      
      if (!this.formData.password.trim()) {
        uni.showToast({
          title: '请填写密码',
          icon: 'none'
        })
        return false
      }
      
      if (this.formData.password.length < 6) {
        uni.showToast({
          title: '密码至少6位',
          icon: 'none'
        })
        return false
      }
      
      if (!this.formData.phone.trim()) {
        uni.showToast({
          title: '请填写手机号',
          icon: 'none'
        })
        return false
      }
      
      // 手机号验证
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return false
      }
      
      // 新增：性别验证
      if (!this.formData.gender) {
        uni.showToast({
          title: '请选择性别',
          icon: 'none'
        })
        return false
      }
      
      // 新增：身份证号验证
      if (!this.formData.idCard.trim()) {
        uni.showToast({
          title: '请填写身份证号',
          icon: 'none'
        })
        return false
      }
      
      // 身份证号格式验证（简单版）
      const idCardRegex = /^\d{17}[\dXx]$/
      if (!idCardRegex.test(this.formData.idCard)) {
        uni.showToast({
          title: '请输入正确的身份证号',
          icon: 'none'
        })
        return false
      }
      
      // 新增：学校验证
      if (!this.formData.school.trim()) {
        uni.showToast({
          title: '请填写学校名称',
          icon: 'none'
        })
        return false
      }
      
      // 新增：年级验证
      if (!this.formData.grade) {
        uni.showToast({
          title: '请选择年级',
          icon: 'none'
        })
        return false
      }
      
      // 新增：专业验证
      if (!this.formData.major.trim()) {
        uni.showToast({
          title: '请填写专业名称',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 年级选择器变化
    onGradeChange(e) {
      const index = e.detail.value
      this.gradeIndex = index
      this.formData.grade = this.gradeOptions[index]
    },
    
    // 提交注册
    async onSubmit() {
      if (!this.validateForm()) {
        return
      }

      try {
        // 这里需要你真实的 API 调用
        // const res = await register({
        //   ...this.formData,
        //   avatarUrl: '/static/default-avatar.png'
        // })
        
        // 模拟注册成功
        uni.showLoading({
          title: '注册中...'
        })
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        uni.hideLoading()
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        })
        
        // 跳转到登录页面
        setTimeout(() => {
          uni.navigateTo({
            url: '/views/user/Login'
          })
        }, 1500)
        
      } catch (error) {
        console.error('注册失败:', error)
        uni.showToast({
          title: error.response?.data?.message || '注册失败',
          icon: 'none'
        })
      }
    },
    
    // 返回
    onClickLeft() {
      uni.navigateBack()
    },
    
    // 跳转到登录页
    goToLogin() {
      uni.navigateTo({
        url: '/views/user/Login'
      })
    }
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 0 32rpx;
}

/* 导航栏样式 */
.custom-navbar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #f0f0f0;
}

.nav-left {
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 48rpx;
  color: #323233;
  margin-right: 8rpx;
}

.back-text {
  font-size: 32rpx;
  color: #323233;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #323233;
}

.nav-right {
  width: 120rpx;
}

/* 表单容器 */
.form-container {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin-top: 40rpx;
}

.form-group {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #323233;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 96rpx;
  background: #f7f8fa;
  border: 2rpx solid #ebedf0;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  color: #323233;
  box-sizing: border-box;
}

.placeholder {
  color: #969799;
  font-size: 28rpx;
}

/* 性别单选按钮样式 */
.radio-group {
  display: flex;
  gap: 40rpx;
}

.radio-item {
  display: flex;
  align-items: center;
}

.radio-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 4rpx solid #c8c9cc;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.radio-selected {
  border-color: #1989fa;
  background-color: #1989fa;
}

.radio-inner {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: white;
}

.radio-label {
  font-size: 28rpx;
  color: #323233;
}

/* 年级选择器样式 */
.picker-container {
  position: relative;
}

.picker-input {
  width: 100%;
  height: 96rpx;
  background: #f7f8fa;
  border: 2rpx solid #ebedf0;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  color: #323233;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.picker-arrow {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #969799;
  font-size: 24rpx;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 96rpx;
  background: #1989fa;
  color: white;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  margin-top: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(25, 137, 250, 0.3);
}

.submit-btn:active {
  opacity: 0.8;
  transform: translateY(2rpx);
}

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 40rpx;
  padding: 24rpx;
}

.login-link text {
  color: #1989fa;
  font-size: 28rpx;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .register {
    padding: 0 24rpx;
  }
  
  .form-container {
    padding: 32rpx;
  }
  
  .form-group {
    margin-bottom: 32rpx;
  }
  
  .form-input {
    height: 88rpx;
    font-size: 26rpx;
  }
  
  .submit-btn {
    height: 88rpx;
    font-size: 30rpx;
  }
}
</style>