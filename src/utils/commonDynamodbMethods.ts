import AWS from "aws-sdk";
import { db } from "../clients/clients";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { SessionSummary } from "mooterview-server";

export const putItemToDB = async (params: DocumentClient.PutItemInput) => {
  await db.put(params).promise();
};

export const getItemFromDB = async (
  params: AWS.DynamoDB.DocumentClient.GetItemInput
) => {
  const result = await db.get(params).promise();
  return result.Item;
};

export const getAllItemsFromDB = async (
  params: AWS.DynamoDB.DocumentClient.ScanInput
) => {
  const result = await db.scan(params).promise();
  return result.Items;
};

export const updateItemInDB = async (
  params: AWS.DynamoDB.DocumentClient.UpdateItemInput
) => {
  await db.update(params).promise();
};

export const deleteItemFromDB = async (
  params: AWS.DynamoDB.DocumentClient.DeleteItemInput
) => {
  await db.delete(params).promise();
};

export const queryItemFromDB = async (
  params: AWS.DynamoDB.DocumentClient.QueryInput
): Promise<{ sessions: SessionSummary[] }> => {
  const result = await db.query(params).promise();
  return {
    sessions: (result.Items as SessionSummary[]) || [],
  };
};
