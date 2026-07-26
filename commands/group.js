const { sendWithTyping } = require('../lib/functions');

module.exports = {
    name: 'group',
    async execute(sock, msg, args, config) {
        const groupText = `👥 *GROUP COMMANDS*
━━━━━━━━━━━━━━━
• .tagall - mention all (admin)
• .kick @user - kick (admin)
• .promote @user - promote
• .demote @user - demote
_These features coming soon!_`;

        await sendWithTyping(sock, msg.key.remoteJid, { text: groupText });
    }
};
