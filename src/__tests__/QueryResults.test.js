import React from "react";
import { render } from "react-testing-library";

import QueryResults from "../QueryResults";

test("renders nothing if nothing is yet triggered", () => {
  const { container } = render(<QueryResults />);

  expect(container.querySelector("*")).toBe(null);
});

test("renders an error if there's an error", () => {
  const { queryByText } = render(<QueryResults error={new Error("foobar")} />);

  expect(queryByText("error")).toBeTruthy();
});

test("renders a placeholder if it's fetching", () => {
  const { queryByText } = render(<QueryResults fetching />);

  expect(queryByText("fetching")).toBeTruthy();
});

test("renders the results if it's just an object", () => {
  const { queryByText } = render(<QueryResults results={5} />);

  expect(queryByText("Result: 5")).toBeTruthy();
});

test("renders a table if it's an array of arrays", () => {
  const results = [
    ["a", "b", "c"],
    [1, 2, 3],
    [4, 5, 6]
  ];

  const { container } = render(<QueryResults results={results} />);

  expect(container.querySelectorAll("td")).toHaveLength(6);
});
