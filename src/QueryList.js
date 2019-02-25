import React, { useCallback, useRef, useState } from "react";

import QueryDetails from "./QueryDetails";
import useFetch from "./utils/useFetch";

const Query = ({ query }) => {
  const queryRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const onToggle = useCallback(
    event => {
      if (queryRef.current === event.target) {
        setExpanded(value => !value);
      }
    },
    [setExpanded, queryRef]
  );

  return (
    <div
      className="query"
      onClick={onToggle}
      ref={queryRef}
      tabIndex={0}
      role="button"
      aria-pressed={expanded}
    >
      {query.name}
      {expanded && <QueryDetails query={query} queryRef={queryRef} />}
    </div>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("/queries");

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  return (
    <div>
      {json.queries.map(query => (
        <Query key={query.name} query={query} />
      ))}
    </div>
  );
};

export default QueryList;
