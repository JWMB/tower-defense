import type { Point } from "./point";

export function getCatmullRomPosition(t: number, p0: Point, p1: Point, p2: Point, p3: Point, tension: number = 0.5)
{
	//The coefficients of the cubic polynomial (except the 0.5f * which I added later for performance)
	const a = p1.rMul(2.0);
	const b = p2.rSub(p0);
	const c = p0.rMul(2.0).rSub(p1.rMul(5.0)).rAdd(p2.rMul(4.0)).rSub(p3);
	const d = p0.rMul(-1).rAdd(p1.rMul(3.0)).rSub(p2.rMul(3.0)).rAdd(p3);

	//The cubic polynomial: a + b * t + c * t^2 + d * t^3
	//0.5f * (a + (b * t) + (c * t * t) + (d * t * t * t));
	return (a.rAdd(b.rMul(t)).rAdd(c.rMul(t * t)).rAdd(d.rMul(t * t * t))).rMul(tension);
}
