import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { CreateIdeaBody } from 'src/types/apiTypes';
import { IdeaRecord } from 'src/types/dynamo';
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body);
    const tableName = process.env.singleTable;

    const validationError = validateBody(body);
    if (validationError) {
      return validationError;
    }

    const { title, description, boardId } = body as CreateIdeaBody;

    const board = await Dynamo.get({
      tableName: tableName,
      pkValue: boardId
    });

    if (!board) {
      return formatJSONResponse({ statusCode: 404, body: { message: "No board Found with that ID" } });
    }

    const data: IdeaRecord = {
      id: uuid(),
      pk: `idea-${boardId}`,
      sk: Date.now().toString(),

      boardId: boardId,
      ideaTitle: title,
      description: description ?? '',
      date: Date.now()
    }


    const response = await Dynamo.write({ data, tableName });
    console.log(response);

    return formatJSONResponse({ statusCode: 201, body: { message: 'Idea Created', id: data.id } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};


const validateBody = (body: Record<string, any>) => {
  const { title, boardId } = body;

  if (!title || !boardId) {
    return formatJSONResponse({ body: { message: '"title" and "boardId" required on body' }, statusCode: 400 });
  }

  return;
}