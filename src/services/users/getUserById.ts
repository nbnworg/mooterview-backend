import { GetUserByIdInput, GetUserByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { getItemFromDB, updateItemInDB } from "../../utils/commonDynamodbMethods";
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

  const now = new Date();
  const lastActive = userProfile.lastActiveDate ? new Date(userProfile.lastActiveDate) : null;
  
  if (lastActive && userProfile.currentStreak > 0) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffTime = today.getTime() - lastActiveDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      userProfile.currentStreak = 0;
      const updateParams = {
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: "SET currentStreak = :cs",
        ExpressionAttributeValues: {
          ":cs": 0,
        },
      };
      await updateItemInDB(updateParams);
    }
  }

  return userProfile as GetUserByIdOutput;
};
