import express from "express";
import { UserController } from "./users.controller";
import zodValidationRequest from "../../../middlewares/zodValidationRequest";
import { UserValidation } from "./users.validation";

const router = express.Router();

router.post(
  "/register",
  zodValidationRequest(UserValidation.usersZodSchema),
  UserController.userRegister,
);

router.post(
  "/login",
  zodValidationRequest(UserValidation.loginUserZodSchema),
  UserController.userLogin,
);

router.get("/me", UserController.getAuthenticatedUserDetails);

router.post("/logout", UserController.logout);

router.patch(
  "/updateUser",
  zodValidationRequest(UserValidation.userUpdateZodSchema),
  UserController.updatedUser,
);

router.patch(
  "/updatePassword",
  zodValidationRequest(UserValidation.updatePasswordZodSchema),
  UserController.updatePassword,
);

router.get("/getAllUsers", UserController.getAllUsers);

router.delete("/deleteUser", UserController.deleteUser);

router.get("/getPublicProfile/:id", UserController.getPublicProfile);

export const UserRouter = router;
