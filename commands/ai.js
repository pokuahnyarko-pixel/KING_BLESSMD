const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'ai',
    async execute(sock, msg, args, config) {
        const query = args.join(' ');
        if (!query) return sendWithTyping(sock, msg.key.remoteJid, { text: '❓ What do you want to ask?' });

        // very simple AI using free public API (no key needed)
        // using Brainshop free API
        const axios = require('axios');
        try {
            const res = await axios.get(`https://api.simsimi.vn/v1/simtalk?message=${encodeURIComponent(query)}&lc=en`);
            const reply = res.data?.message || 'I have no answer right now.';
            await sendWithTyping(sock, msg.key.remoteJid, { text: reply });
        } catch {
            await sendWithTyping(sock, msg.key.remoteJid, { text: '🧠 AI service unavailable' });
        }
    }
};
