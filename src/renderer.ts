import type { GameObject } from "./actors/gameobject";
import { Sprite } from "./actors/sprite";
import { Point } from "./geometry/point";
import { HealthMeter } from "./healthMeter";
import type { ImageLibrary } from "./imageLibrary";

export class Renderer {
	private imgLib: ImageLibrary;

	constructor(imgLib: ImageLibrary) {
		this.imgLib = imgLib;
	}

	displayObjects: DisplayObject[] = [];

	public render(items: GameObject[]) {
		this.refreshElements(items);
	}

	private refreshElements(items: GameObject[]) {
		const byId = this.displayObjects.filter(o => !Number.isNaN(o.uniqueId)).reduce((map, obj) => {
			map.set(obj.uniqueId, obj);
			return map;
		}, new Map<number, DisplayObject>());

		const unusedElements: DisplayObject[] = Array.from(this.displayObjects);
		const unmatchedItems: GameObject[] = [];
		for (const item of items) {
			let el = byId.get(item.uniqueId);
			if (!!el) {
				unusedElements.splice(unusedElements.indexOf(el), 1);
				el.update(item.sprites[0], item);
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
				el = new DisplayObject(parent, this.imgLib);
				el.uniqueId = item.uniqueId;
				this.displayObjects.push(el);
			}
			el.update(item.sprites[0], item);
		}

		for (const el of unusedElements.filter(o => !Number.isNaN(o.uniqueId))) {
			// console.log("hide unused element");
			el.uniqueId = Number.NaN;
			el.setLoc(new Point(0,0));
			el.element.style.visibility = "hidden";
		}
	}
}

class DisplayObject {
	element: HTMLDivElement;
	uniqueId: number;
	imgLib: ImageLibrary;

	constructor(parent: HTMLElement, imgLib: ImageLibrary) {
		const doc = parent.ownerDocument;
		const el = doc.createElement("DIV");
		parent.appendChild(el);

		this.element = <HTMLDivElement>el;
		this.element.style.position = "absolute";

		this.imgLib = imgLib;
	}

	update(sprite: Sprite, gameObject: GameObject) {
		if (sprite == null) return;

		if (sprite.image != null) {
			const attrNameRender = "data-render";
			let canvas = this.getCanvas();
			if (canvas === null) {
				const doc = this.element.ownerDocument;
				canvas = <HTMLCanvasElement>doc.createElement("canvas");
				canvas.width = 200;
				canvas.height = 200;
				this.element.appendChild(canvas);
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

			this.setLoc(sprite.loc);
		} else {
			const info = `${(<any>gameObject).constructor.name}` + (gameObject.originalHp > 0 ? ` ${gameObject.hp}/${gameObject.originalHp}` : "");
			this.setLoc(sprite.loc);
			this.element.innerText = info;
		}

		function shallowCompare(obj1, obj2) {
			return Object.keys(obj1).length === Object.keys(obj2).length &&
			Object.keys(obj1).every(key => obj1[key] === obj2[key]);
		}
	}

	setLoc(loc: Point) {
		if (loc != null) {
			this.element.style.left = `${loc.x * 5}px`;
			this.element.style.top = `${loc.y* 5}px`;
		}
	}

	private getCanvas(): HTMLCanvasElement {
		return (this.element.children.length === 0)
			? null
			: <HTMLCanvasElement>this.element.children.item(0);
	}

}
