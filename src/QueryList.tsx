import React, { useState } from "react";

import API from "./api";

import QueryDetails from "./QueryDetails";
import useGet from "./utils/useGet";

type QueryListItemProps = {
  current: boolean;
  query: API.Query;
  onQueryClick: (query: API.Query) => void;
};

const QueryListItem: React.FC<QueryListItemProps> = ({ current, query, onQueryClick }) => {
  const onClick = () => onQueryClick(query);

  return (
    <button className="query" aria-current={current} type="button" onClick={onClick}>
      {query.name}
      {query.desc && <p>{query.desc}</p>}
    </button>
  );
};

const QueryList: React.FC = () => {
  const get = useGet<API.QueryListResponse>("queries");
  const [currentQuery, setCurrentQuery] = useState<API.Query | null>(null);

  if (get.error) {
    return <>error</>;
  }

  if (get.getting) {
    return <>getting</>;
  }

  return (
    <main>
      <div className="active">
        {currentQuery && (
          <QueryDetails key={currentQuery.name} query={currentQuery} />
        )}
      </div>
      <nav>
        {get.got.queries.map(query => (
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
