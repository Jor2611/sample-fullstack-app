import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';
import { Roles } from '../guards/constants/rolePermissions';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  email: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    defaultValue: Roles.User
  })
  role: Roles;
}