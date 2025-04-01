import { NextFunction, Request, Response } from "express";
import _ from "lodash";

export class ApplicationError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.name = "ApplicationError";
    this.statusCode = statusCode || 400;
  }
}
export class ValidationError extends ApplicationError {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.statusCode = 400;
    this.name = "ValidationError";
  }
}
export class NotFoundError extends ApplicationError {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.statusCode = 401;
    this.name = "AuthorizationError";
  }
}

function errorHandler(err: ApplicationError, req: Request, res: Response, next: NextFunction) {
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message, statusCode: err.statusCode, name: err.name });
  } else {
    res.status(500).json({ error: err.message || "Unexpected error occured" });
  }
}

export class AppResponse {
  constructor(private res: Response, private status: number = 200) {
    this.res = res;
    this.status = status;
  }
  render(page: string, data: any = {}) {
    this.res.render(page, data);
    return this;
  }
  redirect(path: string) {
    this.res.redirect(path);
    return this;
  }
  json(data: any) {
    this.res.status(this.status).send(data);
    return this;
  }
  cookie(name: string, value: string, maxAge: number = 60 * 60 * 1000, expires?: Date | undefined) {
    this.res.cookie(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge,
      expires,
    });
    return this;
  }
}

export default errorHandler;
