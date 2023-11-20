
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'mohamedfarah',
  applicationName: 'ecomm-app-api',
  appUid: 'sMQdTV1LnpWvDXxRBv',
  orgUid: 'f94eafca-77b9-4daa-9cc8-3747e60f0b0c',
  deploymentUid: 'e8661f97-9d4b-4cff-bd54-19f1a5280c80',
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

const handlerWrapperArgs = { functionName: 'ecomm-app-api-dev-preSignUpLambda', timeout: 6 };

try {
  const userHandler = require('./handlers/auth.js');
  module.exports.handler = serverlessSDK.handler(userHandler.autoConfirmUsers, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}