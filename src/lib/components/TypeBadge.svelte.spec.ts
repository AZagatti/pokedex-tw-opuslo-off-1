import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";

import TypeBadge from "./TypeBadge.svelte";

describe("TypeBadge", () => {
  it("renders the formatted type name", () => {
    const { getByText } = render(TypeBadge, { props: { type: "fire" } });
    expect(getByText("Fire").textContent).toBe("Fire");
  });

  it("applies the type color as a CSS variable", () => {
    const { getByText } = render(TypeBadge, { props: { type: "water" } });
    const badge = getByText("Water");
    expect(badge.getAttribute("style")).toContain("#5090d6");
  });
});
