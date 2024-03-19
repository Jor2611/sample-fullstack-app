import { 
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from './user.model';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { UpdatedDto } from './dtos/update.dto';

const scrypt = promisify(_scrypt);

type SignInResponse = Partial<User> & { token: string };

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService  
  ){}
  
  async findOneBy(filter: Partial<User>): Promise<User>{
    return this.userModel.findOne({ where: filter });
  }

  async signUp(userData: SignUpDto): Promise<User>{
    const user = await this.userModel.findOne({ where: { email: userData.email } });

    if(user){
      throw new BadRequestException('EMAIL_ALREADY_EXIST');
    }
    
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userData.password, salt, 32)) as Buffer;
    const hashedPassword = `${salt}.${hash.toString('hex')}`;
    const newUser = new User({ ...userData, password: hashedPassword });
    return await newUser.save();
  }

  async signIn(userData: SignInDto): Promise<SignInResponse>{
    try{
      const { email, password } = userData;
      const user = await this.userModel.findOne({ where: { email } });
  
      if(!user){
        throw new BadRequestException('WRONG_CREDENTIALS');
      }
  
      const [salt, storedHash] = user.password.split('.');
      const hash = (await scrypt(password, salt, 32)) as Buffer;
  
      if(storedHash !== hash.toString('hex')){
        throw new BadRequestException('WRONG_CREDENTIALS');
      }

      const payload = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      const options: JwtSignOptions = { expiresIn: this.configService.get<string>('JWT_EXPIRATION') }
      const token = await this.jwtService.signAsync(payload, options);

      return { ...user.dataValues, token };
    }catch(err){
      console.log(err);
      
      if(!(err instanceof BadRequestException)){
        throw new InternalServerErrorException('SERVER_ERROR');
      }
      
      throw err;
    }
  }

  //Improve: Manage query with transaction
  async update(id: number, attrs: UpdatedDto): Promise<User>{
    const user = await this.findOneBy({ id });
    
    if(!user){
      throw new NotFoundException('USER_NOT_FOUND');
    }

    if(attrs.password){
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(attrs.password, salt, 32)) as Buffer;
      attrs.password = `${salt}.${hash.toString('hex')}`;
    }

    Object.assign(user, attrs);
    return await user.save();
  }

  async remove(id:number): Promise<number>{
    const user = await this.findOneBy({ id });

    if(!user){
      throw new NotFoundException('ACCOUNT_NOT_FOUND');
    }

    return await this.userModel.destroy({ where: { id } });
  }

  async checkOwnership(ownerId: number, userId: number): Promise<void>{
    if(ownerId !== userId){
      throw new ForbiddenException();
    }
  }
}


