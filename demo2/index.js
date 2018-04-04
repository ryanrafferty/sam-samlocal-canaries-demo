'use strict';

function queryParamAsNumber(name, event, defaultVal) {
    let val = event.queryStringParameters[name];
    return val ? parseFloat(val) : defaultVal;
}

exports.handler = (event, context, callback) => {
    try {
        let left = queryParamAsNumber("left", event, 0);
        let right = queryParamAsNumber("right", event, 0);

        // Intentional Mistake: Should be Multiplying
        let result = left + right; 
        

        callback(null, {
            statusCode: 200,
            body: result
        });
    } catch(error) {
        callback(error, {
            statusCode: 500,
            body: "Unexpected faillure processing your calculation" 
        });
    }
}
