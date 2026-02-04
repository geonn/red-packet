// 如果你在 Vercel 部署 proxy，请保持这里为相对路径 '/api/submit'
// 前端不应包含 secret；proxy 会在服务器端附加 secret 并转发到 Apps Script
const APPS_SCRIPT_URL = '/api/submit'
const CLIENT_SECRET = ''

const envelope = document.getElementById('envelope')
const openBtn = document.getElementById('openBtn')
const modal = document.getElementById('modal')
const closeBtn = document.getElementById('closeBtn')
const entryForm = document.getElementById('entryForm')
const statusEl = document.getElementById('status')

openBtn.addEventListener('click', () => {
    envelope.classList.add('open')
    // 等动画 700ms 后显示弹窗
    setTimeout(() => showModal(), 700)
})

function showModal() {
    modal.classList.remove('hidden')
}
closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden')
    envelope.classList.remove('open')
    clearForm()
})

function clearForm() {
    statusEl.textContent = ''
    entryForm.reset()
}

entryForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    statusEl.style.color = 'black'
    statusEl.textContent = '提交中...'
    const name = document.getElementById('name').value.trim()
    const phone = document.getElementById('phone').value.trim()
    if (!name || !phone) { statusEl.style.color = 'red'; statusEl.textContent = '请填写姓名与电话'; return }
    // 简单电话格式校验
    if (!/^\+?[0-9\- ]{6,20}$/.test(phone)) { statusEl.style.color = 'red'; statusEl.textContent = '请输入有效的电话号码'; return }

    const payload = { name, phone, prize: 'RM10', message: '恭喜！' }

    try {
        const resp = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await resp.json()
        if (resp.ok && data.ok) {
            statusEl.style.color = 'green'
            statusEl.textContent = '提交成功，谢谢！'
        } else {
            statusEl.style.color = 'red'
            statusEl.textContent = data.error || '提交失败，请稍后再试'
        }
    } catch (err) {
        statusEl.style.color = 'red'
        statusEl.textContent = '网络错误：' + err.message
    }
})
