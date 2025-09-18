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
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    if (diffHours > 48) {
      currentStreak = 1; 
    } else if (diffHours > 24) {
      
      const isSameDay = now.toDateString() !== lastActive.toDateString();
      if (isSameDay) {
        currentStreak += 1;
      }
    } else {
      
      if (now.toDateString() !== lastActive.toDateString()) {
        currentStreak += 1;
      } else if (currentStreak === 0) {
        currentStreak = 1;
      }
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