'use strict';

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy();
const lambda = new aws.Lambda();

// Payload to pass to the newly deployed lambda function
const leftParam = 1.25;
const rightParam = 2.25;
const expectedResult = leftParam + rightParam;

const payload = {
    "resource": "/",
    "requestContext": {
      "resourceId": "123456",
      "apiId": "1234567890",
      "resourcePath": "/",
      "httpMethod": "GET",
      "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
      "accountId": "123456789012",
    },
    "queryStringParameters": {
      "left": leftParam+"",
      "right": rightParam+""
    },
    "headers": {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    },
    "pathParameters": {
      "proxy": "/?left="+leftParam+"&right="+rightParam
    },
    "httpMethod": "GET",
    "path": "/?left="+leftParam+"&right="+rightParam
  };


exports.handler = (event, context, callback) => {
	console.log("Entering PreTraffic Hook!");
	console.log(JSON.stringify(event));
	
	//Read the DeploymentId from the event payload.
    var deploymentId = event.DeploymentId;
	console.log(deploymentId);

    //Read the LifecycleEventHookExecutionId from the event payload
	var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
	console.log(lifecycleEventHookExecutionId);

    // Test Success Flag.
	var testSuccess = false;

    let lambdaVersionPromise;
    var testVersionArn = process.env["TestVersion"];
    if (testVersionArn && testVersionArn.length > 10) {
        console.log("Using provided Lambda Test Version: " + testVersionArn);
        var lastColon = testVersionArn.lastIndexOf(":");
        var testFunc = testVersionArn.substring(0, lastColon);
        var testVersion = testVersionArn.substring(lastColon+1);

        lambdaVersionPromise = Promise.resolve({
            arn: testVersionArn, 
            functionName: testFun, 
            functionVersion: testVersion
        });
    } else {
        // Derive it by getting the highest version number from the lambda...
        console.log("Will derive Lambda Test Version");
        lambdaVersionPromise = lambda.listVersionsByFunction({ FunctionName: "calculator",MaxItems: 512 })
                                .promise()
                                .then(data => {
                                    if (data.Versions) {
                                        let maxVersion = null;
                                        let maxVersionId = -1;
                                        data.Versions.forEach(version => {
                                            if (version.Version.indexOf("$") == -1) {
                                                let versionId = parseInt(version.Version);
                                                if (maxVersionId < versionId) {
                                                    maxVersion = version;
                                                    maxVersionId = versionId;
                                                }
                                            }
                                        });

                                        console.log("Derived Lambda Test Version: " + maxVersion.FunctionArn);
                                        return {
                                            arn: maxVersion.FunctionArn, 
                                            functionName: maxVersion.FunctionName, 
                                            functionVersion: maxVersion.Version
                                        };
                                    } else {
                                        throw new Error("Failed to obtain versions for the Calculator Lambda!");
                                    }
                                });
    }
    
    lambdaVersionPromise.then(versionInfo => {
        var params = {
            FunctionName: versionInfo.functionName, 
            InvocationType: "RequestResponse", 
            LogType: "Tail",
            Payload: JSON.stringify(payload),
            Qualifier: versionInfo.functionVersion
           };

           console.log("About to Invoke Lambda:", params);
           return lambda.invoke(params).promise();
    }).then( data => {
        console.log("Response from Lambda Invoke:", data);

        let payload = JSON.parse(data.Payload);
        let body = payload.body;
        var res;
        if (typeof body === "Number") {
            res = body;
        } else {
            res = parseFloat(body);
        }

        testSuccess = (res === expectedResult);
        console.log("Expected:", expectedResult, ", Got:", res, ", Result:", testSuccess ? "PASS" : "FAIL");
    }).catch( err => {
        console.log("Error when validating", err);
    }).then( () => {
        // Prepare the validation test results with the deploymentId and
        // the lifecycleEventHookExecutionId for AWS CodeDeploy.
        var result_params = {
            deploymentId: deploymentId,
            lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
            status: testSuccess ? 'Succeeded' : 'Failed'
        };
        
        console.log("About to Put Validation Result:", testSuccess);
        // Pass AWS CodeDeploy the prepared validation test results.
        return codedeploy.putLifecycleEventHookExecutionStatus(result_params).promise();
    }).then( data => {
        console.log('Put Validation test result succeeded');
        callback(null, 'Validation results posted successfully');
    }).catch( err => {
        console.log('Put Validation test result failed');
        console.log(err);
        callback('Validation test failed');
    });
}