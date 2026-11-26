export type Face = "U" | "D" | "L" | "R" | "F" | "B";
export type Axis = 0 | 1 | 2;
export type Normal = "x+" | "x-" | "y+" | "y-" | "z+" | "z-";
export type Vec3 = [number, number, number];

export interface Cubie {
  position: Vec3;
  stickers: Partial<Record<Normal, Face>>;
}

export interface CubeMove {
  face: Face;
  turns: 1 | -1 | 2;
  notation: string;
}

export interface ParseMovesResult {
  moves: CubeMove[];
  invalidTokens: string[];
}

export const FACE_COLORS: Record<Face, string> = {
  U: "#f6f4ed",
  D: "#f1d83a",
  L: "#ef8c24",
  R: "#d94439",
  F: "#37a96b",
  B: "#3984df",
};

const FACES: Face[] = ["U", "D", "L", "R", "F", "B"];
const FACE_TURN: Record<Face, { axis: Axis; layer: number; direction: 1 | -1 }> = {
  R: { axis: 0, layer: 1, direction: -1 },
  L: { axis: 0, layer: -1, direction: 1 },
  U: { axis: 1, layer: 1, direction: -1 },
  D: { axis: 1, layer: -1, direction: 1 },
  F: { axis: 2, layer: 1, direction: -1 },
  B: { axis: 2, layer: -1, direction: 1 },
};

const NORMAL_VECTOR: Record<Normal, Vec3> = {
  "x+": [1, 0, 0],
  "x-": [-1, 0, 0],
  "y+": [0, 1, 0],
  "y-": [0, -1, 0],
  "z+": [0, 0, 1],
  "z-": [0, 0, -1],
};

function normalFromVector(vector: Vec3): Normal {
  if (vector[0] === 1) return "x+";
  if (vector[0] === -1) return "x-";
  if (vector[1] === 1) return "y+";
  if (vector[1] === -1) return "y-";
  if (vector[2] === 1) return "z+";
  return "z-";
}

export function solvedCube(): Cubie[] {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) !== 1) continue;
        const stickers: Partial<Record<Normal, Face>> = {};
        if (x === 1) stickers["x+"] = "R";
        if (x === -1) stickers["x-"] = "L";
        if (y === 1) stickers["y+"] = "U";
        if (y === -1) stickers["y-"] = "D";
        if (z === 1) stickers["z+"] = "F";
        if (z === -1) stickers["z-"] = "B";
        cubies.push({ position: [x, y, z], stickers });
      }
    }
  }
  return cubies;
}

export function parseMoveSequence(sequence: string): ParseMovesResult {
  const tokens = sequence.trim() ? sequence.trim().split(/\s+/) : [];
  const moves: CubeMove[] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    const match = /^([UDLRFB])([2']?)$/.exec(token);
    if (!match) {
      invalidTokens.push(token);
      continue;
    }
    const face = match[1] as Face;
    const suffix = match[2];
    const turns: CubeMove["turns"] = suffix === "2" ? 2 : suffix === "'" ? -1 : 1;
    moves.push({ face, turns, notation: token });
  }
  return { moves, invalidTokens };
}

function rotateVector(vector: Vec3, axis: Axis, quarterTurns: number): Vec3 {
  const count = ((quarterTurns % 4) + 4) % 4;
  let [x, y, z] = vector;
  for (let i = 0; i < count; i++) {
    if (axis === 0) [x, y, z] = [x, -z, y];
    else if (axis === 1) [x, y, z] = [z, y, -x];
    else [x, y, z] = [-y, x, z];
  }
  return [x, y, z];
}

export function applyMove(cube: Cubie[], move: CubeMove): Cubie[] {
  const definition = FACE_TURN[move.face];
  const quarterTurns = definition.direction * move.turns;
  return cube.map(cubie => {
    if (cubie.position[definition.axis] !== definition.layer) {
      return { position: [...cubie.position] as Vec3, stickers: { ...cubie.stickers } };
    }

    const position = rotateVector(cubie.position, definition.axis, quarterTurns);
    const stickers: Partial<Record<Normal, Face>> = {};
    for (const [normal, face] of Object.entries(cubie.stickers) as [Normal, Face][]) {
      const rotatedNormal = rotateVector(NORMAL_VECTOR[normal], definition.axis, quarterTurns);
      stickers[normalFromVector(rotatedNormal)] = face;
    }
    return { position, stickers };
  });
}

export function applySequence(cube: Cubie[], sequence: string | CubeMove[]): Cubie[] {
  const parsed = typeof sequence === "string" ? parseMoveSequence(sequence) : { moves: sequence, invalidTokens: [] };
  if (parsed.invalidTokens.length > 0) {
    throw new Error(`Invalid move notation: ${parsed.invalidTokens.join(", ")}`);
  }
  return parsed.moves.reduce((state, move) => applyMove(state, move), cube);
}

export function cubeSignature(cube: Cubie[]): string {
  return cube
    .map(cubie => {
      const position = cubie.position.join(",");
      const stickers = Object.entries(cubie.stickers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([normal, face]) => `${normal}:${face}`)
        .join(",");
      return `${position}|${stickers}`;
    })
    .sort()
    .join(";");
}

export function isSolved(cube: Cubie[]): boolean {
  return cubeSignature(cube) === cubeSignature(solvedCube());
}

export function getFaceList(): Face[] {
  return [...FACES];
}
