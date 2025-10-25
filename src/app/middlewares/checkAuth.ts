/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || req.cookies.accessToken;

      if (!authHeader) {
        throw new AppError(403, "No Token Received");
      }

      let accessToken = authHeader;
      if (authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const user = await User.findById(verifiedToken.userId);

      if (!user) {
        throw new AppError(404, "User not found");
      }

      if (authRoles.length && !authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!");
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
