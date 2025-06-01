import { createCognitoUser } from "../../utils/commonCognitoMethods";
import { putItemToDB } from "../../utils/commonDynamodbMethods";

export const signupUser = async (
  username: string,
  email: string,
  password: string,
  fullName: string,
  location: string
) => {
  try {
    const userId = await createCognitoUser(username, email, password);
    await putItemToDB(userId, username, email, fullName, location);
    return { message: "User signed up successfully!", userId };
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};
