# sam-samlocal-canaries-demo
Demos for the AWS Serverless Application Model (SAM), SAM Local, Canary Releases for AWS Lambda and Canary Releases for Amazon API Gateway. Presented at a breakout session at AWS Summit Sydney 2018. The demos are simple calculator functions comprised by an Amazon API Gateway endpoint and AWS Lambda functions written in Go and Node.

Requirements:
* An AWS account
* The AWS CLI configured with valid access keys for your AWS account
* An S3 bucket from your AWS account
* Docker installed and running in your machine (needed for 2nd demo)
* An IDE (I used VS Code)
* Golang installed in your machine
* The AWS SAM CLI installed in your machine

Set up the demo:
1.	Write your S3 bucket name in line 5 of the pre-talk-init script found in the pre-talk folder.
2.	Run the deploy script from the validator folder -> this will create the validator function. (you only do this once)
3.	Run the pre-talk-init script from the pre-talk folder -> this will create/reset the starting app. (you can do this many times to run the demo many times)

Then simply follow the commands text files found on each demo's folder. You can see how I did it by splitting my IDE screen here: https://www.youtube.com/watch?v=UIp6sLyvoC0 

Enjoy =)
