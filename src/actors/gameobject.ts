import { Point } from "../geometry/point";
import { World } from "../world";
import type { Sprite } from "./sprite";

export interface IUpdate {
	update(world: World);
}
export interface MovingObject {
	loc: Point;
	// speed: Point;

	render();
}

export type XType = "Air" | "Ground";
export class Attack {
	damage: number;
	type: XType;
}

export class Team {
	group: string;
	id: number;
	constructor(group: string, id: number = 0) {
		this.group = group;
		this.id = id;
	}
}

export abstract class GameObject implements MovingObject, IUpdate {
	loc: Point;
	// speed: Point;

	hp: number;
	originalHp: number;
	defence: number = 0;

	team: Team;

	uniqueId: number;
	private static idCnt: number = 0;

	constructor(hp: number, loc: Point) {
		this.hp = hp;
		this.originalHp = hp;

		this.loc = loc.copy();

		this.uniqueId = GameObject.idCnt++;

		this.team = new Team("None");
	}

	sprites: Sprite[] = [];

	update(world: World) {
	}

	render() {
	}

	damaged(damage: number, type: XType) {
		this.hp -= damage * (1 - this.defence);
		if (this.hp <= 0) {
			this.die();
		}
	}

	canBeRemoved() {
		return this.hp <= 0 && (this.originalHp > 0 || this.hp < 0);
	}
	die() {

	}
}
