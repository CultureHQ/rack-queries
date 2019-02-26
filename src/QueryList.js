import React, { useCallback, useState } from "react";

import QueryDetails from "./QueryDetails";
import useFetch from "./utils/useFetch";

const Query = ({ active, query, onQueryClick }) => {
  const onClick = useCallback(() => onQueryClick(query), [query, onQueryClick]);
  const className = active ? "query query-active" : "query";

  return (
    <button className={className} type="button" onClick={onClick}>
      {query.name}
    </button>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("/queries");
  const [activeQuery, setActiveQuery] = useState(null);

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  return (
    <main>
      <div className="active">
        {activeQuery && (
          <QueryDetails query={activeQuery} />
        )}
      </div>
      <nav>
        {json.queries.map(query => (
          <Query
            key={query.name}
            active={query === activeQuery}
            query={query}
            onQueryClick={setActiveQuery}
          />
        ))}
      </nav>
    </main>
  );
};

export default QueryList;
