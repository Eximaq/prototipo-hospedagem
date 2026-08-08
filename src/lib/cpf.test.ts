import { describe, expect, it } from "vitest";
import { formatCPF, isValidCPF, normalizeCPF } from "@/lib/cpf";

describe("CPF helpers", () => {
  it("normalizes and formats CPF input", () => {
    expect(normalizeCPF("529.982.247-25")).toBe("52998224725");
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
  });

  it("validates CPF mathematically", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("529.982.247-24")).toBe(false);
  });
});
