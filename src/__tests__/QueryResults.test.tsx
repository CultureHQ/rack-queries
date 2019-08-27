import * as React from "react";
import { render } from "@testing-library/react";

import QueryResults from "../QueryResults";

test("renders nothing if nothing is yet triggered", () => {
  const { container } = render(
    <QueryResults error={null} fetching={false} results={null} />
  );

  expect(container.querySelector("*")).toBe(null);
});

test("renders an error if there's an error", () => {
  const { queryByText } = render(
    <QueryResults error={new Error("foobar")} fetching={false} results={null} />
  );

  expect(queryByText("error")).toBeTruthy();
});

test("renders a placeholder if it's fetching", () => {
  const { queryByText } = render(
    <QueryResults error={null} fetching results={null} />
  );

  expect(queryByText("fetching")).toBeTruthy();
});

test("renders the results if it's just an object", () => {
  const { queryByText } = render(
    <QueryResults error={null} fetching={false} results="5" />
  );

  expect(queryByText("Result: 5")).toBeTruthy();
});

test("renders a table if it's an array of arrays", () => {
  const results = [
    ["a", "b", "c"],
    [1, 2, 3],
    [4, 5, 6]
  ];

  const { container } = render(
    <QueryResults error={null} fetching={false} results={results} />
  );

  expect(container.querySelectorAll("td")).toHaveLength(6);
});
