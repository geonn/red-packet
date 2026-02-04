"use strict";

// Vercel Serverless function: 接收前端请求，附上 secret 并转发到 Apps Script
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { name, phone, prize, message } = req.body || {};
    if (!name || !phone) return res.status(400).json({ error: 'Missing name or phone' });

    const appsUrl = process.env.APPS_SCRIPT_URL; // 在 Vercel environment variables 中设置
    const secret = process.env.CLIENT_SECRET;   // 在 Vercel environment variables 中设置
    if (!appsUrl || !secret) return res.status(500).json({ error: 'Server not configured' });

    const payload = { name, phone, prize: prize || 'RM10', message: message || '', secret };

    try {
        const r = await fetch(appsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await r.json();
        return res.status(r.ok ? 200 : 502).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
