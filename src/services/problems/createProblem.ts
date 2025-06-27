// import { CreateProblemInput } from "mooterview-server";
// import { handleValidationErrors } from "../../utils/handleValidationError";
import { putItemToDB } from "../../utils/commonDynamodbMethods";
import { v4 as uuidv4 } from "uuid";
import { PROBLEMS_TABLE } from "../../utils/constants";
import { CreateProblemInputType } from "../../routes/problems.route";

export const createProblem = async (input: CreateProblemInputType) => {
  // const validateInput = CreateProblemInput.validate(input);
  // handleValidationErrors(valijkdateInput);

  const title = input.title!;
  const problemStatement = input.problemStatement!;
  const problemDescription = input.problemDescription!;
  const level = input.level!;
  const averageSolveTime = input.averageSolveTime!;
  const totalUsersAttempted = input.totalUsersAttempted!;

  const problemId = `problem_${uuidv4()}`;

  const params = {
    TableName: PROBLEMS_TABLE,
    Item: {
      problemId: problemId,
      title,
      problemStatement,
      problemDescription,
      level,
      averageSolveTime,
      totalUsersAttempted,
    },
  };
  await putItemToDB(params);
  return { message: "Problem created successfully!", problemId };
};
