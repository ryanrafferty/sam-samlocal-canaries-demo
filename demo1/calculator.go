package main

import (
	"context"
	"fmt"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// queryParamAsNumber get the specified QueryParam and return it as a Float64
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

// HandleRequest process the API Request
func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	left := queryParamAsNumber("left", request, 0)
	right := queryParamAsNumber("right", request, 0)

	// MISTAKE! Should be Adding
	result := left * right

	// fmt.Println("Result defined")

	return events.APIGatewayProxyResponse{
		StatusCode:      200,
		Headers:         make(map[string]string),
		Body:            strconv.FormatInt(int64(result), 10),
		IsBase64Encoded: false}, nil
}

// main Lambda EntryPoint
func main() {
	lambda.Start(HandleRequest)
}
