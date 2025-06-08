/**
 * Comando ping - responde com latência e uptime
 * @author Dev Gui
 */

const { PREFIX } = require(`${global.BASE_DIR}/config`);

module.exports = {
  name: "ping",
  description: "Responde com latência e uptime do bot",
  commands: ["ping"],
  usage: `${PREFIX}ping`,

  /**
   * @param {Object} params
   * @returns {Promise<void>}
   */
  handle: async ({
    socket,
    userJid,
    remoteJid,
    pushName,
    startProcess,
  }) => {
    try {
      const sender = userJid.split("@")[0];
      const name = pushName || sender;

      const ping = Date.now() - startProcess;
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);
      const now = new Date();
      const data = now.toLocaleDateString("pt-BR");
      const hora = now.toLocaleTimeString("pt-BR");

      const msg = `
🤖 🌙 Boa ${now.getHours() < 12 ? "dia" : now.getHours() < 18 ? "tarde" : "noite"}, @${sender}🍅

📅 Data: ${data}
⏰ Hora: ${hora}
🚀 Latência: ${ping}ms
⏳ Uptime: ${h}h ${m}m ${s}s
      `.trim();

      await socket.sendMessage(remoteJid, {
        text: msg,
        mentions: [userJid],
      });
    } catch (error) {
      await socket.sendMessage(remoteJid, {
        text:
          "🤖 ❌ Erro! Ocorreu um erro ao executar o comando ping! O desenvolvedor foi notificado!",
      });
      console.error("[PING COMMAND ERROR]", error);
    }
  },
};