import {
  GetSessionsForUserInput,
  GetSessionsForUserOutput,
} from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { SESSIONS_TABLE } from "../../utils/constants";
import { queryItemFromDB } from "../../utils/commonDynamodbMethods";

export const getSessionForUser = async (input: GetSessionsForUserInput) => {
  const validateInput = GetSessionsForUserInput.validate(input);
  handleValidationErrors(validateInput);

  const userId = input.userId!;

  const params = {
    TableName: SESSIONS_TABLE,
    IndexName: "UserSessionsIndex",
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  };

  const sessions = await queryItemFromDB(params);
  return sessions;
};
