import { CreateUserInput } from "mooterview-server";
import {
  createCognitoUser,
  loginCognitoUser,
} from "../../utils/commonCognitoMethods";
import { putItemToDB } from "../../utils/commonDynamodbMethods";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { USERS_TABLE } from "../../utils/constants";

export const signupUser = async (userInput: CreateUserInput) => {
  const validateInput = CreateUserInput.validate(userInput);
  handleValidationErrors(validateInput);

  const username = userInput.username!;
  const email = userInput.email!;
  const password = userInput.password!;
  const fullName = userInput.fullName!;
  const location = userInput.location!;

  const userId = await createCognitoUser(email, email, password);
  const currentDate = new Date().toISOString();

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId, username, email, fullName, location,
      tokenTrackingStartDate: currentDate,
      totalInputTokens: 0,
      totalOutputTokens: 0 },
  };
  await putItemToDB(params);

  const loginResponse = await loginCognitoUser(email, password);

  return { message: "User signed up successfully!", userId, loginResponse };
};
