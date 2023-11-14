
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'mohamedfarah',
  applicationName: 'ecomm-app-api',
  appUid: 'sMQdTV1LnpWvDXxRBv',
  orgUid: 'f94eafca-77b9-4daa-9cc8-3747e60f0b0c',
  deploymentUid: '3b3810e6-4f01-49d6-9d28-92fac0aa2987',
  serviceName: 'ecomm-app-api',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '7.1.0',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'ecomm-app-api-dev-getUsersByIdLambda', timeout: 6 };

try {
  const userHandler = require('./handlers/users.js');
  module.exports.handler = serverlessSDK.handler(userHandler.getUserById, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}