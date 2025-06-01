import { CreateUserInput } from "mooterview-server";
import { createCognitoUser } from "../../utils/commonCognitoMethods";
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

  if (!username || !email || !password || !fullName || !location) {
    throw new Error("Invalid Request, Missing Required Fields");
  }

  const userId = await createCognitoUser(username, email, password);

  const params = {
    TableName: USERS_TABLE,
    Item: { userId, username, email, fullName, location },
  };
  await putItemToDB(params);
  return { message: "User signed up successfully!", userId };
};
