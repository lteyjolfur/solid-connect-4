import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boardWidth,
  boardHeight,
  player1Color as R,
  player2Color as Y,
  winChecker,
  turnToColor,
  fillBoard,
  dropPiece,
} from '../src/game.mjs';

// Build an empty board with independent rows, then place [row, col, color] pieces.
const board = (pieces = []) => {
  const b = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(null));
  for (const [r, c, color] of pieces) b[r][c] = color;
  return b;
};

test('fillBoard creates a 6x7 board filled with the given value', () => {
  const b = fillBoard(null);
  assert.equal(b.length, boardHeight);
  for (const row of b) assert.deepEqual(row, Array(boardWidth).fill(null));
});

test('turnToColor maps true to player 1 (red) and false to player 2 (yellow)', () => {
  assert.equal(turnToColor(true), R);
  assert.equal(turnToColor(false), Y);
});

test('dropPiece lands in the bottom row of an empty column and stacks upward', () => {
  const first = dropPiece(fillBoard(null), 3, R);
  assert.equal(first[boardHeight - 1][3], R);
  const second = dropPiece(first, 3, Y);
  assert.equal(second[boardHeight - 1][3], R);
  assert.equal(second[boardHeight - 2][3], Y);
});

test('dropPiece does not mutate the input board', () => {
  const b = fillBoard(null);
  dropPiece(b, 0, R);
  assert.deepEqual(b, fillBoard(null));
});

test('dropPiece returns null when the column is full', () => {
  let b = fillBoard(null);
  for (let i = 0; i < boardHeight; i++) b = dropPiece(b, 2, i % 2 ? Y : R);
  assert.equal(dropPiece(b, 2, R), null);
});

test('no winner on an empty board or with a mixed non-winning position', () => {
  assert.equal(winChecker.check(fillBoard(null)), null);
  const mixed = board([[5, 0, R], [4, 0, R], [3, 0, R], [2, 0, Y], [5, 1, Y], [5, 2, Y]]);
  assert.equal(winChecker.check(mixed), null);
});

test('vertical four in a row wins (bottom and top of a column)', () => {
  const bottom = board([[5, 4, R], [4, 4, R], [3, 4, R], [2, 4, R]]);
  assert.equal(winChecker.check(bottom), R);
  const top = board([[3, 6, Y], [2, 6, Y], [1, 6, Y], [0, 6, Y]]);
  assert.equal(winChecker.check(top), Y);
});

test('winner is reset between checks', () => {
  winChecker.check(board([[5, 0, R], [4, 0, R], [3, 0, R], [2, 0, R]]));
  assert.equal(winChecker.check(fillBoard(null)), null);
});

// checkRight and checkDiagonal are still empty stubs in the game, so these
// describe the intended behavior and are reported as TODO rather than failing.
test('horizontal four in a row wins', { todo: 'checkRight not implemented yet' }, () => {
  const b = board([[5, 1, R], [5, 2, R], [5, 3, R], [5, 4, R]]);
  assert.equal(winChecker.check(b), R);
});

test('diagonal (down-right) four in a row wins', { todo: 'checkDiagonal not implemented yet' }, () => {
  const b = board([[2, 0, Y], [3, 1, Y], [4, 2, Y], [5, 3, Y]]);
  assert.equal(winChecker.check(b), Y);
});

test('diagonal (up-right) four in a row wins', { todo: 'checkDiagonal not implemented yet' }, () => {
  const b = board([[5, 0, R], [4, 1, R], [3, 2, R], [2, 3, R]]);
  assert.equal(winChecker.check(b), R);
});
