import AWS from "aws-sdk";

export const db = new AWS.DynamoDB.DocumentClient();
export const s3 = new AWS.S3();
export const cognito = new AWS.CognitoIdentityServiceProvider();
export const secretsManager = new AWS.SecretsManager();