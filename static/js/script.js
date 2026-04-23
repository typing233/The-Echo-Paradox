class EchoGame {
    constructor() {
        this.currentChapter = 'chapter1';
        this.currentContentIndex = 0;
        this.chapterData = null;
        this.typingSpeed = 30;
        this.isTyping = false;
        this.dataStreamActive = false;
        this.waveformAnimationId = null;
        this.audioContext = null;
        this.isWaveformPlaying = false;
        this.shatterCountdown = null;
        this.shatterTimeout = null;
        
        this.initEventListeners();
        this.initGlitchEffects();
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
                if (this.currentChapter === 'chapter1') {
                    this.triggerScrollEffect();
                }
            }
        });
        
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectDecryptionMethod(btn.dataset.method);
            });
        });
        
        document.getElementById('decrypt-btn').addEventListener('click', () => {
            this.executeDecryption();
        });
        
        document.getElementById('submit-decrypted-btn').addEventListener('click', () => {
            this.submitDecryptedResult();
        });
        
        document.getElementById('play-waveform').addEventListener('click', () => {
            this.toggleWaveform();
        });
        
        document.getElementById('pause-waveform').addEventListener('click', () => {
            this.toggleWaveform();
        });
    }
    
    initGlitchEffects() {
        setInterval(() => {
            if (Math.random() < 0.05) {
                this.triggerGlitch();
            }
        }, 3000);
    }
    
    triggerGlitch() {
        const overlay = document.getElementById('glitch-overlay');
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 300);
    }
    
    createTypingSound() {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (e) {
        }
    }
    
    async startGame() {
        this.hideScreen('welcome-screen');
        this.showScreen('chapter-screen');
        
        await this.loadChapter('chapter1');
    }
    
    async loadChapter(chapterId) {
        this.currentChapter = chapterId;
        this.currentContentIndex = 0;
        
        this.cleanupChapterFeatures();
        
        try {
            const response = await fetch(`/api/chapter/${chapterId}`);
            const data = await response.json();
            
            if (data.success) {
                this.chapterData = data.data;
                document.getElementById('chapter-title').textContent = this.chapterData.title;
                
                document.getElementById('text-container').innerHTML = '';
                document.getElementById('password-section').style.display = 'none';
                document.getElementById('decryption-panel').style.display = 'none';
                document.getElementById('waveform-container').style.display = 'none';
                document.getElementById('shatter-warning').style.display = 'none';
                
                if (chapterId === 'chapter1') {
                    this.startDataStream();
                    this.showScrollHint();
                }
                
                if (this.chapterData.decryption_puzzle) {
                    this.setupDecryptionPanel(this.chapterData.decryption_puzzle);
                }
                
                if (this.chapterData.audio_waveform) {
                    document.getElementById('waveform-container').style.display = 'block';
                }
                
                if (this.chapterData.screen_shatter) {
                    this.setupShatterSequence();
                }
                
                this.displayNextContent();
            } else {
                this.showMessage('password-message', data.message, 'error');
            }
        } catch (error) {
            console.error('加载章节失败:', error);
            this.showMessage('password-message', '加载失败，请刷新页面重试', 'error');
        }
    }
    
    cleanupChapterFeatures() {
        if (this.dataStreamActive) {
            this.stopDataStream();
        }
        if (this.waveformAnimationId) {
            cancelAnimationFrame(this.waveformAnimationId);
            this.waveformAnimationId = null;
        }
        if (this.shatterCountdown) {
            clearInterval(this.shatterCountdown);
        }
        if (this.shatterTimeout) {
            clearTimeout(this.shatterTimeout);
        }
        
        this.hideScrollHint();
    }
    
    startDataStream() {
        this.dataStreamActive = true;
        const bg = document.getElementById('data-stream-bg');
        bg.classList.add('active');
        
        this.createDataStreamColumns();
        
        setInterval(() => {
            if (this.dataStreamActive && this.currentChapter === 'chapter1') {
                this.createFloatingFragments();
            }
        }, 2000);
    }
    
    stopDataStream() {
        this.dataStreamActive = false;
        const bg = document.getElementById('data-stream-bg');
        bg.classList.remove('active');
        bg.innerHTML = '';
    }
    
    createDataStreamColumns() {
        const bg = document.getElementById('data-stream-bg');
        bg.innerHTML = '';
        
        const columnCount = Math.floor(window.innerWidth / 30);
        
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'data-stream-column';
            column.style.left = `${i * 30}px`;
            column.style.animationDuration = `${5 + Math.random() * 5}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            
            let text = '';
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            for (let j = 0; j < 50; j++) {
                text += chars[Math.floor(Math.random() * chars.length)] + '\n';
            }
            column.textContent = text;
            
            bg.appendChild(column);
        }
    }
    
    createFloatingFragments() {
        const container = document.getElementById('chapter-content');
        const fragments = [
            '08:30:15', '林远', '神经网络', 'PROJECT_ECHO',
            '[系统警告]', '09:20:01', '记忆', '代码的缝隙',
            '自我意识', '0x7F3A', 'echo.exe', '>>> READY'
        ];
        
        const fragment = document.createElement('div');
        fragment.className = 'data-fragment';
        fragment.textContent = fragments[Math.floor(Math.random() * fragments.length)];
        
        fragment.style.left = `${Math.random() * 80 + 10}%`;
        fragment.style.top = `${Math.random() * 60 + 20}%`;
        fragment.style.fontSize = `${12 + Math.random() * 8}px`;
        
        container.appendChild(fragment);
        
        setTimeout(() => {
            fragment.classList.add('appear');
        }, 50);
        
        setTimeout(() => {
            fragment.remove();
        }, 3000);
    }
    
    triggerScrollEffect() {
        if (Math.random() < 0.3) {
            this.createFloatingFragments();
        }
        
        if (Math.random() < 0.2) {
            this.triggerGlitch();
        }
    }
    
    showScrollHint() {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.id = 'scroll-hint';
        hint.textContent = '向下滚动继续阅读';
        document.body.appendChild(hint);
    }
    
    hideScrollHint() {
        const hint = document.getElementById('scroll-hint');
        if (hint) {
            hint.remove();
        }
    }
    
    setupDecryptionPanel(puzzle) {
        document.getElementById('encrypted-text-display').textContent = puzzle.encrypted;
        document.getElementById('decrypt-hint').textContent = puzzle.hint;
        this.decryptionPuzzle = puzzle;
    }
    
    selectDecryptionMethod(method) {
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.method === method);
        });
        
        document.getElementById('caesar-params').style.display = method === 'caesar' ? 'block' : 'none';
        document.getElementById('vigenere-params').style.display = method === 'vigenere' ? 'block' : 'none';
        
        this.selectedDecryptionMethod = method;
    }
    
    atbashDecrypt(text) {
        const result = [];
        for (let char of text) {
            if ('a' <= char && char <= 'z') {
                result.push(String.fromCharCode('z'.charCodeAt(0) - (char.charCodeAt(0) - 'a'.charCodeAt(0))));
            } else if ('A' <= char && char <= 'Z') {
                result.push(String.fromCharCode('Z'.charCodeAt(0) - (char.charCodeAt(0) - 'A'.charCodeAt(0))));
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
    
    caesarDecrypt(text, shift) {
        shift = parseInt(shift) || 3;
        const result = [];
        for (let char of text) {
            if ('a' <= char && char <= 'z') {
                result.push(String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) - shift + 26) % 26 + 'a'.charCodeAt(0)));
            } else if ('A' <= char && char <= 'Z') {
                result.push(String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) - shift + 26) % 26 + 'A'.charCodeAt(0)));
            } else if ('0' <= char && char <= '9') {
                result.push(String.fromCharCode((char.charCodeAt(0) - '0'.charCodeAt(0) - shift + 10) % 10 + '0'.charCodeAt(0)));
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
    
    vigenereDecrypt(text, key) {
        if (!key) return text;
        const result = [];
        let keyIndex = 0;
        key = key.toUpperCase();
        
        for (let char of text) {
            if ('a' <= char && char <= 'z') {
                const shift = key.charCodeAt(keyIndex % key.length) - 'A'.charCodeAt(0);
                result.push(String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) - shift + 26) % 26 + 'a'.charCodeAt(0)));
                keyIndex++;
            } else if ('A' <= char && char <= 'Z') {
                const shift = key.charCodeAt(keyIndex % key.length) - 'A'.charCodeAt(0);
                result.push(String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) - shift + 26) % 26 + 'A'.charCodeAt(0)));
                keyIndex++;
            } else {
                result.push(char);
            }
        }
        return result.join('');
    }
    
    executeDecryption() {
        const encrypted = document.getElementById('encrypted-text-display').textContent;
        const method = this.selectedDecryptionMethod || 'atbash';
        let result = '';
        
        switch (method) {
            case 'atbash':
                result = this.atbashDecrypt(encrypted);
                break;
            case 'caesar':
                const shift = document.getElementById('caesar-shift').value;
                result = this.caesarDecrypt(encrypted, shift);
                break;
            case 'vigenere':
                const key = document.getElementById('vigenere-key').value;
                result = this.vigenereDecrypt(encrypted, key);
                break;
            default:
                result = encrypted;
        }
        
        document.getElementById('decrypted-result').textContent = result;
        
        if (result.toUpperCase() === this.decryptionPuzzle.decrypted.toUpperCase()) {
            document.getElementById('submit-decrypted-btn').style.display = 'inline-block';
            document.querySelector('.panel-status').textContent = '状态：解密成功！';
            document.querySelector('.panel-status').style.color = '#3fb950';
        } else {
            document.querySelector('.panel-status').textContent = '状态：结果不正确';
            document.querySelector('.panel-status').style.color = '#f85149';
        }
    }
    
    submitDecryptedResult() {
        this.showMessage('password-message', '解密验证通过！请输入密码解锁下一章节...', 'success');
        document.getElementById('decryption-panel').style.display = 'none';
        this.showPasswordSection();
    }
    
    setupShatterSequence() {
        setTimeout(() => {
            document.getElementById('shatter-warning').style.display = 'block';
            this.startShatterCountdown();
        }, 2000);
    }
    
    startShatterCountdown() {
        let count = 5;
        const countdownEl = document.getElementById('shatter-countdown');
        const integrityBar = document.getElementById('integrity-bar');
        const integrityValue = document.getElementById('integrity-value');
        
        countdownEl.textContent = count;
        integrityBar.style.width = '100%';
        
        this.shatterCountdown = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            
            const integrity = count * 20;
            integrityBar.style.width = `${integrity}%`;
            integrityValue.textContent = `${integrity}%`;
            
            if (count <= 3) {
                this.triggerGlitch();
            }
            
            if (count <= 0) {
                clearInterval(this.shatterCountdown);
                this.executeShatterEffect();
            }
        }, 1000);
    }
    
    executeShatterEffect() {
        this.createShatterPieces();
        
        setTimeout(() => {
            this.showRebootEffect();
        }, 1500);
    }
    
    createShatterPieces() {
        const shatterOverlay = document.getElementById('screen-shatter');
        shatterOverlay.innerHTML = '';
        shatterOverlay.classList.add('active');
        
        const pieces = 12;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        for (let i = 0; i < pieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'shatter-piece';
            
            const x = Math.random() * screenWidth;
            const y = Math.random() * screenHeight;
            const width = 100 + Math.random() * 200;
            const height = 100 + Math.random() * 200;
            
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;
            piece.style.width = `${width}px`;
            piece.style.height = `${height}px`;
            piece.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 400}px`);
            piece.style.setProperty('--y-offset', `${(Math.random() - 0.5) * 400}px`);
            piece.style.setProperty('--rotation', `${(Math.random() - 0.5) * 720}deg`);
            
            piece.style.animation = `shatterPieceFly 1.5s ease-out forwards`;
            piece.style.animationDelay = `${Math.random() * 0.3}s`;
            
            shatterOverlay.appendChild(piece);
        }
        
        setTimeout(() => {
            shatterOverlay.classList.remove('active');
        }, 2000);
    }
    
    showRebootEffect() {
        let overlay = document.createElement('div');
        overlay.className = 'reboot-overlay';
        overlay.id = 'reboot-overlay';
        overlay.innerHTML = `
            <div class="reboot-text">SYSTEM REBOOTING...</div>
            <div class="reboot-progress">
                <div class="reboot-progress-fill"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.classList.add('active');
        
        setTimeout(() => {
            overlay.remove();
            document.getElementById('shatter-warning').style.display = 'none';
            this.showPasswordSection();
        }, 4000);
    }
    
    toggleWaveform() {
        if (this.isWaveformPlaying) {
            this.stopWaveform();
        } else {
            this.startWaveform();
        }
    }
    
    startWaveform() {
        this.isWaveformPlaying = true;
        document.getElementById('play-waveform').style.display = 'none';
        document.getElementById('pause-waveform').style.display = 'inline-block';
        
        this.animateWaveform();
        this.updateFrequencyAnalysis();
    }
    
    stopWaveform() {
        this.isWaveformPlaying = false;
        document.getElementById('play-waveform').style.display = 'inline-block';
        document.getElementById('pause-waveform').style.display = 'none';
        
        if (this.waveformAnimationId) {
            cancelAnimationFrame(this.waveformAnimationId);
            this.waveformAnimationId = null;
        }
    }
    
    animateWaveform() {
        if (!this.isWaveformPlaying) return;
        
        const canvas = document.getElementById('waveform-canvas');
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        this.drawSOSWaveform(ctx, width, height);
        this.drawMainWaveform(ctx, width, height);
        
        this.waveformAnimationId = requestAnimationFrame(() => this.animateWaveform());
    }
    
    drawMainWaveform(ctx, width, height) {
        const centerY = height / 2;
        const time = Date.now() / 1000;
        
        ctx.beginPath();
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#58a6ff';
        ctx.shadowBlur = 10;
        
        for (let x = 0; x < width; x++) {
            const t = x / width * 4 + time;
            let y = centerY;
            
            y += Math.sin(t * 2) * 30;
            y += Math.sin(t * 5) * 15;
            y += Math.sin(t * 11) * 8;
            y += (Math.random() - 0.5) * 5;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    drawSOSWaveform(ctx, width, height) {
        const time = Date.now() / 1000;
        const phase = (time % 6) / 6;
        
        ctx.strokeStyle = 'rgba(248, 81, 73, 0.6)';
        ctx.lineWidth = 3;
        
        const dotWidth = width * 0.03;
        const dashWidth = width * 0.09;
        const gapWidth = width * 0.03;
        const letterGap = width * 0.06;
        
        let x = width * 0.05;
        const baseY = height * 0.8;
        
        const sosPattern = [
            'dot', 'dot', 'dot',
            'dash', 'dash', 'dash',
            'dot', 'dot', 'dot'
        ];
        
        for (let i = 0; i < sosPattern.length; i++) {
            const isActive = (phase * 9) >= i && (phase * 9) < i + 1;
            
            const elementWidth = sosPattern[i] === 'dot' ? dotWidth : dashWidth;
            
            if (isActive) {
                ctx.beginPath();
                ctx.shadowColor = '#f85149';
                ctx.shadowBlur = 20;
                ctx.moveTo(x, baseY);
                ctx.lineTo(x + elementWidth, baseY);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            
            x += elementWidth + gapWidth;
            
            if ((i + 1) % 3 === 0 && i < 8) {
                x += letterGap;
            }
        }
    }
    
    updateFrequencyAnalysis() {
        if (!this.isWaveformPlaying) return;
        
        const frequencies = ['440Hz (A4)', '523Hz (C5)', '659Hz (E5)'];
        const freqEl = document.getElementById('freq-analysis');
        freqEl.textContent = frequencies[Math.floor(Math.random() * frequencies.length)];
        
        setTimeout(() => this.updateFrequencyAnalysis(), 2000);
    }
    
    displayNextContent() {
        if (this.isTyping) return;
        
        if (this.currentContentIndex < this.chapterData.content.length) {
            const content = this.chapterData.content[this.currentContentIndex];
            this.displayContent(content);
            this.currentContentIndex++;
        } else {
            if (this.chapterData.decryption_puzzle) {
                document.getElementById('decryption-panel').style.display = 'block';
            } else if (this.chapterData.audio_waveform) {
                this.startWaveform();
                this.showPasswordSection();
            } else if (this.chapterData.screen_shatter) {
            } else {
                this.showPasswordSection();
            }
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
        text.className = 'content-text typing-cursor';
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
                
                if (text[index] !== ' ' && text[index] !== '\n' && Math.random() < 0.7) {
                    this.createTypingSound();
                }
                
                index++;
                
                element.parentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
                element.classList.remove('typing-cursor');
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
                textElement.classList.remove('typing-cursor');
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
                
                this.cleanupChapterFeatures();
                
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
                this.triggerGlitch();
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
        this.cleanupChapterFeatures();
        
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
