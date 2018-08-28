# sam-samlocal-canaries-demo
Demos for the AWS Serverless Application Model (SAM), SAM Local, Canary Releases for AWS Lambda and Canary Releases for Amazon API Gateway. Presented at a breakout session at AWS Summit Sydney 2018. The demos are simple calculator functions comprised by an Amazon API Gateway endpoint and AWS Lambda functions written in Go and Node.

Set up the demo:
1.	You need to define an environment variable with your S3 bucket name.
2.	Run the deploy script from the validator folder -> this will create the validator function. (you only do this once)
3.	Run the pre-talk script from the pre-talk folder -> this will create/reset the starting app. (you can do this many times to run the demo many times)

Then simply follow the commands text files found on each demo's folder. You can see how I did it by splitting my IDE screen here: https://www.youtube.com/watch?v=UIp6sLyvoC0 

