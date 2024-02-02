import HttpError from './HttpError';
import IErrorMessageKey from './IErrorMessageKey.type';

interface IError {
  code: number;
  message: string;
}

export {HttpError};
export type {IErrorMessageKey, IError};
