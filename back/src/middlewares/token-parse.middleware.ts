import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";
import { Roles } from "../guards/constants/rolePermissions";

declare global {
  namespace Express {
    interface Request {
      decoded?: TokenData,
      accessType: string
    }
  }
}

interface TokenData {
  id: number;
  username: string;
  email: string;
  role: Roles | 'root';
  iat: number;
  exp: number
}

@Injectable()
export class TokenParse implements NestMiddleware{
  constructor(private jwtService: JwtService){}
  
  async use(req: Request, res: Response, next: NextFunction) {
    if(req.headers['authorization'] || req.query.token){
      const extractedToken = req.headers['authorization'] || req.query.token.toString();
      const [strategy, token] = extractedToken.split(' ');

      if(strategy !== 'Bearer'){
        throw new UnauthorizedException();
      }
      
      req.decoded = await this.parseToken(token);
    }
    req.accessType = 'none';
    return next();
  }

  //Add account service check
  private async parseToken(token: string): Promise<TokenData>{
    try{
      await this.jwtService.verifyAsync(token);
    }catch(err){
      console.log('Unauthorized')
      throw new UnauthorizedException();
    }

    return this.jwtService.decode(token) as TokenData;
  }
}