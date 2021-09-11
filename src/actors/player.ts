import { Point } from "../geometry/point";
import { GameObject, Team } from "./gameobject";
import { Sprite } from "./sprite";

export class Player extends GameObject {
	constructor(hp: number, start: Point) {
		super(hp, start);
		this.team = new Team("Player");
		this.sprites.push(new Sprite("Hero.png", start));
		// this.image = "S.png";
	}
}
