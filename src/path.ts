import { Point } from "./geometry/point";
import { getCatmullRomPosition } from "./geometry/spline";
import { Trig } from "./geometry/trig";

export class Path {
	private segments: SegmentTo[] = [];
	private lengths: number[] = [];

	add(segment: SegmentTo) {
		this.segments.push(segment);
		this.segments.forEach((s, i) => s.recalc(this, i));
		this.lengths.push(
			this.segments.length === 0 ? 0
				: segment.getLength(this.segments[this.segments.length - 1].end));
	}

	get length(): number {
		return this.lengths.reduce((p, c) => p + c);
	}
	getNumSegments(): number {
		return this.segments.length;
	}

	getSegmentEndPoint(index: number) {
		return this.segments[index].end;
	}

	getPointAtDistance(distance: number) {
		let accumulated = 0;
		for (let index = 0; index < this.lengths.length; index++) {
			const element = this.lengths[index];
			accumulated += element;
			if (accumulated >= distance) {
				if (index === 0) return this.segments[index].end;
				const inSegment = (distance - (accumulated - element)) / element;
				return this.segments[index].getPointAtFraction(inSegment, this, index);
			}
		}
		return new Point(0, 0);
	}

	getPointAtFraction(fraction: number) {
		if (fraction < 0 || fraction > 1) {
			throw new Error(`Out of bounds ${fraction}`);
		}
		return this.getPointAtDistance(fraction * this.length);
	}

	parse(def: string) {
		/*
		https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
    MoveTo: M, m
    LineTo: L, l, H, h, V, v
    Cubic Bézier Curve: C, c, S, s
    Quadratic Bézier Curve: Q, q, T, t
    Elliptical Arc Curve: A, a
    ClosePath: Z, z
*/

	}
}

export abstract class SegmentTo {
	abstract get end(): Point;
	abstract getLength(previousEnd: Point): number;
	abstract getPointAtFraction(fraction: number, path: Path, segmentIndex: number): Point;
	abstract recalc(path: Path, segmentIndex: number);
}

export class SplineTo extends SegmentTo {
	get end(): Point { return this._to; }

	getLength(previousEnd: Point): number {
		return this.distances.reduce((p, c) => p + c);
	}

	private tension: number = 0.5;
	private _to: Point;
	constructor(to: Point) {
		super();
		this._to = to;
	}

	private getSurroundingPoints(path: Path, segmentIndex: number) {
		const maxIndex = path.getNumSegments() - 1;
		return [-2, -1, 1]
			.map(v => segmentIndex + v)
			.map(v => Math.max(0, Math.min(v, maxIndex)))
			.map(v => path.getSegmentEndPoint(v));
	}

	private surroundingPoints: Point[];
	private distances: number[];
	private velocityFactors: number[];

	recalc(path: Path, segmentIndex: number) {
		this.surroundingPoints = this.getSurroundingPoints(path, segmentIndex);
		const pts = this.surroundingPoints;
		const numSteps = 20;
		const points = Array.from(Array(numSteps).keys()).map(index => {
			const fraction = index / numSteps;
			return getCatmullRomPosition(fraction, pts[0], pts[1], this._to, pts[2], this.tension);
		});
		this.distances = [];
		const xx: number[] = [0];
		let len: number = 0;
		for (let index = 1; index < points.length; index++) {
			const dist = Trig.distance(points[index - 1], points[index]);
			len += dist;
			xx.push(len);
			this.distances.push(dist);
		}
		this.velocityFactors = xx.map(o => o / len);
	}

	static getXInterpolated(y: number, yValues: number[]) {
		for (let index = 0; index < yValues.length; index++) {
			const curr = yValues[index];
			if (curr > y) {
				const prev = yValues[index - 1];
				const delta = curr - prev;
				const inbetween = (y - prev) / delta;
				const adjusted = ((index - 1) + inbetween) / (yValues.length - 1);
				return adjusted;
			}
		}
		return y;
	}

	private getVelocityAdjustedFraction(fraction: number) {
		if (fraction === 0 || fraction === 1) return fraction;
		return SplineTo.getXInterpolated(fraction, this.velocityFactors);
	}

	getPointAtFraction(fraction: number, path: Path, segmentIndex: number) {
		const pts = this.surroundingPoints;
		fraction = this.getVelocityAdjustedFraction(fraction);
		return getCatmullRomPosition(fraction, pts[0], pts[1], this._to, pts[2], this.tension);
	}
}

export class LineTo extends SegmentTo {
	get end(): Point { return this._to; }

	getLength(previousEnd: Point): number {
		const diff = new Point(this._to.x - previousEnd.x, this._to.y - previousEnd.y);
		return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
	}

	private _to: Point;

	constructor(to: Point) {
		super();
		this._to = to;
	}

	getPointAtFraction(fraction: number, path: Path, segmentIndex: number) {
		const previousEnd = path.getSegmentEndPoint(Math.max(0, segmentIndex - 1));
		return new Point(
			(this._to.x - previousEnd.x) * fraction + previousEnd.x,
			(this._to.y - previousEnd.y) * fraction + previousEnd.y
		);
	}
	recalc(path: Path, segmentIndex: number) {
	}
}
