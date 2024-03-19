import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { SignUpDto } from './dtos/signup.dto';
import { Serialize } from '../decorators/serialize.decorator';
import { ResponseDto } from './dtos/response.dto';
import { SignInDto } from './dtos/signin.dto';
import { ACL } from '../decorators/acl.decorator';
import { UpdatedDto } from './dtos/update.dto';

@Controller({
  version: '1',
  path: 'users'
})
@Serialize(ResponseDto) //Serializes data object of the response
export class UserController {
  constructor(private readonly userService: UserService){}

  @Get('/checkToken')
  async checkToken(@Req() req: Request){
    if(!req.query.token){
      return { success: false, msg: 'TOKEN_NOT_PROVIDED' };
    }
    return { msg: 'TOKEN_VERIFIED', data: { ...req.decoded }};
  }

  @Get(':id')
  @ACL('users','read') //Checks access permission  
  async fetch(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number){
    if(req.accessType === 'self'){
      await this.userService.checkOwnership(req.decoded.id, id); //Checks entity ownership in case of ownership
    }

    const data = await this.userService.findOneBy({ id });
    return { msg: 'USER_FETCHED', data };
  }

  @Post()
  async signUp(@Body() body: SignUpDto){
    const data = await this.userService.signUp(body);
    return { msg: 'USER_CREATED', data };
  }

  @Post('token')
  async signIn(@Body() body: SignInDto){
    const data = await this.userService.signIn(body);
    return { msg: 'SIGNED_IN', data };
  }

  @Patch(':id')
  @ACL('users','update')
  async update(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number, @Body() body: UpdatedDto){
    if(req.accessType === 'self'){
      await this.userService.checkOwnership(req.decoded.id, id);
    }

    const data = await this.userService.update(id, body);
    return { msg: 'USER_UPDATED', data };
  }

  @Delete(':id')
  @HttpCode(204)
  @ACL('users','delete')
  async remove(@Req() req: Request, @Param('id', new ParseIntPipe()) id: number){
    if(req.accessType === 'self'){
      await this.userService.checkOwnership(req.decoded.id, id);
    }

    const data = await this.userService.remove(id);
    return { msg: 'USER_REMOVED', data };
  }
}
