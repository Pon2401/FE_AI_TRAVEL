<template>
  <div class="chat-page">
    <div class="container chat-container py-4">
      <div class="chat-wrapper">
        <!-- HEADER -->
        <div class="chat-header">
          <div class="d-flex align-items-center">
            <button class="btn-back me-3" @click="$router.push('/nhom-du-lich')">
              <i class="bi bi-arrow-left"></i>
            </button>
            <div class="chat-group-info">
              <div class="avatar-placeholder" :style="{ background: groupColor(groupId) }">
                {{ groupName.charAt(0).toUpperCase() }}
              </div>
              <div class="info-text">
                <h2 class="mb-0">{{ groupName }}</h2>
                <span class="status-online"><span class="dot"></span>Phòng Chat Trực Tuyến</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <!-- optional menu or info button -->
          </div>
        </div>

        <!-- MESSAGES -->
        <div class="chat-body" ref="chatBody">
          <div v-if="loadingInit" class="chat-loading">
            <div class="spinner-border text-brand" role="status"></div>
            <span class="ms-2 text-muted">Đang tải tin nhắn...</span>
          </div>

          <div v-else-if="messages.length === 0" class="chat-empty">
            <i class="bi bi-chat-heart text-muted mb-3" style="font-size: 3rem;"></i>
            <h5 class="text-muted">Chưa có tin nhắn nào</h5>
            <p class="text-secondary small">Hãy là người đầu tiên bắt đầu cuộc trò chuyện!</p>
          </div>

          <div v-else class="message-list">
            <div v-for="(msg, idx) in messages" :key="msg.id" class="msg-row"
              :class="{ 'msg-mine': isMine(msg.id_nguoi_gui) }">
              <div class="msg-avatar"
                v-if="!isMine(msg.id_nguoi_gui) && (!messages[idx - 1] || messages[idx - 1].id_nguoi_gui !== msg.id_nguoi_gui)">
                <img v-if="msg.nguoi_gui && msg.nguoi_gui.hinh_anh"
                  :src="'http://127.0.0.1:8000' + msg.nguoi_gui.hinh_anh" 
                  @error="(e) => e.target.style.display = 'none'"
                  alt="avt" />
                <div class="avt-letter" :style="{ background: groupColor(msg.id_nguoi_gui) }">
                  {{ msg.nguoi_gui ? msg.nguoi_gui.ten.charAt(0).toUpperCase() : '?' }}
                </div>
              </div>
              <div class="msg-avatar empty" v-else-if="!isMine(msg.id_nguoi_gui)"></div>

              <div class="msg-bubble-wrap">
                <div class="msg-sender"
                  v-if="!isMine(msg.id_nguoi_gui) && (!messages[idx - 1] || messages[idx - 1].id_nguoi_gui !== msg.id_nguoi_gui)">
                  {{ msg.nguoi_gui ? msg.nguoi_gui.ten : 'Ẩn danh' }}
                </div>
                <div class="msg-bubble">
                  {{ msg.noi_dung }}
                </div>
                <div class="msg-time">{{ formatTime(msg.created_at) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- INPUT -->
        <div class="chat-footer">
          <form @submit.prevent="sendMessage" class="chat-form">
            <input v-model="newMessage" type="text" class="form-control chat-input" placeholder="Nhập tin nhắn..."
              :disabled="sending" ref="inputField" />
            <button type="submit" class="btn-send" :disabled="!newMessage.trim() || sending">
              <i class="bi bi-send-fill" v-if="!sending"></i>
              <span class="spinner-border spinner-border-sm mt-1" v-else></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BASE = 'http://127.0.0.1:8000/api/client/nhom-du-lich';

export default {
  name: 'NhomChat',
  data() {
    return {
      groupId: this.$route.params.id,
      token: localStorage.getItem('client_token') || null,
      myUserId: localStorage.getItem('client_id') || null,
      groupName: 'Nhóm du lịch',
      messages: [],
      newMessage: '',
      loadingInit: true,
      fetching: false, // New state to prevent concurrent polling
      sending: false,
      pollInterval: null,
      shouldScroll: true,
    }
  },
  mounted() {
    this.extractMyUserId();
    this.fetchGroupInfo();
    this.fetchChat().then(() => {
      this.loadingInit = false;
      this.scrollToBottom();
    });

    // Polling every 3s
    this.pollInterval = setInterval(async () => {
      if (this.sending || this.fetching) return;

      const oldLen = this.messages.length;
      const body = this.$refs.chatBody;
      const isNearBottom = body ? (body.scrollHeight - body.scrollTop - body.clientHeight < 100) : true;

      await this.fetchChat();

      if (this.messages.length > oldLen && isNearBottom) {
        this.scrollToBottom();
      }
    }, 3000);
  },
  beforeUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  },
  methods: {
    h() { return { Authorization: `Bearer ${this.token}`, 'Accept': 'application/json' }; },
    hJson() { return { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}`, 'Accept': 'application/json' }; },

    extractMyUserId() {
      // Prioritize what we have in localStorage
      const cachedId = localStorage.getItem('client_id');
      if (cachedId) {
        this.myUserId = parseInt(cachedId);
      }

      if (!this.token) return;

      // Always verify/update from profile API
      fetch('http://127.0.0.1:8000/api/client/profile', { headers: this.h() })
        .then(r => r.json())
        .then(res => {
          if (res.status && res.data) {
            this.myUserId = parseInt(res.data.id);
            localStorage.setItem('client_id', res.data.id);
          }
        }).catch(err => {
          console.error("Profile API error:", err);
        });
    },

    async fetchGroupInfo() {
      try {
        const r = await fetch(`${BASE}/get-joined`, { headers: this.h() });
        const res = await r.json();
        const data = res.data || [];
        const g = data.find(x => x.id == this.groupId);
        if (g) {
          this.groupName = g.ten_nhom;
        } else {
          // Maybe it's in my groups (created by me)
          const r2 = await fetch(`${BASE}/get-my-groups`, { headers: this.h() });
          const data2 = (await r2.json()).data || [];
          const g2 = data2.find(x => x.id == this.groupId);
          if (g2) this.groupName = g2.ten_nhom;
        }
      } catch (e) { console.error('Error fetching group info', e); }
    },

    async fetchChat() {
      if (this.fetching) return;
      this.fetching = true;
      try {
        const r = await fetch(`${BASE}/messages/${this.groupId}`, { headers: this.h() });
        const res = await r.json();
        if (res.status) {
          this.messages = res.data || [];
        } else {
          console.error("Fetch Chat Error:", res.message);
        }
      } catch (err) {
        console.error("Fetch Chat Network Error:", err);
      } finally {
        this.fetching = false;
      }
    },

    async sendMessage() {
      if (!this.newMessage.trim() || this.sending) return;
      this.sending = true;
      const t = this.newMessage.trim();
      this.newMessage = ''; // optimistic clear

      try {
        const myName = localStorage.getItem('client_ten') || 'Người dùng';

        const r = await fetch(`${BASE}/send-message`, {
          method: 'POST', headers: this.hJson(),
          body: JSON.stringify({
            id_nhom_du_lich: this.groupId,
            message: t,
            ten: myName
          })
        });
        const res = await r.json();
        console.log("Send Message Response:", res);

        if (res.status && res.data) {
          this.messages.push(res.data);
          this.$nextTick(() => { this.scrollToBottom(); });
        } else {
          console.error("Send Message Error:", res.message || "Unknown error");
          alert("Không thể gửi tin nhắn: " + (res.message || "Lỗi hệ thống"));
          this.newMessage = t; // retry
        }
      } catch (e) {
        console.error('Error sending message:', e);
        this.newMessage = t; // retry
      }

      this.sending = false;
      this.$nextTick(() => {
        if (this.$refs.inputField) this.$refs.inputField.focus();
      });
    },

    isMine(id_gui) {
      if (!id_gui || !this.myUserId) return false;
      return parseInt(id_gui) === parseInt(this.myUserId);
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const body = this.$refs.chatBody;
        if (body) {
          body.scrollTop = body.scrollHeight;
        }
      });
    },

    groupColor(id) {
      const colors = ['#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#f97316'];
      return colors[(id || 0) % colors.length];
    },

    formatTime(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
  }
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  background: linear-gradient(160deg, #f0f7ff 0%, #fafbff 60%, #f0fff8 100%);
  font-family: 'Inter', sans-serif;
  color: #1e2d44;
}

.chat-container {
  max-width: 900px;
  height: 100%;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.chat-wrapper {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* Header */
.chat-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  z-index: 10;
}

.btn-back {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.chat-group-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-placeholder {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
}

.info-text h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e2d44;
}

.status-online {
  font-size: 0.8rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

/* Body */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.chat-loading,
.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.text-brand {
  color: #10b981 !important;
}

/* Messages */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.msg-row {
  display: flex;
  gap: 0.8rem;
  max-width: 85%;
}

.msg-mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
}

.msg-avatar.empty {
  width: 38px;
  height: 1px;
}

.msg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #fff;
}

.avt-letter {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  border: 2px solid #fff;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.msg-mine .msg-bubble-wrap {
  align-items: flex-end;
}

.msg-sender {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.15rem;
  margin-left: 0.3rem;
}

.msg-mine .msg-sender {
  display: none;
}

.msg-bubble {
  padding: 0.65rem 1rem;
  border-radius: 1rem;
  font-size: 0.95rem;
  line-height: 1.45;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  background: #fff;
  color: #334155;
  border-bottom-left-radius: 0.2rem;
}

.msg-mine .msg-bubble {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 0.2rem;
}

.msg-time {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 0.2rem;
  margin-right: 0.3rem;
  margin-left: 0.3rem;
}

/* Footer */
.chat-footer {
  padding: 1rem 1.5rem;
  background: #fff;
  border-top: 1px solid #f1f5f9;
}

.chat-form {
  display: flex;
  gap: 0.8rem;
}

.chat-input {
  flex: 1;
  border-radius: 2rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  outline: none;
  box-shadow: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: #10b981;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.btn-send {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn-send:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
