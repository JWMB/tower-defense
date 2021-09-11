import type { Point } from "../geometry/point";

// export interface ISprite {
// 	image: string;
// 	pivot: Point;
// 	rotation: number;
// 	loc: Point;
// }
export class Sprite {
	public image: string;
	public pivot: Point;
	public rotation: number;
	public loc: Point;
	public alpha: number = 1;

	constructor(image: string = null, loc: Point = null) {
		this.image = image;
		this.loc = loc;
	}
}