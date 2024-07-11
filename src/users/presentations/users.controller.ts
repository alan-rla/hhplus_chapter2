import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GetUserDto, PutUserBalanceDto } from './dto/users.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PutUserBalanceResponseDto, GetUserBalanceResponseDto } from './presenter/users.response.dto';
import { createResponse } from '../../libs/response';
import { BalanceTypeEnum } from '../../libs/types';

@Controller('users')
export class UsersController {
  @ApiResponse({ type: GetUserBalanceResponseDto, status: 200 })
  @ApiOperation({ summary: '사용자 잔액 조회' })
  @Get(':userId/balance')
  async getUserBalance(@Param() param: GetUserDto): Promise<GetUserBalanceResponseDto> {
    const { userId } = param;
    const result = {
      id: 1,
      userId,
      balance: 50000,
    };
    return await createResponse(GetUserBalanceResponseDto, result);
  }

  @ApiResponse({ type: PutUserBalanceResponseDto, status: 201 })
  @ApiOperation({ summary: '사용자 잔액 충전' })
  @Put(':userId/balance/charge')
  async chargeUserBalance(
    @Param() param: GetUserDto,
    @Body() body: PutUserBalanceDto,
  ): Promise<PutUserBalanceResponseDto> {
    const { userId } = param;
    const { amount } = body;
    const result = {
      id: 1,
      userId,
      type: BalanceTypeEnum.CHARGE,
      amount,
    };
    return await createResponse(PutUserBalanceResponseDto, result);
  }
}
