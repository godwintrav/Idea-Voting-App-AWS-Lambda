import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { VoteRecord } from 'src/types/dynamo';
import { v4 as uuid } from 'uuid';
import { getUserId } from '@libs/APIGateway';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;
    const { ideaId } = event.pathParameters;

    const userId = getUserId(event);

    const existingVote = await Dynamo.query({
      tableName,
      index: 'index1',
      pkKey: 'pk',
      pkValue: `vote-${ideaId}`,
      skKey: 'sk',
      skValue: userId,
    });

    if (existingVote.length !== 0) {
      return formatJSONResponse({
        statusCode: 400,
        body: { message: `You've already voted for this idea` },
      });
    }

    const data: VoteRecord = {
      id: uuid(),
      pk: `vote-${ideaId}`,
      sk: userId,

      userId,
      ideaId

    }






    await Dynamo.write({ data, tableName });

    return formatJSONResponse({ body: { message: 'You have successfully voted', id: data.id } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};