import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import makeXHRMock from "./makeXHRMock";
import QueryDetails from "../QueryDetails";

document.body.dataset.scriptName = "/queries";
(window as any).XMLHttpRequest = jest.fn();

test("renders the list of opts", async () => {
  (window as any).XMLHttpRequest.mockImplementation(() => makeXHRMock(path => {
    switch (path) {
      case "/queries/queries/FooQuery/opts/fooOpt":
        return { values: ["---", "Foo"] };
      case "/queries/queries/FooQuery?fooOpt=Foo&barOpt=Bar&bazOpt=Baz":
        return { results: 5 };
      default:
        return null;
    }
  }));

  const query = {
    name: "FooQuery",
    desc: null,
    opts: [
      { name: "fooOpt", type: "select" as const },
      { name: "barOpt", type: "string" as const },
      { name: "bazOpt", type: "text" as const }
    ]
  };

  const { getByText, getByLabelText } = render(<QueryDetails query={query} />);

  await waitFor(() => getByText("Foo"));

  fireEvent.change(getByLabelText("fooOpt:"), { target: { value: "Foo" } });
  fireEvent.change(getByLabelText("barOpt:"), { target: { value: "Bar" } });
  fireEvent.change(getByLabelText("bazOpt:"), { target: { value: "Baz" } });

  fireEvent.click(getByText("Run"));

  await waitFor(() => getByText("Result: 5"));
});
