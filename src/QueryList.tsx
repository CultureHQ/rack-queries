import * as React from "react";

import QueryDetails from "./QueryDetails";
import useFetch from "./utils/useFetch";

export type Query = {
  name: string;
  desc: string | null;
  opts: string[];
};

type QueryListItemProps = {
  current: boolean;
  query: Query;
  onQueryClick: (query: Query) => void;
};

const QueryListItem = ({ current, query, onQueryClick }: QueryListItemProps) => {
  const onClick = () => onQueryClick(query);

  return (
    <button className="query" aria-current={current} type="button" onClick={onClick}>
      {query.name}
      {query.desc && <p>{query.desc}</p>}
    </button>
  );
};

type QueryListResult = {
  queries: Query[];
};

const QueryList = () => {
  const { error, fetching, json } = useFetch<QueryListResult>("queries");
  const [currentQuery, setCurrentQuery] = React.useState<Query | null>(null);

  if (error) {
    return <>error</>;
  }

  if (fetching) {
    return <>fetching</>;
  }

  return (
    <main>
      <div className="active">
        {currentQuery && (
          <QueryDetails key={currentQuery.name} query={currentQuery} />
        )}
      </div>
      <nav>
        {json.queries.map((query: Query) => (
          <QueryListItem
            key={query.name}
            current={query === currentQuery}
            query={query}
            onQueryClick={setCurrentQuery}
          />
        ))}
      </nav>
    </main>
  );
};

export default QueryList;
