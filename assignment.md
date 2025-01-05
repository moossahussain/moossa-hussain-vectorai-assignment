My learning during the course of 'Vectorial AI Take home Assignment'
--------------------------------------------------------------------
Project Overview
-----------------
During this project, I worked on creating a secure and scalable serverless application using AWS CDK to deploy core AWS services, including API Gateway, Lambda functions, and Amazon DocumentDB. The focus was on creating a robust infrastructure using AWS CDK and implementing best practices for security, including configuring IAM roles, security groups, and AWS Secrets Manager for handling sensitive data.

- AWS CDK:
    - AWS CDK, you can put your infrastructure, application code, and configuration all in one place, ensuring that you have a complete, cloud-deployable system that can be scaled. (Infrastructure as Code)

My Approach
------------
- My approach to this project was to start with minimum complexity and build incrementally. This allowed me to have better control over the outcome and made the debugging process more efficient. Each component was developed step-by-step, ensuring that I understood the functionality and could troubleshoot effectively.

- I began by implementing the REST API functions using Python, as I am more familiar with it. The functions were first tested locally to ensure they worked as intended. Once the core functionality was verified, I added input validation and JWT-based authentication. Later, I converted the code to JavaScript, as the AWS CDK stack was being developed in TypeScript, which made integration more seamless.

After setting up the API functions, I initialized the AWS CDK project using the command:
$ cdk init app --language typescript

This command created the required CDK file structure, which I ensured aligned with the assignment requirements.

Database Stack (database-stack.ts):

    Created a VPC with subnets and security groups.
    Explored different subnet types (public, private, and private with egress) and learned about configuring availability zones.
    Set up the DocumentDB cluster and instance. Although the cluster and instance were successfully created, I faced connection issues while trying to access the cluster using Mongo shell. I explored possible causes, such as certification errors, security group configuration, IAM configuration and network connectivity issues, but further investigation is needed.

API Stack (api-stack.ts):

    Created the API stack after the database stack. The order of initialization in cdk.ts is essential, so I made sure to initialize the database stack first, followed by the API stack, since the API requires the DocumentDB cluster endpoint details.

Lambda Function and API Gateway:

    I configured a Lambda function to handle the REST API functions. The runtime was set to Node.js since the REST API code was in JavaScript. The functions were then tested in the AWS Lambda Console.
    I added API Gateway to the Lambda function to accept external requests. The API was tested using Postman to ensure it worked as expected.

Deployment Process
------------------
- cdk boostrap (ran the command initially, once)
- cdk synth
- cdk deploy DatabaseStack
- cdk deploy ApiStack


Debugging Process
---------------

    I followed a local-first debugging approach wherever possible, where the functions were first deployed and tested locally before provisioning in AWS.
    CloudWatch Logs were used to investigate issues. These logs provided valuable hints about possible issues, which I further researched using Google and ChatGPT.
    I debugged issues incrementally by isolating components, testing them independently, and then integrating them.

Key Learnings from the Project
-------------------------------
Infrastructure as Code (IaC):

I learned the importance of Infrastructure as Code (IaC) in modern cloud deployments. Using AWS CDK, I was able to define, provision, and manage cloud infrastructure programmatically using TypeScript, ensuring scalability, consistency, and reusability.

AWS Constructs:
AWS CDK uses constructs to represent cloud resources. I learned how to use L1, L2, and L3 constructs to simplify resource creation and manage dependencies between components efficiently.

VPC (Virtual Private Cloud):
I gained a deep understanding of VPCs, how to configure subnets, and set up networking for secure communication between AWS services. I learned how to configure public and private subnets, Internet Gateways (IGWs), and NAT Gateways using CDK.

API Gateway:
I learned how to create and configure API Gateway to expose Lambda functions to external clients. 

Lambda Functions:
I learned to configure Lambda functions with AWS CDK and connect them to API Gateway. I also explored how to set runtime environments, manage handler paths, and debug Lambda functions using CloudWatch Logs.

