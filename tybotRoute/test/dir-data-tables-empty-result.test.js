const assert = require('assert');
const { TiledeskChatbot } = require('../engine/TiledeskChatbot');
const dataTablesService = require('../services/DataTablesService');
const { DirDataTables } = require('../tiledeskChatbotPlugs/directives/DirDataTables');

async function testEmptyGetUsesFalseIntent() {
  const originalAllParametersStatic = TiledeskChatbot.allParametersStatic;
  const originalAddParameterStatic = TiledeskChatbot.addParameterStatic;
  const originalListRows = dataTablesService.listRows;

  try {
    TiledeskChatbot.allParametersStatic = async () => ({});
    TiledeskChatbot.addParameterStatic = async () => {};
    dataTablesService.listRows = async () => [];

    const directive = new DirDataTables({
      chatbot: {},
      tdcache: {},
      requestId: 'request-1',
      projectId: 'project-1',
      token: 'token',
      reply: {},
    });
    let executedIntent;
    directive.intentDir.execute = (intentDirective, callback) => {
      executedIntent = intentDirective.action.intentName;
      callback();
    };

    const stopped = await new Promise((resolve) => directive.go({
      tableId: 'table-1',
      operation: 'get',
      trueIntent: '#SUCCESS',
      falseIntent: '#FAILURE',
      assignResultTo: 'data_table_result',
    }, resolve));

    assert.strictEqual(stopped, true);
    assert.strictEqual(executedIntent, '#FAILURE');
  } finally {
    TiledeskChatbot.allParametersStatic = originalAllParametersStatic;
    TiledeskChatbot.addParameterStatic = originalAddParameterStatic;
    dataTablesService.listRows = originalListRows;
  }
}

testEmptyGetUsesFalseIntent()
  .then(() => console.log('PASS: empty GET routes to false intent'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
