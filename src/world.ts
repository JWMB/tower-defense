import type { GameObject } from "./actors/gameobject";
import type { Player } from "./actors/player";
import { Sprite } from "./actors/sprite";
import { Point } from "./geometry/point";
import { Trig } from "./geometry/trig";
import { HealthMeter } from "./healthMeter";
import { ImageLibrary } from "./imageLibrary";
import type { Path } from "./path";


export class DisplayObject {
	element: HTMLDivElement;
	uniqueId: number;

	constructor(parent: HTMLElement) {
		const doc = parent.ownerDocument;
		const el = doc.createElement("DIV");
		parent.appendChild(el);

		this.element = <HTMLDivElement>el;
		this.element.style.position = "absolute";
	}

	update(loc: Point, text: string) {
		if (loc != null) {
			this.element.style.left = `${loc.x * 5}px`;
			this.element.style.top = `${loc.y* 5}px`;
		}
		if (text != null) this.element.innerText = text;
	}
}

export class World {
	items: GameObject[];
	time: number = 0;
	timeStep: number = 0.3;
	imgLib: ImageLibrary;

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

	displayObjects: DisplayObject[] = [];

	private refreshElements() {
		const byId = this.displayObjects.filter(o => !Number.isNaN(o.uniqueId)).reduce((map, obj) => {
			map.set(obj.uniqueId, obj);
			return map;
		}, new Map<number, DisplayObject>());

		const unusedElements: DisplayObject[] = Array.from(this.displayObjects);
		const itemToElement = new Map<GameObject, DisplayObject>();
		const unmatchedItems: GameObject[] = [];
		for (const item of this.items) {
			let el = byId.get(item.uniqueId);
			if (!!el) {
				unusedElements.splice(unusedElements.indexOf(el), 1);
				itemToElement.set(item, el);
			} else {
				unmatchedItems.push(item);
			}
		}

		const parent = document.getElementById("game");
		for (const item of unmatchedItems) {
			let el: DisplayObject = null;
			if (unusedElements.length) {
				el = unusedElements.pop();
				el.uniqueId = item.uniqueId;
				el.element.style.visibility = "visible";
				// console.log("reuse");
			} else {
				// console.log("create new element for", item);
				el = new DisplayObject(parent);
				el.uniqueId = item.uniqueId;
				this.displayObjects.push(el);
			}
			itemToElement.set(item, el);
		}

		for (const el of unusedElements.filter(o => !Number.isNaN(o.uniqueId))) {
			// console.log("hide unused element");
			el.uniqueId = Number.NaN;
			el.update(new Point(0,0), "");
			el.element.style.visibility = "hidden";
		}

		return itemToElement;
	}

	private getCanvas(dispObj: DisplayObject): HTMLCanvasElement {
		return (dispObj.element.children.length === 0)
			? null
			: <HTMLCanvasElement>dispObj.element.children.item(0);
	}

	private dodo(gameObject: GameObject, dispObj: DisplayObject) {
		const sprite = gameObject.sprites[0] || new Sprite();
		if (sprite.image != null) {
			const attrNameRender = "data-render";
			let canvas = this.getCanvas(dispObj);
			if (canvas === null) {
				const doc = dispObj.element.ownerDocument;
				canvas = <HTMLCanvasElement>doc.createElement("canvas");
				canvas.width = 200;
				canvas.height = 200;
				dispObj.element.appendChild(canvas);
			}
			const ctx = canvas.getContext("2d");

			const currentRenderSettings = <Sprite>JSON.parse(canvas.getAttribute(attrNameRender) || "{}");
			if (shallowCompare(currentRenderSettings, sprite) === false) {
				const img = this.imgLib.getImage(sprite.image);

				ctx.resetTransform();
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				ctx.translate(img.width * 0.5, img.height * 0.5);
				ctx.rotate(-sprite.rotation);
				ctx.translate(img.width * -0.5, img.height * -0.5);

				ctx.globalAlpha = sprite.alpha;
				ctx.drawImage(img, 0, 0);
				ctx.setTransform(1,0,0,1,0,0);
				ctx.globalAlpha = 1;

				canvas.setAttribute(attrNameRender, JSON.stringify(sprite));
			}
			HealthMeter.drawCanvas(ctx, gameObject.hp / gameObject.originalHp);

			dispObj.update(sprite.loc, null);
		} else {
			const info = `${(<any>gameObject).constructor.name}` + (gameObject.originalHp > 0 ? ` ${gameObject.hp}/${gameObject.originalHp}` : "");
			dispObj.update(sprite.loc, info);
		}

		function shallowCompare(obj1, obj2) {
			return Object.keys(obj1).length === Object.keys(obj2).length &&
			Object.keys(obj1).every(key => obj1[key] === obj2[key]);
		}
	}

	render() {
		const itemToElement = this.refreshElements();

		for (const item of this.items) {
			const el = itemToElement.get(item);

			item.render();
			this.dodo(item, el);

			if (item.canBeRemoved()) {
				this.removeItem(item);
			}
		}
	}
}