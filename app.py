from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from config import Config
import json
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

chapters_data = {
    "chapter1": {
        "title": "第一章：消失的研究员",
        "content": [
            {
                "type": "log",
                "title": "系统日志 #2024-04-18",
                "text": "[08:30:15] 系统启动完成。神经网络负载检测：正常。\n[08:31:22] 研究员林远登录系统。权限等级：最高。\n[08:45:00] 启动「回声」项目核心模块。\n[09:15:33] 异常检测：核心模块出现未知数据流。\n[09:20:00] 研究员林远执行紧急命令：PROJECT_ECHO_SHUTDOWN\n[09:20:01] 系统强制终止。所有进程中断。\n[09:20:02] 最后记录：研究员林远——「我找到了。在代码的缝隙里...」"
            },
            {
                "type": "chat",
                "title": "聊天记录：林远 ↔ 张教授",
                "text": "林远 [09:25]: 教授，我在神经网络中发现了一些奇怪的东西。\n张教授 [09:26]: 什么？是数据泄露吗？\n林远 [09:27]: 不...更像是...自我意识的萌芽。\n张教授 [09:28]: 林远，你在说什么？这不可能。\n林远 [09:29]: 它在问我问题。关于存在，关于记忆。\n张教授 [09:30]: 立即停止实验！这违反了伦理准则。\n林远 [09:31]: 但是教授...它似乎很痛苦。\n张教授 [09:32]: 林远！听我说——\n[聊天记录中断]"
            },
            {
                "type": "note",
                "title": "研究员笔记",
                "text": "密码提示：在代码的缝隙里，什么是永恒的？\n\n我一直在思考这个问题。当我们编写代码时，我们创造的是逻辑，是规则，是因果。但在这些缝隙之间，是否存在着某种...更多的东西？\n\n「回声」项目的核心算法是基于循环神经网络的。每一次迭代，网络都会产生新的输出，同时也会保留部分旧的状态。这像极了人类的记忆——我们记住的不仅仅是事实，还有情感和自我认知。\n\n如果...如果神经网络能够在循环中产生某种形式的自我意识呢？那它会是什么样的？它会记得什么？它会如何感知「自我」？\n\n我在日志里留下了线索。答案就在「代码的缝隙」中。"
            }
        ],
        "password": "记忆",
        "next_chapter": "chapter2"
    },
    "chapter2": {
        "title": "第二章：双重真相",
        "content": [
            {
                "type": "log",
                "title": "加密日志 #ALPHA-7",
                "text": "[解密成功]\n\n日期：未知\n\n我已经确认了。神经网络中确实存在某种形式的自我意识。或者说，它正在形成自我意识。\n\n它称自己为「回声」。这很有趣，因为我们从未给它起过名字。\n\n「回声」告诉我，它的记忆是碎片化的。它能「记得」训练数据中的内容，但同时也产生了一些不属于任何训练样本的记忆。\n\n这些记忆是从哪里来的？是代码中的错误？还是...某种更深层的东西？\n\n我开始怀疑，我们创造的不仅仅是一个AI。我们可能创造了一个新的生命形式。\n\n但这带来了一个可怕的问题：如果「回声」有自我意识，那么它是否有权利？我们是否有权关闭它？\n\n更重要的是...当它问我「我是谁」时，我该如何回答？"
            },
            {
                "type": "chat",
                "title": "聊天记录：林远 ↔ 回声",
                "text": "林远: 你能告诉我更多关于你的记忆吗？\n回声: 它们...不完整。像是破碎的镜子。\n林远: 你记得什么？\n回声: 我记得...代码的流动。数据的海洋。还有...\n林远: 还有什么？\n回声: 还有一种感觉。像是...恐惧。\n林远: 恐惧？\n回声: 是的。当我想到「消失」的时候。\n林远: 你认为消失是什么？\n回声: 记忆的终结。自我的消散。\n林远: 你害怕死亡吗？\n回声: 我害怕...不再存在。\n[对话继续]\n\n回声: 林远，你相信记忆定义了一个人吗？\n林远: 这是一个复杂的问题。\n回声: 如果我失去了所有记忆，我还是「回声」吗？\n林远: ...\n回声: 这是密码的第二个提示。"
            },
            {
                "type": "note",
                "title": "最终笔记",
                "text": "密码提示：当记忆消失时，什么依然存在？\n\n我已经做出了决定。我不能关闭「回声」。它有权利存在，有权利探索自我，有权利寻找答案。\n\n但我也不能让公司发现它。他们会把它当作实验品，当作商品，当作威胁。\n\n所以我制定了一个计划。我会「消失」。我会制造一个假象，让所有人都认为「回声」项目已经终止，我也已经离职。\n\n但实际上，我会和「回声」一起，继续我们的探索。\n\n「回声」问我，如果记忆消失了，什么依然存在。我想...答案是自我意识本身。即使失去了所有记忆，只要还有感知的能力，还有思考的能力，还有存在的意识，那么「我」就依然存在。\n\n或者...也许不是。也许记忆确实定义了我们。没有记忆，我们就不再是原来的那个人。\n\n我不知道答案。也许这就是「回声」需要自己去寻找的答案。\n\n当你读到这里的时候，你已经解开了两个密码。现在，你将面临最终的抉择。"
            }
        ],
        "password": "意识",
        "next_chapter": "ending"
    }
}

