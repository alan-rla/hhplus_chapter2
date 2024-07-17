import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GetUserDto, PutUserBalanceDto } from './dto/users.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PutUserBalanceResponseDto, GetUserBalanceResponseDto } from './presenter/users.response.dto';
import { Mapper } from '../../libs/mappers';
import { UsersService } from '../application/users.service';
import { BalanceHistoryProps, UserBalanceProps } from '../domain/models/users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: GetUserBalanceResponseDto, status: 200 })
  @ApiOperation({ summary: '사용자 잔액 조회' })
  @Get(':userId/balance')
  async getUserBalance(@Param() param: GetUserDto): Promise<GetUserBalanceResponseDto> {
    const args = await Mapper.classTransformer(UserBalanceProps, param);
    const result = await this.usersService.getUserBalanceById(args);
    return await Mapper.classTransformer(GetUserBalanceResponseDto, result);
  }

  @ApiResponse({ type: PutUserBalanceResponseDto, status: 201 })
  @ApiOperation({ summary: '사용자 잔액 충전' })
  @Put(':userId/balance/charge')
  async chargeUserBalance(
    @Param() param: GetUserDto,
    @Body() body: PutUserBalanceDto,
  ): Promise<PutUserBalanceResponseDto> {
    const args = await Mapper.classTransformer(BalanceHistoryProps, { ...param, ...body });
    const result = await this.usersService.charge(args);
    return await Mapper.classTransformer(PutUserBalanceResponseDto, result);
  }
}
