import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    // const income = transactions
    //   .filter(t => t.type === 'income')
    //   .map(t => t.value)
    //   .reduce((a, b) => a + b, 0);

    // const outcome = transactions
    //   .filter(t => t.type === 'outcome')
    //   .map(t => t.value)
    //   .reduce((a, b) => a + b, 0);

    // const total = income - outcome;

    // const balance = {
    //   income,
    //   outcome,
    //   total,
    // };
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
