import { expect } from 'chai';
import sinon from 'sinon';
import * as uuid from 'uuid';
import * as dbMethods from '../../../src/utils/commonDynamodbMethods';
import { createProblem } from '../../../src/services/problems/createProblem';
import { PROBLEMS_TABLE } from '../../../src/utils/constants';

describe('createProblem', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('stores the problem and returns the id', async () => {
    const putStub = sinon.stub(dbMethods, 'putItemToDB').resolves();

    const input = {
      title: 'Title',
      problemStatement: 'statement',
      problemDescription: 'desc',
      level: 'easy',
      averageSolveTime: 5,
      totalUsersAttempted: 1,
    };

    const result = await createProblem(input);

    expect(putStub.calledOnce).to.be.true;
    const args = putStub.firstCall.args[0] as any;
    expect(args.TableName).to.equal(PROBLEMS_TABLE);
    expect(args.Item).to.include({
      title: 'Title',
      problemStatement: 'statement',
      problemDescription: 'desc',
      level: 'easy',
      averageSolveTime: 5,
      totalUsersAttempted: 1,
    });
    expect(args.Item.problemId).to.match(/^problem_/);

    expect(result).to.deep.equal({ message: 'Problem created successfully!', problemId: args.Item.problemId });
  });
});
