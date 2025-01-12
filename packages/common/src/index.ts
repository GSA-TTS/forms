export { type ServiceMethod, createService } from './service.js';

export type Success<T> = { success: true; data: T };
export type VoidSuccess = { success: true };
export type Failure<E> = { success: false; error: E };
export type Result<T, E = string> = Success<T> | Failure<E>;
export type VoidResult<E = string> = VoidSuccess | Failure<E>;

export const success = <T>(data: T): Success<T> => ({ success: true, data });
export const voidSuccess: VoidSuccess = { success: true };
export const failure = <E>(error: E): Failure<E> => ({ success: false, error });

export { en as enLocale } from './locales/en/app.js';
