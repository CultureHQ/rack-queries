declare namespace API {
  type Query = {
    name: string;
    desc: string | null;
    opts: string[];
  };

  type QueryResult = string | string[][];

  type QueryListResponse = {
    queries: Query[];
  };

  type QueryOptsResponse = {
    values: string[];
  };

  type QueryRunResponse = {
    results: QueryResult;
  };
}

export = API;
