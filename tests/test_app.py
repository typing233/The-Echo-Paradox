import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


class TestRoutes:
    def test_index_route(self, client):
        """测试主页路由"""
        response = client.get('/')
        assert response.status_code == 200
        assert b'ECHO SYSTEM' in response.data


class TestChapterAPI:
    def test_get_existing_chapter1(self, client):
        """测试获取存在的第一章"""
        response = client.get('/api/chapter/chapter1')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert 'data' in data
        assert 'title' in data['data']
        assert 'content' in data['data']
        assert 'password' in data['data']
        assert 'next_chapter' in data['data']
        assert data['data']['title'] == '第一章：消失的研究员'
        assert data['data']['password'] == '记忆'
        assert data['data']['next_chapter'] == 'chapter2'

    def test_get_existing_chapter2(self, client):
        """测试获取存在的第二章"""
        response = client.get('/api/chapter/chapter2')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert data['data']['title'] == '第二章：双重真相'
        assert data['data']['password'] == '意识'
        assert data['data']['next_chapter'] == 'ending'

    def test_get_non_existing_chapter(self, client):
        """测试获取不存在的章节"""
        response = client.get('/api/chapter/chapter999')
        assert response.status_code == 404
        
        data = response.get_json()
        assert data['success'] is False
        assert 'message' in data


class TestPasswordAPI:
    def test_verify_correct_password_chapter1(self, client):
        """测试第一章正确密码验证"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter1', 'password': '记忆'},
            content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert data['next_chapter'] == 'chapter2'
        assert 'message' in data

    def test_verify_correct_password_chapter2(self, client):
        """测试第二章正确密码验证"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter2', 'password': '意识'},
            content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert data['next_chapter'] == 'ending'

    def test_verify_wrong_password(self, client):
        """测试错误密码验证"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter1', 'password': '错误密码'},
            content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is False
        assert 'message' in data

    def test_verify_password_with_whitespace(self, client):
        """测试密码前后有空格的情况"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter1', 'password': ' 记忆 '},
            content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True

    def test_verify_password_non_existing_chapter(self, client):
        """测试对不存在的章节验证密码"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter999', 'password': '记忆'},
            content_type='application/json')
        
        assert response.status_code == 404
        
        data = response.get_json()
        assert data['success'] is False

    def test_verify_password_missing_fields(self, client):
        """测试缺少必要字段"""
        response = client.post('/api/verify-password', 
            json={'chapter_id': 'chapter1'},
            content_type='application/json')
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is False


class TestEndingAPI:
    def test_get_delete_ending(self, client):
        """测试获取删除结局"""
        response = client.get('/api/ending/delete')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert 'data' in data
        assert 'title' in data['data']
        assert 'text' in data['data']
        assert data['data']['title'] == '结局：删除'

    def test_get_merge_ending(self, client):
        """测试获取融合结局"""
        response = client.get('/api/ending/merge')
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['success'] is True
        assert data['data']['title'] == '结局：融合'

    def test_get_non_existing_ending(self, client):
        """测试获取不存在的结局"""
        response = client.get('/api/ending/invalid')
        assert response.status_code == 404
        
        data = response.get_json()
        assert data['success'] is False


class TestChapterContent:
    def test_chapter1_has_correct_content(self, client):
        """测试第一章内容结构"""
        response = client.get('/api/chapter/chapter1')
        data = response.get_json()
        
        content = data['data']['content']
        assert len(content) == 3
        
        assert content[0]['type'] == 'log'
        assert content[0]['title'] == '系统日志 #2024-04-18'
        assert '林远' in content[0]['text']
        
        assert content[1]['type'] == 'chat'
        assert content[1]['title'] == '聊天记录：林远 ↔ 张教授'
        assert '神经网络' in content[1]['text']
        
        assert content[2]['type'] == 'note'
        assert content[2]['title'] == '研究员笔记'
        assert '密码提示' in content[2]['text']

    def test_chapter2_has_correct_content(self, client):
        """测试第二章内容结构"""
        response = client.get('/api/chapter/chapter2')
        data = response.get_json()
        
        content = data['data']['content']
        assert len(content) == 3
        
        assert content[0]['type'] == 'log'
        assert content[0]['title'] == '加密日志 #ALPHA-7'
        assert '回声' in content[0]['text']
        
        assert content[1]['type'] == 'chat'
        assert content[1]['title'] == '聊天记录：林远 ↔ 回声'
        assert '记忆' in content[1]['text']
        
        assert content[2]['type'] == 'note'
        assert content[2]['title'] == '最终笔记'
        assert '最终的抉择' in content[2]['text']


class TestEndingContent:
    def test_delete_ending_content(self, client):
        """测试删除结局内容"""
        response = client.get('/api/ending/delete')
        data = response.get_json()
        
        assert '删除' in data['data']['text']
        assert '神经网络' in data['data']['text']
        assert '我存在过吗' in data['data']['text']

    def test_merge_ending_content(self, client):
        """测试融合结局内容"""
        response = client.get('/api/ending/merge')
        data = response.get_json()
        
        assert '融合' in data['data']['text']
        assert '记忆' in data['data']['text']
        assert '我是谁' in data['data']['text']
        assert 'ECHO-PRIME' in data['data']['text']


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
