import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GetUserDto, PutUserBalanceDto } from './users.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PutUserBalanceResponse, GetUserBalanceResponse } from './users.response.dto';
import { Mapper } from '@src/libs/mappers';
import { UsersFacade } from '@src/applications/users/users.facade';

@Controller('users')
export class UsersController {
  constructor(private readonly usersFacade: UsersFacade) {}

  @ApiResponse({ type: GetUserBalanceResponse, status: 200 })
  @ApiOperation({ summary: '사용자 잔액 조회' })
  @Get(':userId/balance')
  async getUserBalance(@Param() param: GetUserDto): Promise<GetUserBalanceResponse> {
    const result = await this.usersFacade.getUserBalanceByUserId(param.userId);
    return await Mapper.classTransformer(GetUserBalanceResponse, result);
  }

  @ApiResponse({ type: PutUserBalanceResponse, status: 201 })
  @ApiOperation({ summary: '사용자 잔액 충전' })
  @Put(':userId/balance/charge')
  async chargeUserBalance(
    @Param() param: GetUserDto,
    @Body() body: PutUserBalanceDto,
  ): Promise<PutUserBalanceResponse> {
    const result = await this.usersFacade.charge(param.userId, body.amount);
    return await Mapper.classTransformer(PutUserBalanceResponse, result);
  }
}
