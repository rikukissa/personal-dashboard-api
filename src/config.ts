const config: { [key: string]: string | number | undefined } = {
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  COLLECTION_NAME: process.env.COLLECTION_NAME,
  PORT: process.env.PORT || 3005,
  HOURS_CSV_URL: process.env.HOURS_CSV_URL,
  HOURS_CSV_USERNAME: process.env.HOURS_CSV_USERNAME,
  HOURS_CSV_PASSWORD: process.env.HOURS_CSV_PASSWORD
};

Object.keys(config).forEach(key => {
  const value = config[key];

  if (value === undefined) {
    throw new Error(`${key} missing from environment variables`);
  }
});

const checkedConfig = config as { [key: string]: string };
export { checkedConfig as config };
