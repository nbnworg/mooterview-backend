import AWS from "aws-sdk";
import { db } from "../clients/clients";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const putItemToDB = async (params: DocumentClient.PutItemInput) => {
  await db.put(params).promise();
};

export const getItemFromDB = async (
  params: AWS.DynamoDB.DocumentClient.GetItemInput
) => {
  const result = await db.get(params).promise();
  return result.Item;
};
