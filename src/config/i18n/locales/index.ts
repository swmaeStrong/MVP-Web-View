import { ko } from './ko';
import { en } from './en';

export const translations = {
  ko,
  en,
} as const;

export type TranslationKey = keyof typeof ko;
export type TranslationNestedKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${string & TranslationNestedKey<T[K]>}`
        : string & K;
    }[keyof T]
  : never;

export type FullTranslationKey = TranslationNestedKey<typeof ko>;

export { ko, en };