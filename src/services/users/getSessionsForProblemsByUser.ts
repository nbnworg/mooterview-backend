import { GetSessionsForProblemsByUserInput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { SESSIONS_TABLE } from "../../utils/constants";
import { queryItemFromDB } from "../../utils/commonDynamodbMethods";

export const getSessionsForProblemsByUser = async (
  input: GetSessionsForProblemsByUserInput
) => {
  const validateInput = GetSessionsForProblemsByUserInput.validate(input);
  handleValidationErrors(validateInput);

  const userId = input.userId!;
  const problemId = input.problemId!;

  const params = {
    TableName: SESSIONS_TABLE,
    IndexName: "UserProblemSessionIndex",
    KeyConditionExpression: "userId = :uid AND problemId = :pid",
    ExpressionAttributeValues: {
      ":uid": userId,
      ":pid": problemId,
    },
  };

  const sessions = await queryItemFromDB(params);
  return sessions;
};
