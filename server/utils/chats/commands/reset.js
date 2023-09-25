const { WorkspaceChats } = require("../../../models/workspaceChats");

async function resetMemory(workspace, _message, msgUUID, user = null) {
  await WorkspaceChats.markHistoryInvalid(workspace.id, user);
  return {
    uuid: msgUUID,
    type: "textResponse",
    textResponse: "ワークスペースのチャットメモリはリセットされました！",
    sources: [],
    close: true,
    error: false,
  };
}

module.exports = {
  resetMemory,
};
