import { secretsManager } from "../../clients/clients";
import { SECRET_NAME } from "../../utils/constants";

export async function fetchGptKey(): Promise<string> {
    console.log("inside fetchGptKey");

    try {
        const secret = await secretsManager
            .getSecretValue({ SecretId: SECRET_NAME })
            .promise();

        if (!secret.SecretString) {
            throw new Error("GPT secret string not found");
        }

        console.log("secret: ", secret)
        console.log("typeof secret: ", typeof secret)
        
        const parsed = JSON.parse(secret.SecretString);
        
        const apiKey = parsed.chatgpt;
        
        if (!apiKey) {
            throw new Error("chatgpt key not found in secret");
        }
        console.log("apiKey: ", apiKey)

        return apiKey;
    } catch (error) {
        console.error("Failed to fetch GPT API key:", error);
        throw new Error("InternalServerException: Could not retrieve API key");
    }
}
