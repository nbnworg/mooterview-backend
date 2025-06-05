import { loginCognitoUser } from "../../utils/commonCognitoMethods";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await loginCognitoUser(email, password);
    return response;
  } catch (error) {
    console.error("Error occurred while login:", error);
    throw error;
  }
};
