import * as React from "react";

import * as API from "./api";

import QueryDetails from "./QueryDetails";
import useFetch from "./utils/useFetch";

type QueryListItemProps = {
  current: boolean;
  query: API.Query;
  onQueryClick: (query: API.Query) => void;
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

const QueryList = () => {
  const { error, fetching, json } = useFetch<API.QueryListResponse>("queries");
  const [currentQuery, setCurrentQuery] = React.useState<API.Query | null>(null);

  if (error) {
    return <>error</>;
  }

  if (fetching) {
    return <>fetching</>;
  }

  const { queries } = json as API.QueryListResponse;

  return (
    <main>
      <div className="active">
        {currentQuery && (
          <QueryDetails key={currentQuery.name} query={currentQuery} />
        )}
      </div>
      <nav>
        {queries.map((query: API.Query) => (
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
