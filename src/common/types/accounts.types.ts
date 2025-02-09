import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAccountDto {
  @IsEnum(['INCOME', 'EXPENSE'])
  @IsNotEmpty()
  type: 'INCOME' | 'EXPENSE';

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  date?: Date;

  @IsOptional()
  @IsString()
  companyId?: string;
}


export class UpdateAccountDto extends PartialType(CreateAccountDto) {}