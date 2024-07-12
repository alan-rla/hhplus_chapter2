import { UserBalanceProps, BalanceHistoryProps, UserBalance, BalanceHistory } from '../../domain/models/users.model';
import { UserBalanceEntity, BalanceHistoryEntity } from '../entities';

export class UserMapper {
  static toUserBalanceEntity(props: UserBalanceProps): UserBalanceEntity {
    const entity: UserBalanceEntity = new UserBalanceEntity();

    Object.assign(
      entity,
      props.id ? { id: props.id } : null,
      props.userId ? { userId: props.userId } : null,
      props.balance ? { balance: props.balance } : null,
    );

    return entity;
  }

  static toBalanceHistoryEntity(props: BalanceHistoryProps): BalanceHistoryEntity {
    const entity: BalanceHistoryEntity = new BalanceHistoryEntity();

    entity.userId = props.userId;
    entity.amount = props.amount;
    entity.type = props.type;

    return entity;
  }

  static toUserBalanceDomain(entity: UserBalanceEntity): UserBalance {
    const userBalance: UserBalance = new UserBalance();

    if (entity) {
      userBalance.id = entity.id;
      userBalance.userId = entity.userId;
      userBalance.balance = entity.balance;
    }

    return userBalance;
  }

  static toBalanceHistoryDomain(entity: BalanceHistoryEntity): BalanceHistory {
    const balanceHistory: BalanceHistory = new BalanceHistory();

    if (entity) {
      balanceHistory.id = entity.id;
      balanceHistory.userId = entity.userId;
      balanceHistory.type = entity.type;
      balanceHistory.amount = entity.amount;
      balanceHistory.createdAt = entity.createdAt;
    }
    return balanceHistory;
  }
}
