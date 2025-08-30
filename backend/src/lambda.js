// Lambda handler for Express application
import { configure as serverlessExpress } from '@vendia/serverless-express';
import app from './index.js';

// Create serverless handler
const serverlessHandler = serverlessExpress({ app });

// Lambda handler function
export const handler = async (event, context) => {
  // You can add any pre-processing logic here
  return serverlessHandler(event, context);
};
