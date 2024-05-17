export enum Data {
  stringA = 'String A',
  stringB = 'String B',
}

export default Data;

export type Keys = keyof typeof Data;
