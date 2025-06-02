import { UpdateSessionByIdInput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { SESSIONS_TABLE } from "../../utils/constants";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { updateItemInDB } from "../../utils/commonDynamodbMethods";

export const updateSessionById = async (input: UpdateSessionByIdInput) => {
  const validateInput = UpdateSessionByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const sessionId = input.sessionId!;
  const chatsQueue = input.chatsQueue!;
  const endTime = input.endTime!;
  const problemStatus = input.problemStatus!;
  const notes = input.notes!;

  const updateExpression = [];
  const expressionAttributeNames: Record<string, any> = {};
  const expressionAttributeValues: Record<string, any> = {};

  if (chatsQueue !== undefined) {
    updateExpression.push("#cq = :cq");
    expressionAttributeNames["#cq"] = "chatsQueue";
    expressionAttributeValues[":cq"] = chatsQueue;
  }

  if (endTime !== undefined) {
    updateExpression.push("#et = :et");
    expressionAttributeNames["#et"] = "endTime";
    expressionAttributeValues[":et"] = endTime;
  }

  if (problemStatus !== undefined) {
    updateExpression.push("#ps = :ps");
    expressionAttributeNames["#ps"] = "problemStatus";
    expressionAttributeValues[":ps"] = problemStatus;
  }

  if (notes !== undefined) {
    updateExpression.push("#nt = :nt");
    expressionAttributeNames["#nt"] = "notes";
    expressionAttributeValues[":nt"] = notes;
  }

  if (updateExpression.length === 0) {
    return { message: "No fields Provided for update." };
  }

  const params = {
    TableName: SESSIONS_TABLE,
    Key: { sessionId },
    UpdateExpression: "SET " + updateExpression.join(", "),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "NONE",
  };

  await updateItemInDB(params);
  return { message: "Session Updates Successfully" };
};
