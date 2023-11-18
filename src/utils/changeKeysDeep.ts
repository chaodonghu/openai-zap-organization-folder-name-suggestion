import { camelCase, snakeCase } from "lodash";

type ChangeCase = (string: string, f?: any, g?: Array<any>) => string;
type Predicate = (key: string) => boolean;

const defaultPredicate: Predicate = (key) => !key.startsWith("_");

export const changeKeysDeepWith = (
  changeCase: ChangeCase,
  predicate: Predicate = defaultPredicate,
  shouldChangeChildren: Predicate = () => true
) => {
  // The second argument is not used, it's there only to allow this function be
  // passed to map()
  const changeKeysDeep = (
    input: any,
    _?: any,
    keyPath: Array<any> = []
  ): any => {
    if (!input || typeof input !== "object") {
      return input;
    }
    if (Array.isArray(input)) {
      return input.map((val, idx) => changeKeysDeep(val, null, [idx]));
    }
    return Object.entries(input).reduce((cased: any, [key, val]) => {
      const maybeChangeKey = predicate(key)
        ? changeCase(key, val, keyPath)
        : key;
      cased[maybeChangeKey] = shouldChangeChildren(key)
        ? changeKeysDeep(val, null, keyPath.concat([key]))
        : val;
      return cased;
    }, {});
  };
  return changeKeysDeep;
};

export const camelCaseKeysDeep = changeKeysDeepWith(camelCase);
export const snakeCaseKeysDeep = changeKeysDeepWith(snakeCase);
