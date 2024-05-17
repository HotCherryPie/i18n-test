const resolved = import.meta.glob('../translations-2/*/*.ts');

// A lil hack until `import.meta.resolve` support
//  https://github.com/vitejs/vite/issues/14500
export const mapping = Object.entries(resolved)
  .map(
    ([k, v]) =>
      [
        k.slice(0, -3).split('/').slice(-2) as [string, string],
        v.toString().match('"(.+)"')![1] as string,
      ] as const,
  )
  .reduce((out, [[lang, volume], v]) => {
    out[lang] = out[lang] ?? {};
    out[lang]![volume] = v;
    return out;
  }, {} as Record<string, Record<string, string>>);
