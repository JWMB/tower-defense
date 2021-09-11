export class IPoint {
	x: number;
	y: number;
}

export class Point implements IPoint {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(pt: Point) {
		this.x += pt.x;
		this.y += pt.y;
	}
	copy() {
		return new Point(this.x, this.y);
	}
	toString() {
		return `${this.x}:${this.y}`;
	}

	rMul(scalarOrPoint: number | IPoint) {
		return (typeof scalarOrPoint === "number") 
		? new Point(this.x * scalarOrPoint, this.y * scalarOrPoint)
		: new Point(this.x * scalarOrPoint.x, this.y * scalarOrPoint.y);
	}
	rAdd(scalarOrPoint: number | IPoint) {
		return (typeof scalarOrPoint === "number") 
		? new Point(this.x + scalarOrPoint, this.y + scalarOrPoint)
		: new Point(this.x + scalarOrPoint.x, this.y + scalarOrPoint.y);
	}
	rSub(scalarOrPoint: number | IPoint) {
		return (typeof scalarOrPoint === "number") 
		? new Point(this.x - scalarOrPoint, this.y - scalarOrPoint)
		: new Point(this.x - scalarOrPoint.x, this.y - scalarOrPoint.y);
	}
}
