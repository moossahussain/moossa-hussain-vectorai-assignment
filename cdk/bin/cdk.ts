#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

// Deploy the DatabaseStack
const databaseStack = new DatabaseStack(app, 'DatabaseStack');

// Deploy the ApiStack, passing the VPC and Security Group from DatabaseStack
new ApiStack(app, 'ApiStack', {
    vpc: databaseStack.databaseVpc,
    securityGroup: databaseStack.databaseSecurityGroup,
});
