class EchoGame {
    constructor() {
        this.currentChapter = 'chapter1';
        this.currentContentIndex = 0;
        this.chapterData = null;
        this.typingSpeed = 30;
        this.isTyping = false;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('submit-password').addEventListener('click', () => {
            this.verifyPassword();
        });
        
        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyPassword();
            }
        });
        
        document.getElementById('delete-btn').addEventListener('click', () => {
            this.showEnding('delete');
        });
        
        document.getElementById('merge-btn').addEventListener('click', () => {
            this.showEnding('merge');
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('chapter-content').addEventListener('click', () => {
            this.advanceContent();
        });
        
        document.getElementById('chapter-content').addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                this.advanceContent();
            }
        });
    }
    
    async startGame() {
        this.hideScreen('welcome-screen');
        this.showScreen('chapter-screen');
        
        await this.loadChapter('chapter1');
    }
    
    async loadChapter(chapterId) {
        this.currentChapter = chapterId;
        this.currentContentIndex = 0;
        
        try {
            const response = await fetch(`/api/chapter/${chapterId}`);
            const data = await response.json();
            
            if (data.success) {
                this.chapterData = data.data;
                document.getElementById('chapter-title').textContent = this.chapterData.title;
                
                document.getElementById('text-container').innerHTML = '';
                document.getElementById('password-section').style.display = 'none';
                
                this.displayNextContent();
            } else {
                this.showMessage('password-message', data.message, 'error');
            }
        } catch (error) {
            console.error('加载章节失败:', error);
            this.showMessage('password-message', '加载失败，请刷新页面重试', 'error');
        }
    }
    
    displayNextContent() {
        if (this.isTyping) return;
        
        if (this.currentContentIndex < this.chapterData.content.length) {
            const content = this.chapterData.content[this.currentContentIndex];
            this.displayContent(content);
            this.currentContentIndex++;
        } else {
            this.showPasswordSection();
        }
    }
    
    advanceContent() {
        if (this.isTyping) {
            this.skipTyping();
        } else {
            this.displayNextContent();
        }
    }
    
    displayContent(content) {
        const container = document.getElementById('text-container');
        
        const block = document.createElement('div');
        block.className = 'content-block';
        
        const title = document.createElement('div');
        title.className = 'content-title';
        title.textContent = content.title;
        block.appendChild(title);
        
        const text = document.createElement('div');
        text.className = 'content-text';
        text.id = `text-${this.currentContentIndex}`;
        block.appendChild(text);
        
        container.appendChild(block);
        
        this.typeText(text, content.text);
    }
    
    typeText(element, text) {
        this.isTyping = true;
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                
                element.parentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
                element.parentElement.classList.add('visible');
            }
        }, this.typingSpeed);
        
        this.currentTypingInterval = typeInterval;
    }
    
    skipTyping() {
        if (this.currentTypingInterval) {
            clearInterval(this.currentTypingInterval);
        }
        
        if (this.currentContentIndex > 0) {
            const content = this.chapterData.content[this.currentContentIndex - 1];
            const textElement = document.getElementById(`text-${this.currentContentIndex - 1}`);
            if (textElement) {
                textElement.textContent = content.text;
                textElement.parentElement.classList.add('visible');
            }
        }
        
        this.isTyping = false;
    }
    
    showPasswordSection() {
        document.getElementById('password-section').style.display = 'block';
        document.getElementById('password-input').focus();
    }
    
    async verifyPassword() {
        const password = document.getElementById('password-input').value.trim();
        
        if (!password) {
            this.showMessage('password-message', '请输入密码', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chapter_id: this.currentChapter,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage('password-message', data.message, 'success');
                
                if (data.next_chapter === 'ending') {
                    setTimeout(() => {
                        this.hideScreen('chapter-screen');
                        this.showScreen('ending-screen');
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.loadChapter(data.next_chapter);
                    }, 1000);
                }
            } else {
                this.showMessage('password-message', data.message, 'error');
            }
        } catch (error) {
            console.error('验证密码失败:', error);
            this.showMessage('password-message', '验证失败，请重试', 'error');
        }
    }
    
    async showEnding(endingType) {
        try {
            const response = await fetch(`/api/ending/${endingType}`);
            const data = await response.json();
            
            if (data.success) {
                this.hideScreen('ending-screen');
                this.showScreen('ending-result-screen');
                
                document.getElementById('ending-result-title').textContent = data.data.title;
                
                const container = document.getElementById('ending-text-container');
                container.innerHTML = '';
                
                const textElement = document.createElement('div');
                textElement.className = 'content-text';
                container.appendChild(textElement);
                
                this.typeText(textElement, data.data.text);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('加载结局失败:', error);
            alert('加载失败，请重试');
        }
    }
    
    restartGame() {
        this.currentChapter = 'chapter1';
        this.currentContentIndex = 0;
        this.chapterData = null;
        
        document.getElementById('password-input').value = '';
        this.hideMessage('password-message');
        
        this.hideScreen('ending-result-screen');
        this.showScreen('welcome-screen');
    }
    
    showScreen(screenId) {
        document.getElementById(screenId).classList.add('active');
    }
    
    hideScreen(screenId) {
        document.getElementById(screenId).classList.remove('active');
    }
    
    showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.className = `message ${type}`;
    }
    
    hideMessage(elementId) {
        const element = document.getElementById(elementId);
        element.textContent = '';
        element.className = 'message';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EchoGame();
});
