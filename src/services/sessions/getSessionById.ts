import { GetSessionByIdInput, GetSessionByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { SESSIONS_TABLE } from "../../utils/constants";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";

export const getSessionById = async (input: GetSessionByIdInput) => {
  const validateInput = GetSessionByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const sessionId = input.sessionId;

  const params = {
    TableName: SESSIONS_TABLE,
    Key: { sessionId: sessionId },
  };

  const session = await getItemFromDB(params);

  if (!session) {
    throw new Error("Problem not found");
  }

  return session as GetSessionByIdOutput;
};
