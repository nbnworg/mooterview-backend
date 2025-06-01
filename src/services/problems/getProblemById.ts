import { GetProblemByIdInput, GetProblemByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { PROBLEMS_TABLE } from "../../utils/constants";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";

export const getProblemById = async (input: GetProblemByIdInput) => {
  const validateInput = GetProblemByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const problemId = input.problemId!;

  if (!problemId) {
    throw new Error("Invalid Request, Missing Required Fields");
  }

  const params = {
    TableName: PROBLEMS_TABLE,
    Key: { problemId: problemId },
  };

  const problem = await getItemFromDB(params);

  if (!problem) {
    throw new Error("EntityNotFoundException: Problem not found");
  }

  return problem as GetProblemByIdOutput;
};
