export enum AccessTypes {
  All = 'all',
  Self = 'self',
  None = 'none'
};

export enum Roles {
  User = 'user',
  Admin = 'admin'
}

export interface Permission {
  resource: string;
  operation: string;
  access: AccessTypes ;
}

export const SYSTEM_ID = 1;

export type RolePermissions = Permission[];

/////////////////////////////////////////////////////
/// Currently planned to setup in monolithic app, ///
/// keeping role permissions as constant is okay  ///
/// for now.                                      ///
/////////////////////////////////////////////////////
export const rolePermissionMap = {
  user: [
    { resource: 'users', operation: 'read', access: AccessTypes.Self },
    { resource: 'users', operation: 'create', access: AccessTypes.None },
    { resource: 'users', operation: 'update', access: AccessTypes.Self },
    { resource: 'users', operation: 'delete', access: AccessTypes.Self }
  ],
  admin: [
    { resource: 'users', operation: 'read', access: AccessTypes.All },
    { resource: 'users', operation: 'create', access: AccessTypes.None },
    { resource: 'users', operation: 'update', access: AccessTypes.All },
    { resource: 'users', operation: 'delete', access: AccessTypes.All }
  ]
}