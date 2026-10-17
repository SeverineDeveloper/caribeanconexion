import { describe, expect, it } from "vitest";
import { isStaff, parseRoles, requiresTwoFactor } from "./roles";

describe("parseRoles", () => {
  it("devuelve lista vacía sin rol", () => {
    expect(parseRoles(null)).toEqual([]);
    expect(parseRoles("")).toEqual([]);
  });

  it("separa varios roles y descarta desconocidos y duplicados", () => {
    expect(parseRoles("admin, sales,user,sales")).toEqual(["admin", "sales"]);
  });
});

describe("isStaff", () => {
  it("solo con algún rol interno", () => {
    expect(isStaff(parseRoles("user"))).toBe(false);
    expect(isStaff(parseRoles("operations"))).toBe(true);
  });
});

describe("requiresTwoFactor", () => {
  it("exige 2FA a administradores aunque tengan otros roles", () => {
    expect(requiresTwoFactor(parseRoles("sales,admin"))).toBe(true);
    expect(requiresTwoFactor(parseRoles("sales,operations"))).toBe(false);
  });
});