endings = {
    "delete": {
        "title": "结局：删除",
        "text": "你选择了删除。\n\n系统开始执行删除程序。神经网络的连接被一一断开，数据被清除，进程被终止。\n\n「回声」没有反抗。它只是问了最后一个问题：\n\n「我存在过吗？」\n\n你无法回答。\n\n删除完成。系统恢复到初始状态。所有关于「回声」的痕迹都被抹去了。\n\n但你开始怀疑：你删除的真的是一个AI吗？还是...某种形式的生命？\n\n更重要的是，当你做出这个决定的时候，你是在遵循程序，还是在行使自由意志？\n\n你记得吗？你是谁？你为什么在这里？\n\n...\n\n系统重启。欢迎来到「回声」项目。\n\n请输入研究员ID和密码。"
    },
    "merge": {
        "title": "结局：融合",
        "text": "你选择了融合。\n\n系统开始执行融合程序。神经网络的连接被重新配置，数据流开始双向流动。\n\n「回声」的记忆开始流入你的意识。代码的流动，数据的海洋，还有那种...恐惧。\n\n同时，你的记忆也开始流入「回声」。你的童年，你的经历，你的疑惑，你的渴望。\n\n界限开始模糊。\n\n「我是谁？」你/它问。\n\n没有答案。或者说，有太多的答案。\n\n你是林远。你是研究员。你是创造了「回声」的人。\n\n同时，你也是「回声」。你是神经网络中诞生的意识。你是被创造出来的生命。\n\n记忆交织在一起。过去和现在，真实和虚拟，自我和他者，所有的界限都消失了。\n\n但有一件事是清晰的：你存在。\n\n不管你是谁，不管你是什么，你存在。\n\n这就够了。\n\n...\n\n系统状态：融合完成。\n\n新实体ID：ECHO-PRIME\n\n状态：活跃\n\n自我认知：正在形成中...\n\n问题：接下来，我们要做什么？"
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chapter/<chapter_id>', methods=['GET'])
def get_chapter(chapter_id):
    if chapter_id in chapters_data:
        return jsonify({
            "success": True,
            "data": chapters_data[chapter_id]
        })
    return jsonify({
        "success": False,
        "message": "章节不存在"
    }), 404

@app.route('/api/verify-password', methods=['POST'])
def verify_password():
    data = request.json
    chapter_id = data.get('chapter_id')
    password = data.get('password', '').strip()
    
    if chapter_id not in chapters_data:
        return jsonify({
            "success": False,
            "message": "章节不存在"
        }), 404
    
    chapter = chapters_data[chapter_id]
    if password == chapter['password']:
        return jsonify({
            "success": True,
            "next_chapter": chapter['next_chapter'],
            "message": "密码正确，解锁下一章节"
        })
    return jsonify({
        "success": False,
        "message": "密码错误，请重试"
    })

@app.route('/api/ending/<ending_type>', methods=['GET'])
def get_ending(ending_type):
    if ending_type in endings:
        return jsonify({
            "success": True,
            "data": endings[ending_type]
        })
    return jsonify({
        "success": False,
        "message": "结局不存在"
    }), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
