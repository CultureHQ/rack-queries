import * as React from "react";
import { act, fireEvent, render, waitForElement } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryDetails from "../QueryDetails";

document.body.dataset.scriptName = "/queries";
(window as any).XMLHttpRequest = jest.fn();

test("renders the list of opts", async () => {
  (window as any).XMLHttpRequest.mockImplementation(() => makeXHRMock(path => {
    switch (path) {
      case "/queries/queries/FooQuery/opts/fooOpt":
        return { values: ["FooValue", "BarValue"] };
      case "/queries/queries/FooQuery?fooOpt=BarValue":
        return { results: 5 };
      default:
        return null;
    }
  }));

  let getByText: (text: string) => HTMLElement;
  let getByRole: (text: string) => HTMLElement;

  act(() => {
    ({ getByText, getByRole } = render(
      <QueryDetails query={{ name: "FooQuery", desc: null, opts: ["fooOpt"] }} />
    ));
  });

  await waitForElement(() => getByText("FooValue"));

  act(() => {
    fireEvent.change(getByRole("listbox"), {
      target: { value: "BarValue" }
    });
  });

  act(() => void fireEvent.click(getByText("Run")));

  await waitForElement(() => getByText("Result: 5"));
});
