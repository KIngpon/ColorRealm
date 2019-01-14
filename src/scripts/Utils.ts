/**
 * return a random number between min (inclusive) and max (exclusive).
 * @param min min value, inclusive
 * @param max max value, exclusive
 */
export function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * return distance between two points a and b.
 * @param ax x position of point a
 * @param ay y position of point a
 * @param bx x position of point b
 * @param by y position of point b
 */
export function distance(ax: number, ay: number, bx: number, by: number) {
    return Math.pow((ax - bx) * (ax - bx) + (ay - by) * (ay - by), 0.5);
}