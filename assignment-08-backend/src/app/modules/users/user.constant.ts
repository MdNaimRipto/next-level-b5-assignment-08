import { accountStatusEnums, roleEnums } from "./users.interface";

export const RoleEnums: roleEnums[] = ["USER", "ADMIN", "HOST"];

export const AccountStatusEnums: accountStatusEnums[] = ["ACTIVE", "FREEZE"];

export const UserSearchableFields = ["userName", "email"];

export const UserFilterableFields = [
  "searchTerm",
  "userName",
  "email",
  "accountStatus",
];
