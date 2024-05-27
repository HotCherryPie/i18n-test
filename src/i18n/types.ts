export type VolumeName = string;

export type VolumeData = Record<string, string>;

export type VolumeOverride = `[${string}]`;

type CommonResourceId<TVolume extends VolumeName> = TVolume;

type OverriddenResourceId<TVolume extends VolumeName> =
  `${TVolume}.${VolumeOverride}`;

type ResourceId<TVolume extends VolumeName = VolumeName> =
  | CommonResourceId<TVolume>
  | OverriddenResourceId<TVolume>;

export type I18nStorageIndex = Record<VolumeName, VolumeData>;

export type I18nStorage<TIndex extends I18nStorageIndex> = Record<
  Intl.UnicodeBCP47LocaleIdentifier,
  {
    [K in keyof TIndex & string as ResourceId<K>]: () =>
      | TIndex[K]
      | Promise<TIndex[K]>;
  }
>;
