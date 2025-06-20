import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { CLIENT_ID, REGION } from "./constants";

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

export const refreshAccessToken = async (refreshToken: string) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  const response = await cognitoClient.send(command);
  const result = response.AuthenticationResult;

  if (!result?.AccessToken || !result.IdToken) {
    throw new Error("Failed to refresh token");
  }

  return {
    accessToken: result.AccessToken,
    idToken: result.IdToken,
  };
};
