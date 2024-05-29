export type DictionaryId = Intl.UnicodeBCP47LocaleIdentifier;

export type MessageKey = string;

export type MessageTemplate = string;

export type VolumeName = string;

export type VolumeOverride = string;

// Return value wrapped in this weird template string to force tooling
//  to use real value and not just type reference.
export type MessageBuilder<
  TMessageTemplate extends MessageTemplate = MessageTemplate,
> = (variables?: Record<string, string | number>) => `${''}${TMessageTemplate}`;

export type VolumeIndex = Record<MessageKey, MessageTemplate>;

export type VolumeData = Record<MessageKey, MessageBuilder>;

export type VolumeModule = { default: VolumeIndex };

export type VolumeModuleData = VolumeModule['default'];

export type CommonVolumeResourceId<TVolume extends VolumeName> = TVolume;

export type OverriddenVolumeResourceId<TVolume extends VolumeName> =
  `${TVolume}.[${VolumeOverride}]`;

export type VolumeResourceId<TVolume extends VolumeName = VolumeName> =
  | CommonVolumeResourceId<TVolume>
  | OverriddenVolumeResourceId<TVolume>;

export type I18nStorageIndex = Record<VolumeName, VolumeIndex>;

type WrapWithMessageBuilders<TVolumeIndex extends VolumeIndex> = {
  [K in keyof TVolumeIndex]: MessageBuilder<TVolumeIndex[K]>;
};

type I18nStorageVolume<TVolumeData extends VolumeData> =
  | TVolumeData
  | Promise<TVolumeData>;

type I18nStorageVolumeGetter<TVolumeData extends VolumeData> =
  () => I18nStorageVolume<TVolumeData>;

// type StoreRuntime = {
//   [dictionary: DictionaryId]: {
//     [resource: ResourceId<VolumeName>]: () =>
//       | { [messageKey: MessageKey]: MessageBuilder }
//       | Promise<{ [messageKey: MessageKey]: MessageBuilder }>;
//   };
// };
export type I18nStorage<TIndex extends I18nStorageIndex = I18nStorageIndex> =
  Record<
    DictionaryId,
    {
      [K in keyof TIndex &
        string as CommonVolumeResourceId<K>]: I18nStorageVolumeGetter<
        WrapWithMessageBuilders<TIndex[K]>
      >;
    } & {
      [K in keyof TIndex &
        string as OverriddenVolumeResourceId<K>]?: I18nStorageVolumeGetter<
        WrapWithMessageBuilders<TIndex[K]>
      >;
    }
  >;

export type GetI18nStorageVolumeNames<TStore extends I18nStorage> =
  keyof (TStore extends I18nStorage<infer I> ? I : never) & string;

export type GetI18nStorageVolumeData<
  TStore extends I18nStorage,
  TVolumeName extends GetI18nStorageVolumeNames<TStore>,
> =
  TStore[string][TVolumeName] extends I18nStorageVolumeGetter<infer T>
    ? T
    : never;
