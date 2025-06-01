import { CreateUserInput } from "mooterview-server";
import { createCognitoUser } from "../../utils/commonCognitoMethods";
import { putItemToDB } from "../../utils/commonDynamodbMethods";
import { handleValidationErrors } from "../../utils/handleValidationError";

export const signupUser = async (userInput: CreateUserInput) => {
  const validateInput = CreateUserInput.validate(userInput);
  handleValidationErrors(validateInput);

  if (!userInput) {
    throw new Error("Invalid Request, Missing Required Fields");
  }
  const username = userInput.username!;
  const email = userInput.email!;
  const password = userInput.password!;
  const fullName = userInput.fullName!;
  const location = userInput.location!;

  const userId = await createCognitoUser(username, email, password);
  await putItemToDB(userId, username, email, fullName, location);
  return { message: "User signed up successfully!", userId };
};
