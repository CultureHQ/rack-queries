import React from "react";
import { act, fireEvent, render, waitForElement } from "react-testing-library";

import makeXHRMock from "./makeXHRMock";
import QueryDetails from "../QueryDetails";

document.body.dataset.scriptName = "/queries";
window.XMLHttpRequest = jest.fn();

test("renders the list of opts", async () => {
  window.XMLHttpRequest.mockImplementation(() => makeXHRMock(path => {
    switch (path) {
      case "/queries/queries/FooQuery/opts/fooOpt":
        return { values: ["FooValue", "BarValue"] };
      case "/queries/queries/FooQuery?fooOpt=BarValue":
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

  // This is going to issue warnings until we can use async act
  await waitForElement(() => getByText("FooValue"));

  act(() => {
    fireEvent.change(container.querySelector("select"), {
      target: { value: "BarValue" }
    });
  });

  act(() => void fireEvent.click(getByText("Run")));

  await waitForElement(() => getByText("Result: 5"));
});
