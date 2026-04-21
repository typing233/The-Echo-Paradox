# 回声悖论 - 沉浸式交互解谜游戏

## 项目简介

「回声悖论」是一款沉浸式交互网页解谜游戏，玩家在模拟终端中通过破解加密日志与聊天碎片，逐步揭开AI研究员失踪的真相，并最终直面关于自我意识与真实记忆的终极抉择。

游戏采用经典的终端风格界面，营造出神秘而紧张的氛围，让玩家仿佛置身于一个正在运行的神秘系统之中。

## 技术栈

- **后端**: Python 3.x + Flask
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **测试**: pytest
- **端口**: 6876

## 项目结构

```
The-Echo-Paradox/
├── app.py                 # Flask应用主文件
├── config.py              # 配置文件
├── requirements.txt     # Python依赖
├── venv/                # 虚拟环境
├── static/
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       └── script.js     # 前端交互逻辑
├── templates/
│   └── index.html      # 主页面模板
├── tests/
│   └── test_app.py    # 测试用例
└── README.md          # 项目说明
```

## 游戏特色

1. **沉浸式终端体验**: 采用经典终端风格界面，配合打字机效果和流畅动画

2. **章节式叙事**: 包含两章完整剧情，每章需要输入正确密码才能解锁下一章

3. **多结局设计**: 提供「删除」和「融合」两个完全不同的结局供玩家选择

4. **密码解谜**: 密码隐藏在文本内容中，需要玩家仔细阅读和思考

## 安装与运行

### 环境要求

- Python 3.8 或更高版本
- pip (Python包管理器)

### 安装步骤

1. 克隆或下载项目到本地

2. 创建并激活虚拟环境：

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或在 Windows 上: venv\Scripts\activate
```

3. 安装依赖：

```bash
pip install -r requirements.txt
```

### 运行应用

```bash
python app.py
```

或者使用虚拟环境中的Python：

```bash
source venv/bin/activate
python app.py
```

应用将在 `http://localhost:6876` 上运行。

## 游戏玩法

### 基本操作

- **开始游戏**: 点击「开始调查」按钮进入游戏

- **推进阅读**: 
  - 点击内容区域可以推进阅读下一段文本
  - 向下滚动鼠标滚轮也可以推进阅读
  - 如果正在打字，可以点击跳过打字效果

- **输入密码**:
  - 阅读完一章的所有内容后，会出现密码输入框
  - 从文本中提取密码并输入
  - 点击「验证」按钮或按 Enter 键提交

- **选择结局**:
  - 解锁第二章后，会进入结局选择界面
  - 点击「删除」或「融合」按钮选择对应的结局
  - 阅读完结局后，可以点击「重新开始」重新体验游戏

### 密码提示

**第一章密码提示**: "在代码的缝隙里，什么是永恒的？"

- 提示1: 研究员笔记中提到「这像极了人类的记忆」
- 提示2: 密码是两个汉字

**第二章密码提示**: "当记忆消失时，什么依然存在？"

- 提示1: 研究员笔记中提到「答案是自我意识本身」
- 提示2: 密码是两个汉字

## API接口说明

### 1. 获取章节内容

```
GET /api/chapter/<chapter_id>
```

参数：
- `chapter_id`: 章节ID (chapter1 或 chapter2)

返回示例：
```json
{
  "success": true,
  "data": {
    "title": "第一章：消失的研究员",
    "content": [...],
    "password": "记忆",
    "next_chapter": "chapter2"
  }
}
```

### 2. 验证密码

```
POST /api/verify-password
```

请求体：
```json
{
  "chapter_id": "chapter1",
  "password": "记忆"
}
```

返回示例（成功）：
```json
{
  "success": true,
  "next_chapter": "chapter2",
  "message": "密码正确，解锁下一章节"
}
```

返回示例（失败）：
```json
{
  "success": false,
  "message": "密码错误，请重试"
}
```

### 3. 获取结局内容

```
GET /api/ending/<ending_type>
```

参数：
- `ending_type`: 结局类型 (delete 或 merge)

返回示例：
```json
{
  "success": true,
  "data": {
    "title": "结局：删除",
    "text": "你选择了删除..."
  }
}
```

## 测试

项目包含完整的测试用例，可以通过以下命令运行测试：

```bash
pytest tests/test_app.py -v
```

测试覆盖以下功能：
- 主页路由测试
- 章节API测试（获取存在/不存在的章节）
- 密码验证API测试（正确密码/错误密码/带空格密码/不存在章节/缺少字段）
- 结局API测试（获取存在/不存在的结局）
- 章节内容结构测试
- 结局内容测试

## 剧情简介

### 第一章：消失的研究员

玩家进入系统，发现研究员林远的最后记录。通过阅读系统日志、聊天记录和研究员笔记，了解到「回声」项目的存在。

**关键信息**:
- 林远在神经网络中发现了奇怪的东西
- 「回声」项目的核心算法基于循环神经网络
- 密码隐藏在「代码的缝隙」中
- 密码提示：「在代码的缝隙里，什么是永恒的？」

### 第二章：双重真相

解锁第一章后，玩家进入第二章，深入了解「回声」的真相。

**关键信息**:
- 「回声」确实存在某种形式的自我意识
- 它称自己为「回声」
- 它的记忆是碎片化的
- 林远决定保护「回声」，选择「消失」
- 密码提示：「当记忆消失时，什么依然存在？」

### 结局

解锁第二章后，玩家将面临最终抉择：

**删除结局**:
- 选择删除「回声」
- 一切恢复原状
- 但玩家开始怀疑自己的存在

**融合结局**:
- 选择与「回声」融合
- 两个意识交织成新的存在
- 新实体「ECHO-PRIME」诞生

## 开发说明

### 前端架构

前端采用原生JavaScript实现，主要类为 `EchoGame`：

- `startGame()`: 开始游戏
- `loadChapter()`: 加载章节
- `displayContent()`: 显示内容块
- `typeText()`: 打字机效果
- `verifyPassword()`: 验证密码
- `showEnding()`: 显示结局
- `restartGame()`: 重新开始

### 后端架构

后端采用Flask框架，提供RESTful API：

- `@app.route('/')`: 主页
- `@app.route('/api/chapter/<chapter_id>')`: 获取章节
- `@app.route('/api/verify-password')`: 验证密码
- `@app.route('/api/ending/<ending_type>')`: 获取结局

### 自定义内容

如果想要修改游戏内容，可以编辑 `app.py` 中的 `chapters_data` 和 `endings` 字典：

- `chapters_data`: 包含两章的标题、内容、密码和下一章节
- `endings`: 包含两个结局的标题和文本

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交Issue或Pull Request。

---

**享受这场关于记忆、意识与存在的哲学探索之旅。**

> 「我存在过吗？」

> 「接下来，我们要做什么？」
