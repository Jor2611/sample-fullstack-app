import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../user/user.service";
import { AccessTypes, Permission, Roles, rolePermissionMap } from "./constants/rolePermissions";

@Injectable()
export class RBACGuard implements CanActivate{
  constructor(private reflector: Reflector, private userService: UserService){}
  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const acl = this.reflector.get('acl',context.getHandler()); 
    if(acl){

      if(!request.decoded){
        throw new UnauthorizedException();
      }

      //In case if we decide to add a root role
      if(request.decoded.role === 'root'){
        request.accessType = AccessTypes.All;
        return true;
      }

      const user = await this.userService.findOneBy({ id: request.decoded.id });

      //In case token exists, but user not!
      if(!user){
        throw new UnauthorizedException();
      }
      
      //Still we use role which was in token
      const permission = this.checkPermission(request.decoded.role, acl.resource, acl.operation);

      if(!permission){
        return false;
      }

      request.accessType = permission.access;

      /////////////////////////////////////////////////////////////////////////////////////
      /// We could check for ownership here as well, through the controller's arguments ///
      /// fetching, but it will take more runtime and memory processes as RBAC used     ///
      /// frequently. So it would be better if ownership checking was done in route     ///
      /// handlers, even if it ends up with code repeating.                             ///
      /////////////////////////////////////////////////////////////////////////////////////
    }

    return true;
  }

  private checkPermission(userRole: Roles, resource: string, operation: string): Permission {
    const userPermissions = rolePermissionMap[userRole];
    const matchingPermission = userPermissions.find(perm => perm.resource === resource && perm.operation === operation);
    
    return matchingPermission;  
  }
}