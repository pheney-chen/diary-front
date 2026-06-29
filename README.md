# 每日日记 - 微信小程序

一款原生微信小程序日记应用，支持文字、语音、图片、视频四种日记类型，记录生活中的每一天。

## 功能特性

### 核心功能

- **文字日记**：支持富文本编辑，随心记录每日心情与故事
- **语音日记**：录音功能，用声音记录当下的感受
- **图片日记**：支持多图上传，用画面定格美好瞬间
- **视频日记**：支持视频录制与上传，动态记录生活
- **混合日记**：一篇日记可同时包含文字、语音、图片、视频多种类型

### 辅助功能

- **日历视图**：按日期浏览日记，直观查看记录足迹
- **日记搜索**：按关键词快速查找历史日记
- **分类标签**：自定义标签，轻松管理日记分类
- **本地存储**：数据本地持久化，隐私安全有保障
- **主题切换**：多种主题风格，打造个性化日记空间

## 技术栈

- **框架**：原生微信小程序（WXML + WXSS + JavaScript）
- **存储**：微信小程序本地存储（wx.setStorage / wx.getStorage）
- **媒体能力**：
  - 录音：`wx.getRecorderManager()`
  - 拍照/相册：`wx.chooseMedia()`
  - 视频录制：`wx.chooseMedia()`
- **UI 组件**：微信小程序原生组件 + 自定义组件

## 目录结构

```
├── app.js              # 小程序入口文件
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
├── sitemap.json        # 站点地图配置
├── pages/              # 页面目录
│   ├── index/          # 首页（日记列表）
│   ├── diary-detail/   # 日记详情
│   ├── diary-edit/     # 日记编辑/新建
│   ├── calendar/       # 日历视图
│   └── profile/        # 个人中心
├── components/         # 自定义组件
│   ├── diary-card/     # 日记卡片组件
│   ├── voice-player/   # 语音播放器组件
│   ├── image-preview/  # 图片预览组件
│   └── video-player/   # 视频播放器组件
├── utils/              # 工具函数
│   ├── storage.js      # 本地存储封装
│   ├── date.js         # 日期处理工具
│   ├── media.js        # 媒体处理工具
│   └── util.js         # 通用工具函数
└── assets/             # 静态资源
    ├── images/         # 图片资源
    └── icons/          # 图标资源
```

## 快速开始

### 环境要求

- 微信开发者工具（最新稳定版）
- 微信小程序开发账号

### 安装步骤

1. **克隆项目**

```bash
git clone <仓库地址>
cd diary-front
```

2. **导入项目**

   - 打开微信开发者工具
   - 选择「导入项目」
   - 选择项目目录为当前仓库根目录
   - 填写 AppID（测试可使用测试号）
   - 点击「导入」

3. **运行项目**

   导入成功后，微信开发者工具会自动编译运行，在模拟器中即可预览效果。

## 开发指南

### 新增页面

1. 在 `pages/` 目录下创建页面文件夹
2. 创建页面的 `.js`、`.json`、`.wxml`、`.wxss` 四个文件
3. 在 `app.json` 的 `pages` 数组中添加页面路径

### 数据存储

日记数据采用本地存储方案，数据结构如下：

```javascript
// 日记数据结构
{
  id: '唯一标识',
  title: '日记标题',
  content: '文字内容',
  type: 'mixed', // text | voice | image | video | mixed
  images: ['图片路径数组'],
  video: '视频路径',
  voice: '语音路径',
  voiceDuration: 0, // 语音时长（秒）
  tags: ['标签数组'],
  mood: '心情',
  createTime: '创建时间戳',
  updateTime: '更新时间戳'
}
```

### 核心 API

| 模块 | 方法 | 说明 |
|------|------|------|
| storage | saveDiary(diary) | 保存日记 |
| storage | getDiary(id) | 获取单篇日记 |
| storage | getDiaryList() | 获取日记列表 |
| storage | deleteDiary(id) | 删除日记 |
| storage | searchDiaries(keyword) | 搜索日记 |
| media | recordVoice() | 开始录音 |
| media | stopRecord() | 停止录音 |
| media | chooseImages(count) | 选择图片 |
| media | chooseVideo() | 选择视频 |

## 项目配置

### app.json 主要配置

- `pages`：页面路径列表
- `window`：全局窗口样式
- `tabBar`：底部导航栏配置
- `permission`：权限声明

### 权限说明

- `scope.record`：录音权限（语音日记）
- `scope.writePhotosAlbum`：保存到相册
- `scope.camera`：拍照/录像权限

## 部署发布

1. 在微信开发者工具中点击「上传」
2. 填写版本号和项目备注
3. 登录微信公众平台 → 版本管理 → 提交审核
4. 审核通过后点击发布

## 许可证

MIT License
