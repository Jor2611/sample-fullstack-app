import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Roles } from "../../guards/constants/rolePermissions";

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  role: Roles;
}