import { CreateSessionInputType } from "../../routes/sessions.route";
import { v4 as uuidv4 } from "uuid";
import { SESSIONS_TABLE } from "../../utils/constants";
import { putItemToDB } from "../../utils/commonDynamodbMethods";

export const createSession = async (input: CreateSessionInputType) => {
  const userId = input.userId!;
  const problemId = input.problemId!;
  const chatsQueue = input.chatsQueue!;
  const startTime = input.startTime!;
  const endTime = input.endTime!;
  const problemStatus = input.problemStatus!;
  const notes = input.notes!;

  if (
    !userId ||
    !problemId ||
    !chatsQueue ||
    !startTime ||
    !endTime ||
    !problemStatus ||
    !notes
  ) {
    throw new Error("Invalid Request, Missing Required Fields");
  }

  const sessionId = `session_${uuidv4}`;

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
    },
  };

  await putItemToDB(params);
  return { message: "Session created successfully!", sessionId };
};
