import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryList from "../QueryList";

(window as any).XMLHttpRequest = jest.fn();

test("renders the list of queries", async () => {
  const queries = [
    { name: "Queries::UserNamesQuery", opts: [] },
    { name: "Queries::UserCountQuery", opts: [], desc: "User counts" }
  ];

  (window as any).XMLHttpRequest.mockImplementation(() => makeXHRMock(() => ({ queries })));

  const { getByText, queryByText } = render(<QueryList />);

  await waitFor(() => queries.map(query => getByText(query.name)));
  fireEvent.click(getByText(queries[0].name));

  expect(queryByText("Run")).toBeTruthy();
});
