import boto3

# Set "running_locally" flag if you are running the integration test locally
running_locally = True
if running_locally:

    # Create Lambda SDK client to connect to appropriate Lambda endpoint
    lambda_client = boto3.client('lambda',
                                 endpoint_url="http://127.0.0.1:3001",
                                 use_ssl=False,
                                 verify=False,
                                 config="Config(signature_version=UNSIGNED,read_timeout=0,retries={'max_attempts': 0})")
else:
    lambda_client = boto3.client('lambda')
                                        

# Invoke your Lambda function as you normally usually do. The function will run 
# locally if it is configured to do so
response = lambda_client.invoke(FunctionName="HelloWorldFunction")

# Verify the response 
assert response == "Hello World"