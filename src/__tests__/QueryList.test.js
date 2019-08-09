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

  await act(
    async () => {
      ({ getByText, queryByText } = render(<QueryList />));

      await waitForElement(() => getByText(queries[0].name));
      await waitForElement(() => getByText(queries[1].name));
    }
  );

  act(() => void fireEvent.click(getByText(queries[0].name)));

  expect(queryByText("Run")).toBeTruthy();
});
