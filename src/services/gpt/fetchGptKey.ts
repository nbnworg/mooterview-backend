import { secretsManager } from "../../clients/clients";
import { SECRET_NAME } from "../../utils/constants";

export async function fetchGptKey(): Promise<string> {
    if (process.env.NODE_ENV === "development") {
        console.log("inside fetchGptKey");
    }

    try {
        const secret = await secretsManager
            .getSecretValue({ SecretId: SECRET_NAME })
            .promise();

        if (!secret.SecretString) {
            throw new Error("GPT secret string not found");
        }

        if (process.env.NODE_ENV === "development") {
            console.log("Fetched secret from Secrets Manager");
        }
        
        const parsed = JSON.parse(secret.SecretString);
        
        const apiKey = parsed.chatgpt;
        
        if (!apiKey) {
            throw new Error("chatgpt key not found in secret");
        }
        if (process.env.NODE_ENV === "development") {
            console.log("Retrieved GPT API key");
        }

        return apiKey;
    } catch (error) {
        console.error("Failed to fetch GPT API key:", error);
        throw new Error("InternalServerException: Could not retrieve API key");
    }
}
