import { GetProblemByIdInput, GetProblemByIdOutput } from "mooterview-server";
import { handleValidationErrors } from "../../utils/handleValidationError";
import { PROBLEMS_TABLE } from "../../utils/constants";
import { getItemFromDB } from "../../utils/commonDynamodbMethods";

export const getProblemById = async (input: GetProblemByIdInput) => {
  const validateInput = GetProblemByIdInput.validate(input);
  handleValidationErrors(validateInput);

  const problemId = input.problemId!;

  const params = {
    TableName: PROBLEMS_TABLE,
    Key: { problemId: problemId },
  };

  const problem = await getItemFromDB(params);

  if (!problem) {
    throw new Error("Problem not found");
  }

  return problem as GetProblemByIdOutput;
};
