import { CreateSessionInputType } from "../../routes/sessions.route";
import { v4 as uuidv4 } from "uuid";
import { SESSIONS_TABLE } from "../../utils/constants";
import { putItemToDB } from "../../utils/commonDynamodbMethods";
import { ProblemStatus } from "mooterview-server";

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
    },
  };

  console.log("before putting to dydb")
  
  await putItemToDB(params);
  console.log("after putting to dydb")
  return { message: "Session created successfully!", sessionId };
};
