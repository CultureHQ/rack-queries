import * as React from "react";
import { act, render, waitForElement } from "@testing-library/react";

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

  let getByText: (text: string) => HTMLElement;

  act(() => {
    ({ getByText } = render(
      <QueryResults
        query={{ name: "FooQuery", desc: null, opts: ["fooOpt"] }}
        values={{ fooOpt: "FooValue" }}
      />
    ));
  });

  await waitForElement(() => getByText("Result: 5"));
});
