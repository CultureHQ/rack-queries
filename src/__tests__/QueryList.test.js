import React from "react";
import { act, fireEvent, render, waitForElement } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryList from "../QueryList";

window.XMLHttpRequest = jest.fn();

test("renders the list of queries", async () => {
  const queries = [
    { name: "Queries::UserNamesQuery", opts: [] },
    { name: "Queries::UserCountQuery", opts: [] }
  ];

  window.XMLHttpRequest.mockImplementation(() => makeXHRMock(() => ({ queries })));

  let getByText;
  let queryByText;

  act(() => {
    ({ getByText, queryByText } = render(<QueryList />));
  });

  // This is going to issue warnings until
  // https://github.com/babel/babel/issues/5085 is closed (which would allow
  // as to await from within act)
  await Promise.all(queries.map(query => (
    waitForElement(() => getByText(query.name))
  )));

  act(() => {
    fireEvent.click(getByText(queries[0].name));
  });

  expect(queryByText("Run")).toBeTruthy();
});
