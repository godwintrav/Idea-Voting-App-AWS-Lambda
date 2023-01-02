import { AWS } from '@serverless/typescript';

interface Authorizer {
  name: string;
  type: string;
  arn: {
    'Fn::GetAtt': string[];
  };
}
const authorizer: Authorizer = {
  name: 'authorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const functions: AWS['functions'] = {
  createBoard: {
    handler: 'src/functions/createBoard/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: '/boards',
          cors: true,
          authorizer,
        },
      },
    ],
  },
  listBoards: {
    handler: 'src/functions/listBoards/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: '/boards',
          cors: true,
        },
      },
    ],
  },
  getBoard: {
    handler: 'src/functions/getBoard/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: '/boards/{boardId}',
          cors: true,
        },
      },
    ],
  },
  createIdea: {
    handler: 'src/functions/createIdea/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: '/ideas',
          cors: true,
          authorizer,
        },
      },
    ],
  },
  voteOnIdea: {
    handler: 'src/functions/voteOnIdea/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: '/ideas/{ideaId}',
          cors: true,
          authorizer,
        },
      },
    ],
  },
};

export default functions;
