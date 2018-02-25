export const config: { [key: string]: string | undefined } = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  COLLECTION_NAME: process.env.COLLECTION_NAME,
  PORT: process.env.PORT
};

Object.keys(config).forEach(key => {
  const value = config[key];

  if (value === undefined) {
    throw new Error(`${key} missing from environment variables`);
  }
});
