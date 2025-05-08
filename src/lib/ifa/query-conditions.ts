export class QueryConditions {
  private _query: any = {};
  private _sort: any = null;
  private _limit: number | null = null;

  find(query: any = {}) {
    this._query = query;
    return this;
  }

  sort(sort: any) {
    this._sort = sort;
    return this;
  }

  limit(limit: number) {
    this._limit = limit;
    return this;
  }
}
