import React, { useState } from "react";

import QueryDetails from "./QueryDetails";
import useFetch from "./utils/useFetch";

const Query = ({ active, query, onQueryClick }) => {
  const onClick = () => onQueryClick(query);
  const className = active ? "query query-active" : "query";

  return (
    <button className={className} type="button" onClick={onClick}>
      {query.name}
      {query.desc && <p>{query.desc}</p>}
    </button>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("queries");
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
          <QueryDetails key={activeQuery.name} query={activeQuery} />
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
