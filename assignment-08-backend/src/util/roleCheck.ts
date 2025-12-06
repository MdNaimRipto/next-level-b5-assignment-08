import { Users } from "../app/modules/users/users.schema";

export const adminCheck = async (email: string, id: string) => {
  const isAdmin = await Users.findOne({ email, _id: id }).select("role");
  if (!isAdmin || isAdmin.role !== "USER") {
    console.log("User is not admin");
    return false;
  }

  return true;
};
