export type VolumeName = string;

export type VolumeData = Record<string, string>;

export type I18nStorageIndex = Record<VolumeName, VolumeData>;

export type I18nStorage<TIndex = unknown> = Record<
  Intl.UnicodeBCP47LocaleIdentifier,
  { [K in keyof TIndex]: () => TIndex[K] | Promise<TIndex[K]> }
>;
