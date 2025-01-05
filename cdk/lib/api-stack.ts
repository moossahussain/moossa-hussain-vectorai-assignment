import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

// Define properties to pass VPC and Security Group from another stack
interface ApiStackProps extends cdk.StackProps {
    vpc: Vpc;
    securityGroup: SecurityGroup;
}

export class ApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        // Create a Lambda function to handle CRUD API requests
        const crudHandlerFunction = new Function(this, 'CrudHandlerLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'crud.handler',
            code: Code.fromAsset('../src'), // Path to the Lambda code
            vpc: props.vpc,
            securityGroups: [props.securityGroup],
            environment: {
                DATABASE_ENDPOINT: process.env.DATABASE_ENDPOINT || '',
                DATABASE_USER: process.env.DATABASE_USER || '',
                DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
            },
        });

        // Create an API Gateway to expose the Lambda function as a REST API
        const apiGateway = new RestApi(this, 'ApiGateway', {
            restApiName: 'CRUD Service API Gateway',
            description: 'API Gateway to expose the Lambda function handling CRUD service requests.',
        });

        // Integrate the Lambda function with API Gateway
        const lambdaIntegration = new LambdaIntegration(crudHandlerFunction);

        // Create resources and methods for CRUD operations

        // Create a resource and method for the API
        const crudResource = apiGateway.root.addResource('crud');
        crudResource.addMethod('GET', lambdaIntegration); // Prints message: 'Hello from the CRUD Lambda Function!'(for integration testing purpose)

        // POST /auth/register
        const authResource = apiGateway.root.addResource('auth');
        const registerResource = authResource.addResource('register');
        registerResource.addMethod('POST', lambdaIntegration);

        // POST /auth/login
        const loginResource = authResource.addResource('login');
        loginResource.addMethod('POST', lambdaIntegration);

        // GET /users/me
        const usersResource = apiGateway.root.addResource('users');
        const meResource = usersResource.addResource('me');
        meResource.addMethod('GET', lambdaIntegration);

        // DELETE /users/{id}
        const userIdResource = usersResource.addResource('{id}');
        userIdResource.addMethod('DELETE', lambdaIntegration);


        // Output the API endpoint for reference
        new cdk.CfnOutput(this, 'ApiEndpointOutput', {
            value: apiGateway.url,
        });

        // Output the VPC ID for reference
        new cdk.CfnOutput(this, 'ApiVpcIdOutput', {
            value: props.vpc.vpcId,
        });

        // Output the Security Group ID for reference
        new cdk.CfnOutput(this, 'ApiSecurityGroupIdOutput', {
            value: props.securityGroup.securityGroupId,
        });
    }
}
