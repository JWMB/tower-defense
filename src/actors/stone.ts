import { Point } from "../geometry/point";
import { World } from "../world";
import { GameObject, Team } from "./gameobject";

export class Stone extends GameObject {
	constructor(hp: number, loc: Point) {
		super(hp, loc);
		this.team = new Team("Neutral");
	}

	update(world: World) {
	}
}