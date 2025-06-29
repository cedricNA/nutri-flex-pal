import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CalorieProgress from "../components/CalorieProgress";
import { describe, it, expect } from "vitest";

describe("CalorieProgress", () => {
  it("renders progress text and bar", () => {
    render(<CalorieProgress currentCalories={200} targetCalories={400} />);
    expect(screen.getByText("200 / 400 kcal (50%)")).toBeInTheDocument();
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveStyle("width: 50%");
  });
});
