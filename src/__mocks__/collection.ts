export const createCollection = jest
  .fn()
  .mockImplementation(
    (
      client: string,
      dbName: string,
      collectionName: string,
      options: any,
      callback: () => void
    ) => {
      callback();
    }
  );
