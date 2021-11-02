import { Point } from "../geometry/point";
import { Trig } from "../geometry/trig";
import type { Path } from "../path";
import { World } from "../world";
import { GameObject, Team, XType } from "./gameobject";
import { Sprite } from "./sprite";

export class Grunt extends GameObject {
	constructor(hp: number, loc: Point) {
		super(hp, loc);
		this.team = new Team("Enemy");
		this.sprites.push(new Sprite("Grunt.png", loc));
	}

	private attackInterval: number = 5;
	private attackPower: number = 25;
	private speed: number = 2;
	public path: Path;

	private lastAttack: number = Number.MIN_VALUE;
	private distanceInPath: number = 0;

	update(world: World) {
		if (this.path != null) {
			this.loc = this.path.getPointAtDistance(this.distanceInPath);
			this.distanceInPath += this.speed * world.timeStep;
		} else {
			const target = world.getPlayer();
			if (!!target) {
				const dist = Trig.distance(target.loc, this.loc);
				if (dist < 10) {
					const timeDiff = world.time - this.lastAttack;
					if (timeDiff > this.attackInterval) {
						target.damaged(this.attackPower, "Ground");
						this.lastAttack = world.time;
					}
				} else {
					this.loc.add(Trig.normalize(target.loc, this.loc, this.speed * world.timeStep))
				}
			}
		}

		this.sprites[0].loc = this.loc;
		if (this.sprites[0].alpha < 1) {
			this.sprites[0].alpha += 0.1;
		}
	}

	damaged(damage: number, type: XType) {
		super.damaged(damage, type);
		this.sprites[0].alpha = 0.3;
	}
}