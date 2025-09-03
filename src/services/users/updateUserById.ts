import { GetUserByIdInput, GetUserByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { updateItemInDB } from "../../utils/commonDynamodbMethods";
import { USERS_TABLE } from "../../utils/constants";
import { getUserById } from "./getUserById";

export const updateUserById = async (input: GetUserByIdInput) => {
    const validateInput = GetUserByIdInput.validate(input);
    handleValidationErrors(validateInput);

    const userId = input.userId!;

    const userData = await getUserById({ userId });

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let currentStreak = userData.currentStreak || 0;
    let longestStreak = userData.longestStreak || 0;
    let lastActiveDate = userData.lastActiveDate || "";
    
    if (lastActiveDate === todayStr) {

    } else if (lastActiveDate === yesterdayStr) {
        currentStreak += 1;
    } else {
        currentStreak = 0;
    }

    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }

    lastActiveDate = todayStr;

    const update_params = {
        TableName: USERS_TABLE,
        Key: { userId },
        UpdateExpression: "SET currentStreak = :cs, longestStreak = :ls, lastActiveDate = :lad",
        ExpressionAttributeValues: {
            ":cs": currentStreak,
            ":ls": longestStreak,
            ":lad": lastActiveDate,
        },
        ReturnValues: "ALL_NEW",
    }

    await updateItemInDB(update_params);
    return { message: "Streak updated successfully" };
}