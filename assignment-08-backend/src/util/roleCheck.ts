import { Users } from "../app/modules/users/users.schema";

export const roleCheck = async (
  email: string,
  id: string,
  roles: string[],
): Promise<boolean> => {
  const user = await Users.findOne({ email, _id: id }).select("role");
  if (!user) return false;

  return roles.includes(user.role);
};
