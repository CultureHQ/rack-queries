import React, { useState } from "react";
import { act, fireEvent, render, waitForElement } from "react-testing-library";

import makeXHRMock from "./makeXHRMock";
import QueryOpts from "../QueryOpts";

window.XMLHttpRequest = jest.fn();

const QueryOptState = ({ query }) => {
  const [values, setValues] = useState({});
  const onValueChange = (opt, value) => setValues(current => ({ ...current, [opt]: value }));

  return <QueryOpts query={query} values={values} onValueChange={onValueChange} />;
};

test("renders the list of opts", async () => {
  const values = ["FooValue", "BarValue"];

  window.XMLHttpRequest.mockImplementation(() => makeXHRMock(() => ({ values })));

  let getByText;
  let container;

  act(() => {
    ({ getByText, container } = render(
      <QueryOptState query={{ name: "FooQuery", opts: ["fooOpt"] }} />
    ));
  });

  // This is going to issue warnings until
  // https://github.com/babel/babel/issues/5085 is closed (which would allow
  // as to await from within act)
  await waitForElement(() => getByText("FooValue"));

  act(() => {
    fireEvent.change(container.querySelector("select"), {
      target: { value: values[1] }
    });
  });

  expect(container.querySelector("select").value).toEqual(values[1]);
});
