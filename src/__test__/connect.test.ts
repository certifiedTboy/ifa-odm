import { connect } from "../lib/ifa/connect";
import { createCollection } from "../lib/ifa/collection";

describe("connect function", () => {
  it("should connect to the database and database collection created", async () => {
    const dbData = (global as any).dbData;

    const response = await connect();

    expect(response).toEqual(dbData.dbName);
    expect(createCollection).toHaveBeenCalled();
  });
});
