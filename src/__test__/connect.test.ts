import { connect } from "../lib/ifa/connect";
import { createCollection } from "../lib/ifa/collection";

it("should connect to the database", async () => {
  const dbData = (global as any).dbData;

  const response = await connect();

  expect(response).toEqual(dbData.dbName);
  expect(createCollection).toHaveBeenCalled();
});
