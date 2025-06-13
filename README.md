# mooterview-backend

Mooterview is an AI powered coding assistance platform that helps you prepare for coding interviews.

## Project Structure

```
/src
  app.ts             Express app entry
  routes/            Request routers
  services/          Business logic for features
  clients/           AWS SDK client helpers
  utils/             Shared utilities
serverless.yml       Serverless deployment config
package.json         NPM scripts and dependencies
tsconfig.json        TypeScript configuration
```

### Application Entry
- `src/app.ts` sets up an Express server and exposes a `handler` for AWS Lambda via the serverless framework.

### Routers
- `src/routes/users.route.ts` – user signup, login, and profile endpoints.
- `src/routes/problems.route.ts` – CRUD operations for coding problems.
- `src/routes/prompt.route.ts` – forwards prompts to the GPT service.
- `src/routes/sessions.route.ts` – placeholder for session-related routes.

### Services
- `src/services/users` – handles user registration and retrieval via AWS Cognito and DynamoDB.
- `src/services/problems` – manages coding problems stored in DynamoDB.
- `src/services/gpt` – retrieves a Secrets Manager key and queries the OpenAI API.
- `src/services/sessions` – placeholder for future session logic.

### Deployment
The project is deployed to AWS using the Serverless framework. `serverless.yml` defines the AWS runtime, IAM permissions, environment variables, and HTTP events that map to the Lambda `handler` in `dist/app.js` after compilation. All API routes are secured with an AWS Cognito authorizer so requests must include a valid access token in the `Authorization` header.

