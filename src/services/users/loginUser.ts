import { loginCognitoUser } from "../../utils/commonCognitoMethods";

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await loginCognitoUser(username, password);
    return response;
  } catch (error) {
    console.error("Error occurred while login:", error);
    throw error;
  }
};
