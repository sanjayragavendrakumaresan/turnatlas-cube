import { describe, expect, it } from "vitest";
import { applySequence, isSolved, parseMoveSequence, solvedCube } from "./cube";

describe("cube notation and state transitions", () => {
  it("parses standard face turns, inverses, and half turns", () => {
    const result = parseMoveSequence("R U' F2");
    expect(result.invalidTokens).toEqual([]);
    expect(result.moves.map(move => move.notation)).toEqual(["R", "U'", "F2"]);
  });

  it("reports unsupported tokens instead of silently dropping them", () => {
    const result = parseMoveSequence("R x Q U");
    expect(result.invalidTokens).toEqual(["x", "Q"]);
    expect(result.moves.map(move => move.notation)).toEqual(["R", "U"]);
  });

  it("returns to solved after a move and its inverse", () => {
    expect(isSolved(applySequence(solvedCube(), "R R'"))).toBe(true);
    expect(isSolved(applySequence(solvedCube(), "F2 F2"))).toBe(true);
  });

  it("returns to solved after four clockwise turns of each face", () => {
    for (const face of ["U", "D", "L", "R", "F", "B"]) {
      expect(isSolved(applySequence(solvedCube(), `${face} ${face} ${face} ${face}`))).toBe(true);
    }
  });

  it("does not treat a non-empty legal sequence as solved", () => {
    expect(isSolved(applySequence(solvedCube(), "R U F"))).toBe(false);
  });
});
