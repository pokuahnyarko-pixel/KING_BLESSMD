const path = require('path');
const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'menu',
    async execute(sock, msg, args, config) {
        const caption = `━━━━━━━━━━━━━━━
🤖 *${config.botName} MAIN MENU*
━━━━━━━━━━━━━━━
🎵 *.song* - Download song
🎥 *.video* - Download video
📱 *.apk* - Download APK
🧠 *.ai* - Chat with AI
⚙️ *.settings* - Settings menu
👥 *.group* - Group menu
━━━━━━━━━━━━━━━
_Powered by Baileys_`;

        await sendWithTyping(sock, msg.key.remoteJid, {
            image: { url: config.menuImage },
            caption: caption
        });
    }
};
