import { GetAllProblemsOutput, ProblemSummary } from "mooterview-server";
import { getAllItemsFromDB } from "../../utils/commonDynamodbMethods";
import { PROBLEMS_TABLE } from "../../utils/constants";

export const getProblems = async (): Promise<GetAllProblemsOutput> => {
  const params = {
    TableName: PROBLEMS_TABLE,
    ProjectionExpression: "problemId, title, #lvl",
    ExpressionAttributeNames: {
      "#lvl": "level",
    },
  };

  const problems = await getAllItemsFromDB(params);

  const finalProblems = (problems ?? []).filter(
    (item): item is ProblemSummary =>
      !!item.problemId && !!item.title && !!item.level
  );

  return { problems: finalProblems };
};
