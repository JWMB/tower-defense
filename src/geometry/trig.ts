import { IPoint, Point } from "./point";

export class Trig {
	static distance(ptA: IPoint, ptB: IPoint = new Point(0, 0)) {
		const diff = new Point(ptA.x - ptB.x, ptA.y - ptB.y);
		return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
	}
	static distance2(ptA: IPoint, ptB: IPoint = new Point(0, 0)) {
		const diff = new Point(ptA.x - ptB.x, ptA.y - ptB.y);
		return diff.x * diff.x + diff.y * diff.y;
	}

	static atan2(ptA: IPoint, ptB: IPoint = new Point(0, 0)) {
		const diff = new Point(ptA.x - ptB.x, ptA.y - ptB.y);
		return Math.atan2(diff.x, diff.y);
	}
	static normalize(ptA: IPoint, ptB: IPoint, length: number = 1) {
		const diff = new Point(ptA.x - ptB.x, ptA.y - ptB.y);
		const fact = length / Trig.distance(diff);
		return new Point(diff.x * fact, diff.y * fact);
	}
}