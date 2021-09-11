import { Point } from "../geometry/point";
import { Trig } from "../geometry/trig";
import { World } from "../world";
import { GameObject, Team } from "./gameobject";
import { Missile } from "./missile";
import { Sprite } from "./sprite";

export class Tower extends GameObject {
	private fireInterval: number = 10;
	private fireLast: number = Number.MIN_VALUE;

	private damage: number = 5;

	constructor(hp: number, loc: Point) {
		super(hp, loc);
		this.team = new Team("Player");
		this.sprites.push(new Sprite("Tower.png", loc));
	}

	update(world: World) {
		const timeDiff = world.time - this.fireLast;
		if (timeDiff < this.fireInterval) {
			return;
		}
		// console.log(timeDiff, world.time);

		const viewDistance = 100;
		const target = world.getClosestObject(this.loc, [this.team.group, "None"]);
		if (!!target && Trig.distance(target.loc, this.loc) < viewDistance) {
			this.fireLast = world.time;
			world.addItem(new Missile(this.damage, this.loc, target, 3, this, viewDistance));
		}
	}
}
