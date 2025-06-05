import { DeleteSessionByIdInput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { SESSIONS_TABLE } from "../../utils/constants";
import { deleteItemFromDB } from "../../utils/commonDynamodbMethods";

export const deleteSessionById = async (input: DeleteSessionByIdInput) => {
  const validateInput = DeleteSessionByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const sessionId = input.sessionId!;

  const params = {
    TableName: SESSIONS_TABLE,
    Key: { sessionId },
  };

  await deleteItemFromDB(params);
  return { message: "Session deleted successfully" };
};
