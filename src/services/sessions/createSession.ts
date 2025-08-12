import { v4 as uuidv4 } from "uuid";
import { SESSIONS_TABLE } from "../../utils/constants";
import { putItemToDB } from "../../utils/commonDynamodbMethods";

export const createSession = async (input: any) => {
  const userId = input.userId!;
  const problemId = input.problemId!;
  const chatsQueue = input.chatsQueue! || [];
  const startTime = input.startTime! ;
  const endTime = input.endTime! || "";
  const problemStatus = input.problemStatus!;
  const notes = input.notes! || [];
  const problemPattern = input.notes! || [];

  const sessionId = `session_${uuidv4()}`;

  console.log("sessionId: ", sessionId);
  const params = {
    TableName: SESSIONS_TABLE,
    Item: {
      sessionId: sessionId,
      userId,
      problemId,
      chatsQueue,
      startTime,
      endTime,
      problemStatus,
      notes,
      problemPattern
    },
  };

  console.log("before putting to dydb")
  
  await putItemToDB(params);
  console.log("after putting to dydb")
  return { message: "Session created successfully!", sessionId };
};
