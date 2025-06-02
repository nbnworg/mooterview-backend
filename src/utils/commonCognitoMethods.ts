import { cognito } from "../clients/clients";
import { CLIENT_ID, USER_POOL_ID } from "./constants";

export const createCognitoUser = async (
  username: string,
  email: string,
  password: string
) => {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  };

  const user = await cognito.adminCreateUser(params).promise();

  await cognito
    .adminSetUserPassword({
      UserPoolId: USER_POOL_ID,
      Username: username,
      Password: password,
      Permanent: true,
    })
    .promise();

  const userId = user.User?.Attributes?.find(
    (attr) => attr.Name === "sub"
  )?.Value;

  if (!userId) {
    throw new Error("Failed ot retrieve userId from Cognito");
  }
  return userId;
};

export const loginCognitoUser = async (email: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  const response = await cognito.initiateAuth(params).promise();
  return response;
};
