const { PREFIX } = require("../../config");
const { getMessageCount } = require("../../utils/database"); // supondo que tem essa função pra pegar o rank

module.exports = {
  name: "rank",
  description: "Mostra o ranking de mensagens do grupo",
  commands: ["rank", "ranking"],
  usage: `${PREFIX}rank`,
  
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, message }) => {
    try {
      const chatId = message.key.remoteJid;

      // Pega o ranking do grupo (array [{ jid, count }])
      const ranking = await getMessageCount(chatId);

      if (!ranking || ranking.length === 0) {
        await socket.sendMessage(chatId, { text: "Nenhuma mensagem registrada ainda." });
        return;
      }

      // Monta a mensagem do rank, só os top 10
      let text = "🏆 Ranking de mensagens do grupo:\n\n";
      ranking.slice(0, 10).forEach((item, i) => {
        const user = item.jid.split("@")[0];
        text += `#${i + 1} - @${user}: ${item.count} mensagens\n`;
      });

      await socket.sendMessage(chatId, { text, mentions: ranking.slice(0, 10).map(i => i.jid) });
    } catch (error) {
      console.error("Erro no comando rank:", error);
      await socket.sendMessage(message.key.remoteJid, { text: "❌ Ocorreu um erro ao buscar o ranking." });
    }
  },
}; 