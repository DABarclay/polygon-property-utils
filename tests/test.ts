import { polygonCentroid, polygonArea, polygonInternalLabel } from "../src";

import { null_cases, test_cases } from "./test_obs";

//let box_1_result = calculateVisualCentre(u);

//console.log(box_1_result);
//if (!box_1_result) throw new Error("Error occoured");

for (let i = 0; test_cases.length > i; i++) {
  test("calculate area basic functionality", () => {
    const box_1_result = polygonArea(test_cases[i].polygon);
    expect(box_1_result).toBe(test_cases[i].area);
  });
  test("calculate visual center", () => {
    const box_1_result = polygonInternalLabel(test_cases[i].polygon);

    expect(box_1_result).toEqual(expect.arrayContaining(test_cases[i].centre));
  });
}

for (let i = 0; null_cases.length > i; i++) {
  test("Expect return null on area", () => {
    const box_1_result = polygonArea(null_cases[i].polygon);
    expect(box_1_result).toBe(0);
  });
  test("Expect return null for label location", () => {
    const box_1_result = polygonInternalLabel(null_cases[i].polygon);

    expect(box_1_result).toEqual(null);
  });
}
