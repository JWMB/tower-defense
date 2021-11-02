import type { GameObject } from "./actors/gameobject";
import type { Player } from "./actors/player";
import type { Point } from "./geometry/point";
import { Trig } from "./geometry/trig";
import { ImageLibrary } from "./imageLibrary";
import type { Path } from "./path";
import { Renderer } from "./renderer";

export class World {
	items: GameObject[];
	time: number = 0;
	timeStep: number = 0.3;
	imgLib: ImageLibrary;
	renderer: Renderer;

	getPlayer(): Player {
		return this.items.find(o => (<any>o.constructor).name == "Player");
	}
	getObjectById(id: number) {
		return this.items.find(o => o.uniqueId === id);
	}
	getObjectsExceptGroup(group: string | string[]) {
		if (typeof group === "string") {
			group = [group];
		}
		return this.items.filter(o => group.indexOf(o.team.group) < 0);
	}
	getObjectsByGroup(group: string) {
		return this.items.filter(o => o.team.group === group);
	}

	getClosestObject(loc: Point, excludedGroups: string[]) {
		const targets = this.getObjectsExceptGroup(excludedGroups);
		if (targets.length) {
			const dists = targets.map(o => ({ o: o, dist2: Trig.distance2(o.loc, loc) }));
			const sorted = dists.sort((a, b) => a.dist2 - b.dist2);
			return sorted[0].o;
		}
		return null;
	}

	async init() {
		this.imgLib = new ImageLibrary();
		await this.imgLib.loadImages(["S.png", "Tower.png", "Grunt.png", "Missile.png", "Hero.png"]);
		this.renderer = new Renderer(this.imgLib);
	}
	
	start() {
		this.items = [];
	}

	addPath(name: string, path: Path) {
	}
	addItem(item: GameObject) {
		this.items.push(item);
	}
	removeItem(item: GameObject) {
		this.items.splice(this.items.indexOf(item), 1);
	}

	update() {
		this.time += this.timeStep;
		for (const item of this.items) {
			item.update(this);
		}
	}
	render() {
		this.renderer.render(this.items);
		for (const item of this.items) {
			if (item.canBeRemoved()) {
				this.removeItem(item);
			}
		}
	}
}
