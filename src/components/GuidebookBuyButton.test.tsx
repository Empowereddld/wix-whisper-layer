import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GuidebookBuyButton from "./GuidebookBuyButton";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), track: vi.fn(), error: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock("@/lib/guidebookAnalytics", () => ({ trackGuidebookCheckout: mocks.track }));
vi.mock("sonner", () => ({ toast: { error: mocks.error } }));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("existing guidebook checkout wiring", () => {
  it.each([true, false])("uses the same guest-capable checkout and tracks once (hero=%s)", async (hero) => {
    mocks.invoke.mockResolvedValue({ data: { url: "https://checkout.stripe.com/test" }, error: null });
    render(<GuidebookBuyButton hero={hero} />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mocks.track).toHaveBeenCalledTimes(1));
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(mocks.invoke).toHaveBeenCalledWith("create-checkout", {
      body: { resource_id: "1d54403b-1185-46dd-8307-b918a731e580" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(mocks.track).toHaveBeenCalledWith(expect.any(Function));
  });

  it("does not track a failed checkout and allows retry", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: new Error("failed") });
    render(<GuidebookBuyButton hero />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mocks.error).toHaveBeenCalledTimes(1));
    expect(mocks.track).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button"));
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
  });
});