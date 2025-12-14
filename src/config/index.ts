function ensureEnv(value: string | undefined, name: string): string {
  if (value === undefined) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const clientConfig = {
  APP_NAME: 'Provalo',
  NODE_ENV: ensureEnv(process.env.NODE_ENV, 'NODE_ENV'),
  APP_URL: ensureEnv(process.env.NEXT_PUBLIC_APP_URL, 'NEXT_PUBLIC_APP_URL'),
};
