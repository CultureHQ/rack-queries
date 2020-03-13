import * as React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryList from "../QueryList";

(window as any).XMLHttpRequest = jest.fn();

test("renders the list of queries", async () => {
  const queries = [
    { name: "Queries::UserNamesQuery", opts: [] },
    { name: "Queries::UserCountQuery", opts: [] }
  ];

  (window as any).XMLHttpRequest.mockImplementation(() => makeXHRMock(() => ({ queries })));

  let getByText: (text: string) => HTMLElement;
  let queryByText: (text: string) => HTMLElement | null = () => null;

  await act(
    async () => {
      ({ getByText, queryByText } = render(<QueryList />));

      await waitFor(() => queries.map(query => getByText(query.name)));
    }
  );

  act(() => void fireEvent.click(getByText(queries[0].name)));

  expect(queryByText("Run")).toBeTruthy();
});
