import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GetUserDto, PutUserBalanceDto } from './dto/users.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PutUserBalanceResponseDto, GetUserBalanceResponseDto } from './presenter/users.response.dto';

@Controller('users')
export class UsersController {
  @ApiResponse({ type: GetUserBalanceResponseDto, status: 200 })
  @ApiOperation({ summary: '사용자 잔액 조회' })
  @Get(':userId/balance')
  async getUserBalance(@Param() param: GetUserDto) {
    const { userId } = param;
    return await GetUserBalanceResponseDto.fromDomain({
      id: 1,
      userId,
      balance: 50000,
    });
  }

  @ApiResponse({ type: PutUserBalanceResponseDto, status: 201 })
  @ApiOperation({ summary: '사용자 잔액 충전' })
  @Put(':userId/balance/charge')
  async chargeUserBalance(@Param() param: GetUserDto, @Body() body: PutUserBalanceDto) {
    const { userId } = param;
    const { amount } = body;
    return await PutUserBalanceResponseDto.fromDomain({
      id: 1,
      userId,
      type: 'CHARGE',
      amount,
    });
  }
}
