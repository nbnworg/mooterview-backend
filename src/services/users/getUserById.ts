import { GetUserByIdInput, GetUserByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";
import { USERS_TABLE } from "../../utils/constants";

export const getUserById = async (input: GetUserByIdInput) => {
  const validateInput = GetUserByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const userId = input.userId!;

  const params = {
    TableName: USERS_TABLE,
    Key: { userId: userId },
  };

  const userProfile = await getItemFromDB(params);

  if (!userProfile) {
    throw new Error("User not found");
  }
  return userProfile as GetUserByIdOutput;
};
