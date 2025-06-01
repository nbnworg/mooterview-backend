import { db } from "../clients/clients";
import { USERS_TABLE } from "./constants";

export const putItemToDB = async (
  userId: string,
  username: string,
  email: string,
  fullName: string,
  location: string
) => {
  const userParams = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      username,
      email,
      fullName,
      location,
    },
  };

  await db.put(userParams).promise();
};
