import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './user.model';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../guards/constants/rolePermissions';


let users: User[] = [];

jest.mock('./user.model.ts');

const mockUser = {
  email: 'mock@mail.com',
  password: 'asd123456',
  role: Roles.User
}

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const jwtServiceMock = {
    signAsync: jest.fn().mockReturnValue('thisisToken')
  };
  
  const userModelMock = {
    $create: jest.fn().mockImplementation((args: Partial<User>) => {
      const user = { ...args, id: Math.floor(Math.random() * 999) } as User;
      users.push(user);
      return user;
    }),
    findOne: jest.fn().mockImplementation((query) => {
      const [[key,value]]= Object.entries(query.where);
      return users.find(user => user[key] === value);
    }),
  };

  const configServiceMock = {
    get: jest.fn().mockReturnValue('dummyValue')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: userModelMock
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock
        },
        {
          provide: ConfigService,
          useValue: configServiceMock
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService)
  });

  afterEach(async() => {
    users = [];
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
