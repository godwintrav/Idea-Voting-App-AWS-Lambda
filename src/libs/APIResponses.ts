interface APIGatewayResponse {
  body: string;
  statusCode: number;
  headers?: { [key: string]: any };
}

export const formatJSONResponse = ({
  body,
  statusCode = 200,
  headers,
}: APIGatewayResponse) =>
({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    ...headers,
  },
  statusCode,
  body: JSON.stringify(body),
} as APIGatewayResponse);
