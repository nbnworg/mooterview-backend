# Developer Guide

This document explains how to set up and develop the Mooterview backend.

## Prerequisites
- **Node.js** (compatible with the project version specified in `package.json`).
- **Serverless CLI** installed globally (`npm install -g serverless`).
- AWS credentials configured so the Serverless framework can deploy resources.

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the TypeScript source:
   ```bash
   npm run build
   ```

## Running Locally
Run the compiled JavaScript or directly execute TypeScript:
```bash
npx ts-node src/app.ts    # Development
# or
node dist/app.js          # After building
```

## Deployment
Use the provided npm scripts which invoke Serverless:
```bash
npm run deploy:sandbox     # Deploy to the sandbox stage
npm run deploy:production  # Deploy to the production stage
```

## Repository Structure
See `README.md` for a high level overview of the folders and major files.

## Coding Guidelines and Tips
- **Keep functions small and focused.**
  ```ts
  // good
  async function getUserById(id: string): Promise<User> {
    const record = await userTable.get(id);
    return mapRecord(record);
  }
  ```
- **Prefer async/await over callbacks.**
  ```ts
  // preferred
  const data = await client.send(new GetCommand(params));
  ```
- **Write TypeScript interfaces for data shapes.**
  ```ts
  interface User {
    id: string;
    email: string;
  }
  ```
- **Add JSDoc comments to describe module responsibilities.**
  ```ts
  /** Service for fetching and creating users in DynamoDB */
  export class UserService { /* ... */ }
  ```
- **Use environment variables** (see `serverless.yml`) **instead of hard coding secrets.**
  ```ts
  const apiKey = process.env.OPENAI_API_KEY;
  ```

