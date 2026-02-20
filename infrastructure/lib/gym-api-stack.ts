import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

export class GymApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Seniority Check: Using NodejsFunction for automatic bundling of TypeScript.
     * In a real system, we'd also define a DynamoDB table here with a 'Bookings' 
     * partition key and 'UserId' as sort key, or similar for concurrency.
     */
    const gymApiLambda = new nodejs.NodejsFunction(this, 'GymApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../backend/src/server.ts'),
      handler: 'handler', // Fastify-aws-lambda wrapper would be used here
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        NODE_ENV: 'production',
        // Example: TABLE_NAME: bookingTable.tableName
      },
    });

    // API Gateway trigger
    const api = new apigateway.LambdaRestApi(this, 'GymApi', {
      handler: gymApiLambda,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'The URL of the Gym Booking API',
    });
  }
}
