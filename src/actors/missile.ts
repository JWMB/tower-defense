import { Point } from "../geometry/point";
import { Trig } from "../geometry/trig";
import { World } from "../world";
import { GameObject } from "./gameobject";
import { Sprite } from "./sprite";

export class Missile extends GameObject {
	source: GameObject | null = null;
	target: Point | GameObject;
	velocity: number;
	damage: number;
	maxDistance: number;

	totalDistance: number = 0;

	private lastTargetLoc: Point;
	constructor(damage: number, start: Point, target: Point | GameObject, velocity: number = 1, source?: GameObject, maxDistance: number = -1) {
		super(0, start);
		this.damage = damage;
		this.target = target;
		this.velocity = velocity;
		this.source = source;
		this.maxDistance = maxDistance;

		const sprite = new Sprite("Missile.png", start);
		sprite.pivot = new Point(0.5, 0.5);
		this.sprites.push(sprite);
	}

	update(world: World) {
		let targetLoc: Point;
		if (this.target instanceof GameObject) {
			if (!!world.getObjectById(this.target.uniqueId)) {
				targetLoc = this.target.loc;
			} else {
				targetLoc = this.lastTargetLoc;
			}
		} else {
			targetLoc = this.target;
		}
		this.lastTargetLoc = targetLoc;

		const step = Trig.normalize(targetLoc, this.loc, this.velocity * world.timeStep);
		this.loc.add(step);
		this.totalDistance += Trig.distance(step);
		this.sprites[0].rotation = Trig.atan2(step) + 3 * Math.PI / 2;
		this.sprites[0].loc = this.loc;

		if (this.maxDistance > 0 && this.totalDistance >= this.maxDistance) {
			this.hp = -1;
		} else {
			const dist = Trig.distance(this.loc, targetLoc);
			if (dist < this.velocity) {
				let trgt: GameObject;
				if (this.target instanceof GameObject) {
					trgt = this.target;
				} else {
					// 
				}
				if (!!trgt) {
					trgt.damaged(this.damage, "Ground");
				}
				this.hp = -1;
			}
		}
	}
}
