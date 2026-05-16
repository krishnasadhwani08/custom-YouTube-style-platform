import { Router }
from "express";

import {

  registerUser,

  verifyEmail,

  loginUser,

  logoutUser

} from "../controllers/user.controller.js";

import { upload }
from "../middlewares/middlewares.js";

import { verifyJWT }
from "../middlewares/auth.middleware.js";

const userRouter =
  Router();

/* ─────────────────────────────────────────────
   Register
───────────────────────────────────────────── */

userRouter.route(
  "/register"
).post(

  upload.fields([

    {

      name: "avatar",

      maxCount: 1
    },

    {

      name: "coverImage",

      maxCount: 1
    }

  ]),

  registerUser
);

/* ─────────────────────────────────────────────
   Verify Email
───────────────────────────────────────────── */

userRouter.route(
  "/verify/:token"
).get(
  verifyEmail
);

/* ─────────────────────────────────────────────
   Login
───────────────────────────────────────────── */

userRouter.route(
  "/login"
).post(
  loginUser
);

/* ─────────────────────────────────────────────
   Logout
───────────────────────────────────────────── */

userRouter.route(
  "/logout"
).post(

  verifyJWT,

  logoutUser
);

export default userRouter;