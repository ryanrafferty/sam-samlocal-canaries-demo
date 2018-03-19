package main

import (
	"context"
	"fmt"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func queryParamAsNumber(name string, event events.APIGatewayProxyRequest, defaultVal float64) float64 {
	result := defaultVal
	val := event.QueryStringParameters[name]
	if val != "" {
		var err error
		result, err = strconv.ParseFloat(val, 64)
		if err != nil {
			fmt.Println(err)
		}
	}
	return result
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	left := queryParamAsNumber("left", request, 0)
	right := queryParamAsNumber("right", request, 0)
	result := left * right
	return events.APIGatewayProxyResponse{200, make(map[string]string), strconv.FormatInt(int64(result), 10), false}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
