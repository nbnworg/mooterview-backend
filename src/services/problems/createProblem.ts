// import { CreateProblemInput } from "mooterview-server";
// import { handleValidationErrors } from "../../utils/handleValidationError";
import { putItemToDB } from "../../utils/commonDynamodbMethods";
import { v4 as uuidv4 } from "uuid";
import { PROBLEMS_TABLE } from "../../utils/constants";
import { CreateProblemInputType } from "../../routes/problems.route";

export const createProblem = async (input: CreateProblemInputType) => {
  const {
    title,
    problemDescription,
    level,
    averageSolveTime,
    sampleInput,
    sampleOutput,
    example,
  } = input;

  const problemId = `problem_${uuidv4()}`;
  const createdAt = new Date().toISOString();

  const params = {
    TableName: PROBLEMS_TABLE,
    Item: {
      problemId,
      title,
     problemDescription,
      level,
      averageSolveTime,
      sampleInput,
      sampleOutput,
      example,
     
    },
  };

  await putItemToDB(params);

  return {
    message: "Problem created successfully!",
    problemId,
  };
};
