import React from "react";
import { act, fireEvent, render, waitForElement } from "react-testing-library";

import makeXHRMock from "./makeXHRMock";
import QueryDetails from "../QueryDetails";

window.XMLHttpRequest = jest.fn();

test("renders the list of opts", async () => {
  window.XMLHttpRequest.mockImplementation(() => makeXHRMock(path => {
    switch (path) {
      case "queries/FooQuery/opts/fooOpt":
        return { values: ["FooValue", "BarValue"] };
      case "queries/FooQuery?fooOpt=BarValue":
        return { results: 5 };
      default:
        return null;
    }
  }));

  let getByText;
  let container;

  act(() => {
    ({ getByText, container } = render(
      <QueryDetails query={{ name: "FooQuery", opts: ["fooOpt"] }} />
    ));
  });

  // This is going to issue warnings until
  // https://github.com/babel/babel/issues/5085 is closed (which would allow
  // as to await from within act)
  await waitForElement(() => getByText("FooValue"));

  act(() => {
    fireEvent.change(container.querySelector("select"), {
      target: { value: "BarValue" }
    });
  });

  act(() => {
    fireEvent.click(getByText("Run"));
  });

  await waitForElement(() => getByText("Result: 5"));
});
