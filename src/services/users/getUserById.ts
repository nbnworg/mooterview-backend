import { GetUserByIdInput, GetUserByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";
import { USERS_TABLE } from "../../utils/constants";

export const getUserById = async (input: GetUserByIdInput) => {
  const validateInput = GetUserByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const userId = input.userId!;

  if (!userId) {
    throw new Error("Invalid Request, Missing Required Fields");
  }

  const params = {
    TableName: USERS_TABLE,
    Key: { userId: userId },
  };

  const userProfile = await getItemFromDB(params);

  if (!userProfile) {
    throw new Error("EntityNotFoundException: User not found");
  }
  return userProfile as GetUserByIdOutput;
};
