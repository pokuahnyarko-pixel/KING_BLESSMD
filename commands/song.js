const ytdl = require('ytdl-core');
const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'song',
    async execute(sock, msg, args, config) {
        const url = args[0];
        if (!url) return sendWithTyping(sock, msg.key.remoteJid, { text: '❌ Please provide a YouTube URL' });
        if (!ytdl.validateURL(url)) return sendWithTyping(sock, msg.key.remoteJid, { text: '❌ Invalid YouTube URL' });

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        await sendWithTyping(sock, msg.key.remoteJid, { text: `🎵 Downloading: *${title}*...` });

        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        // send as audio file
        await sock.sendMessage(msg.key.remoteJid, {
            audio: { stream },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false
        });
    }
};
