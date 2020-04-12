import React from "react";
import { render, waitFor } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryResults from "../QueryResults";

document.body.dataset.scriptName = "/queries";
(window as any).XMLHttpRequest = jest.fn();

test("renders the list of opts", async () => {
  (window as any).XMLHttpRequest.mockImplementation(() => makeXHRMock(path => {
    switch (path) {
      case "/queries/queries/FooQuery?fooOpt=FooValue":
        return { results: 5 };
      default:
        return null;
    }
  }));

  const { getByText } = render(
    <QueryResults
      query={{ name: "FooQuery", desc: null, opts: [{ name: "fooOpt", type: "select" }] }}
      values={{ fooOpt: "FooValue" }}
    />
  );

  await waitFor(() => getByText("Result: 5"));
});
