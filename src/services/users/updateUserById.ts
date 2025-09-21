import { GetUserByIdInput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { updateItemInDB } from "../../utils/commonDynamodbMethods";
import { USERS_TABLE } from "../../utils/constants";
import { getUserById } from "./getUserById";

export const updateUserById = async (input: GetUserByIdInput) => {
  const validateInput = GetUserByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const userId = input.userId!;
  const userData = await getUserById({ userId });

  const now = new Date();
  const lastActive = userData.lastActiveDate ? new Date(userData.lastActiveDate) : null;

  let currentStreak = userData.currentStreak || 0;
  let longestStreak = userData.longestStreak || 0;

  if (lastActive) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffTime = today.getTime() - lastActiveDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak += 1;
    } else if (diffDays > 1) {
      currentStreak = 1;
    } else if (diffDays === 0 && currentStreak === 0) {
        currentStreak = 1;
    }
  } else {
    currentStreak = 1;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }


  const update_params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: "SET currentStreak = :cs, longestStreak = :ls, lastActiveDate = :lad",
    ExpressionAttributeValues: {
      ":cs": currentStreak,
      ":ls": longestStreak,
      ":lad": now.toISOString(),
    },
    ReturnValues: "ALL_NEW",
  }

  await updateItemInDB(update_params);
  return { message: "Streak updated successfully" };
}