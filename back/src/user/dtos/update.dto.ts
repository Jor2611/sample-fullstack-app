import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdatedDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}