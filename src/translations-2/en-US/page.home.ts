enum Data {
  someString = 'smth str',
}

export default Data;

export type Keys = keyof typeof Data;
