import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { SelectUserByIdDto } from './dto/select.user.by.id.dto';
import { BalanceAmountDto } from './dto/balance.amount.dto';

@Controller('users')
export class UsersController {
  @Get(':userId/balance')
  async getUserBalance(@Param() param: SelectUserByIdDto) {
    const { userId } = param;
    return {
      success: true,
      data: {
        id: 1,
        userId,
        balance: 50000,
      },
    };
  }

  @Put(':userId/balance/charge')
  async chargeUserBalance(@Param() param: SelectUserByIdDto, @Body() body: BalanceAmountDto) {
    const { userId } = param;
    const { amount } = body;
    return {
      success: true,
      data: {
        id: 1,
        userId,
        type: 'CHARGE',
        amount,
      },
    };
  }
}
