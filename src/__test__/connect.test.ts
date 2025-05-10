import { connect } from "../lib/ifa/connect";

describe("connect function", () => {
  it("should connect to the database and database collection created", async () => {
    const dbData = (global as any).dbData;

    const response = await connect();

    expect(response).toEqual(dbData.dbName);
  });
});
