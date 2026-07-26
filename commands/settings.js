const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'settings',
    async execute(sock, msg, args, config) {
        const settingsText = `⚙️ *BOT SETTINGS*
━━━━━━━━━━━━━━━
• Auto‑typing: ${config.autoTyping ? '✅ ON' : '❌ OFF'}
• Auto‑react: ${config.autoReact ? '✅ ON' : '❌ OFF'}
• Anti‑Delete: ${config.antiDelete ? '✅ ON' : '❌ OFF'}
• Prefix: '${config.prefix}'
• Mode: public (no owner)`;

        await sendWithTyping(sock, msg.key.remoteJid, { text: settingsText });
    }
};
