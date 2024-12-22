# Infrastructure Engineer Take-Home Assignment

## Overview
Welcome to the Vectorial AI Infrastructure Engineer internship take-home assignment! This assignment is designed to evaluate your learning capability and understanding of cloud infrastructure concepts while working with modern development tools and practices.

You'll be building a basic Authentication Service that will be deployed on AWS using infrastructure as code. The assignment is divided into phases - don't worry if you can't complete all of them. The goal is to see how you approach problems, learn new concepts, and implement solutions, rather than testing your existing knowledge.

Remember:
- Submit your work even if you haven't completed all phases
- Document your learning process and any challenges you faced
- The quality of what you complete is more important than quantity
- We're interested in seeing your problem-solving approach and how you learn new concepts

## Time Expectation
- Expected time: 3-4 days
- Please don't spend more than 4 days on this assignment

## Prerequisites
1. Create a free AWS account (if you don't have one)
2. You are allowed and encouraged to use generative AI services (like ChatGPT, Claude, GitHub Copilot, etc.) to assist with the assignment. Please document which AI tools you used in your assignment.md file.
3. Install the following tools:
   - AWS CLI
   - Node.js (for AWS CDK)
   - AWS CDK CLI (`npm install -g aws-cdk`)
   - Git
   - Your preferred programming language (Python/Java/Go/TypeScript)

## Assignment Phases

### Phase 1: Basic API Development (Expected time: 1 day)
Create a RESTful Authentication API with the following endpoints:
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login (return JWT token)
- `DELETE /users/{id}` - Delete a user
- `GET /users/me` - Get current user details (authenticated endpoint)

Requirements:
- Use any preferred programming language (Python/Java/Go/TypeScript)
- Implement password hashing
- Include basic input validation

### Phase 2: Database Infrastructure (Expected time: 1 day)
Create an AWS CDK stack for the database:
- Use Amazon DocumentDB (MongoDB compatible - free tier eligible)
- Design and implement your own user schema
- Configure appropriate security groups and VPC settings
- Set up backup policies

Requirements:
- Create a separate CDK stack for database resources
- Include best practices for security (IAM roles, policies)
- Implement proper password and sensitive data handling

### Phase 3: API Deployment Infrastructure (Expected time: 1-2 days)
Create an AWS CDK stack to deploy your API:
- Use AWS Lambda for hosting the API (free tier eligible)
- Set up API Gateway as the entry point
- Configure necessary IAM roles and policies
- Create appropriate security groups and network settings

Requirements:
- Create a separate CDK stack for API deployment
- Include environment variable management
- Set up basic logging
- Configure CORS if needed

### Bonus Phase (Optional):
If you complete the above phases and have time:
- Add basic monitoring using CloudWatch
- Implement CI/CD pipeline using GitHub Actions AND AWS CodePipeline
- Add API documentation using Swagger/OpenAPI


## Submission Requirements

1. Fork this repository
2. Create a new branch with your name (e.g., `john-doe-assignment`)
3. Create an `assignment.md` file in your branch explaining:
   - Your approach and design decisions
   - Instructions for deploying your solution
   - Any challenges faced and how you resolved them
   - What you would improve if you had more time
4. Create a Pull Request to the main repository

### Required Files Structure
```
├── README.md
├── assignment.md
├── src/
│   └── api/
│       └── [your API code]
├── cdk/
│   ├── lib/
│   │   ├── database-stack.ts
│   │   └── api-stack.ts
│   └── bin/
```

## Evaluation Criteria
- Code quality and organization
- Infrastructure design and security considerations
- Documentation quality
- Error handling and edge cases
- Completeness of implementation
- Bonus points for completing optional tasks

## Clean Up Instructions
To avoid incurring any AWS charges, make sure to delete your resources after the assignment:

1. Delete the CDK stacks:
```bash
cdk destroy --all
```

2. Additional cleanup steps:
   - Check the CloudFormation console to ensure all stacks are deleted
   - Check Lambda, API Gateway, and DocumentDB consoles to ensure no resources remain
   - Delete any CloudWatch log groups created during testing

## Notes
- Use only AWS free tier eligible services
- Document any assumptions you make
- If you get stuck, document the issues and your attempted solutions

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Initialize a new CDK project:
```bash
mkdir cdk
cd cdk
cdk init app --language typescript
```

3. Start with Phase 1 and proceed sequentially
4. Document your progress in the assignment.md file

Good luck! If you have any questions, please create an issue in the repository or contact the interviewer directly.
