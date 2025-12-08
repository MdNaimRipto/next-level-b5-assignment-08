"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const usersZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string({
            required_error: "User Name is Required",
        }),
        email: zod_1.z.string({
            required_error: "Email is Required",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is Required",
        }),
        password: zod_1.z.string({
            required_error: "Password is Required",
        }),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is Required",
        }),
        password: zod_1.z.string({
            required_error: "Password is Required",
        }),
    }),
});
const userUpdateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string().optional(),
        email: zod_1.z.string().email("Invalid Email Format").optional(),
        contactNumber: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        interests: zod_1.z.array(zod_1.z.string()).optional(),
        location: zod_1.z.string().optional(), // matches your schema default "Not Updated Yet"
        accountStatus: zod_1.z.string().optional(),
    }),
});
const updatePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: "Current Password is Required",
        }),
        newPassword: zod_1.z.string({
            required_error: "New Password is Required",
        }),
        confirmPassword: zod_1.z.string({
            required_error: "Confirm Password is Required",
        }),
    }),
});
exports.UserValidation = {
    usersZodSchema,
    loginUserZodSchema,
    userUpdateZodSchema,
    updatePasswordZodSchema,
};