DocumentDB (MongoDB-Compatible):
I set up a DocumentDB cluster using AWS CDK and tested its connectivity using Mongo shell within AWS CloudShell. However, I encountered connection issues, likely due to networking or security group configurations, which I am still investigating.

Security Groups:
I learned to configure security groups to control inbound and outbound traffic for various AWS services and VPC subnets. I learned the best practices regarding setting ports, VPC peering and VPC Links to ensure secure access to resources.

Networking and Subnets:
I gained hands-on experience configuring subnet types (public, private, and private with egress) and learned how to use availability zones to ensure high availability. I also learned how route tables and Internet Gateways play a role in inter-subnet communication and in receiving outside connections.


Current Scenario (Issues Faced)
---------------------------------
The main issue I faced was connecting the Lambda function to the DocumentDB cluster. Despite setting up the VPC and security groups correctly, I encountered connection errors when trying to access the cluster using Mongo shell.
Possible Causes:

    1. Incorrect Security Group Rules: The security group attached to DocumentDB may not be allowing traffic from the Lambda function.
    2. Network ACL Restrictions: Network ACLs might be blocking the traffic between the Lambda function and the DocumentDB cluster.
    3. Certificate Issues: DocumentDB requires SSL certificates for secure communication, which might not have been correctly configured.

I am currently investigating the issue further by reviewing network configurations, security groups, and subnet settings.

What Would I Improve on
------------------------
- I would ensure there are policies for proper resource deallocation for each resource (applyRemovalPolicy())
- I would auto-generate the db password and use AWS secret manager for managing them.
- remove hardcoding of connection string, instead use environment variable throughout
- Improve further the code readability and reusability by adding more comments and refactoring

Resources Referred
-------------------
- Amazon. "AWS CDK API Reference (v2)." Amazon Web Services, https://docs.aws.amazon.com/cdk/api/v2/. Accessed 5 Jan. 2025.

- Amazon. "AWS CDK API Reference for Amazon DocumentDB." Amazon Web Services, https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_docdb-readme.html. Accessed 5 Jan. 2025.

- Amazon Web Services. "Serverless Patterns: API Gateway to Lambda to DocumentDB." GitHub, https://github.com/aws-samples/serverless-patterns/tree/main/apigw-http-lambda-documentdb-cdk. Accessed 5 Jan. 2025.

- Amazon. "Deploying AWS CDK Applications." Amazon Web Services, https://docs.aws.amazon.com/cdk/v2/guide/deploy.html. Accessed 5 Jan. 2025.

- Amazon. "Hello World with AWS CDK." Amazon Web Services, https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html. Accessed 5 Jan. 2025.

- Amazon. "Create API Gateway in AWS CDK (Workshop)." Amazon Web Services Workshop Catalog, https://catalog.us-east-1.prod.workshops.aws/workshops/10141411-0192-4021-afa8-2436f3c66bd8/en-US/2000-typescript-workshop/300-create-hello-cdk-app/340-apigw. Accessed 5 Jan. 2025.

- Amazon. "Getting Started with Amazon DocumentDB Using AWS Cloud9." Amazon Web Services, https://aws.amazon.com/getting-started/hands-on/getting-started-amazon-documentdb-with-aws-cloud9/. Accessed 5 Jan. 2025.

- Amazon. "Creating a DocumentDB Cluster with Additional Configuration." Amazon Web Services, https://docs.aws.amazon.com/documentdb/latest/developerguide/db-cluster-create.html#db-cluster-create-con-additional-configs. Accessed 5 Jan. 2025.

- TysonWorks. "Create and Deploy a Simple URL Shortener with AWS CDK and DocumentDB." Medium, https://medium.com/tysonworks/create-and-deploy-simple-url-shortener-with-aws-cdk-and-documentdb-875ab99d51f5. Accessed 5 Jan. 2025.

- YouTube. "AWS CDK Tutorial – Building Infrastructure as Code." YouTube, uploaded by TysonWorks, https://www.youtube.com/watch?v=kBAj7Fo7Jek&list=PLqdbsgoG9hwWYlNvMJmt6rLQXaM6MoEAh&index=12. Accessed 5 Jan. 2025.