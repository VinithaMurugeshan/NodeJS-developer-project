import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export interface IUserController {
  register(req: Request<ParamsDictionary, any, any, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void>;
}

export interface IValidate {
  password(password: string): boolean;
}


export interface User {
    id: number;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string 
}

export interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
