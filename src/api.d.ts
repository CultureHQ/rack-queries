declare namespace API {
  type QueryOpt = {
    name: string;
    type: "string" | "select" | "text";
  };

  type Query = {
    name: string;
    desc: string | null;
    opts: QueryOpt[];
  };

  type QueryResult = string | (string | number)[][];

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
