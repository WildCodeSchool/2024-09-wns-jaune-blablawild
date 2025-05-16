import { NextFunction, Request, Response } from "express";
import { GraphQLError } from "graphql";
import * as jwt from "jsonwebtoken";

export const generateToken = (id: string, res: Response) => {
  if (!process.env.JWT_SECRET) throw new Error("Missing env variable");
  const tokenContent = { id };

  const token = jwt.sign(tokenContent, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.ENV === 'production',
    sameSite: "strict",
  });

  return token
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.ENV === 'production',
    sameSite: "strict",
    path: "/"
  })
}

export const checkToken = async ({ req, res }: { req: Request, res: Response }) => {
      if (!process.env.JWT_SECRET)
        throw new Error("Missing environment variable");
      
      const token = req.headers.cookie?.split("token=")[1]?.split(";")[0];
      if (!token) {
        console.log("no token")
        return { res }
      };
      
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return {
          res,
          user
        }
      } catch (error: any) {
        if (error.name === "TokenExpiredError") {
          res.clearCookie("token");
          throw new GraphQLError("Le token d'authentification a expiré", {
            extensions: {
              code: "TOKEN_EXPIRED",
              http: { status: 401 }
            }
          })
        } else if (error.name === "JsonWebTokenError") {
          res.clearCookie("token");
          throw new GraphQLError("Token invalide. L'authentification a échoué.", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 }
        }
      })
    } else {
      throw new Error("Authentication error " + error.message)
      }}
    }
