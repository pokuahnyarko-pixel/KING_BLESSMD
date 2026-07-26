const axios = require('axios');
const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'apk',
    async execute(sock, msg, args, config) {
        const appName = args.join(' ');
        if (!appName) return sendWithTyping(sock, msg.key.remoteJid, { text: '❌ Please provide an app name' });
        // Example using a free APK search API (no key needed)
        try {
            const res = await axios.get(`https://api.apkdl.io/search?q=${encodeURIComponent(appName)}`);
            const result = res.data?.results?.[0];
            if (!result) return sendWithTyping(sock, msg.key.remoteJid, { text: '❌ No APK found' });
            // send download link (you could also download the file)
            const downloadUrl = result.download;
            await sendWithTyping(sock, msg.key.remoteJid, {
                text: `📱 *${result.title}*\n📥 Download: ${downloadUrl}\n_Note: Manual download_`
            });
        } catch {
            await sendWithTyping(sock, msg.key.remoteJid, { text: '❌ Search failed' });
        }
    }
};
