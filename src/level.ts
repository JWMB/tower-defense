import type { GameObject } from "./actors/gameobject";
import { Grunt } from "./actors/grunt";
import { Player } from "./actors/player";
import { Tower } from "./actors/tower";
import { Point } from "./geometry/point";
import { LineTo, Path, SplineTo } from "./path";
import type { World } from "./world";

export type TypedDict<T> = {
	[key: string]: T;
};

export class Level {
	static create(world: World) {
		const player = new Player(1000, new Point(100, 100));
		world.addItem(player);

		world.addItem(new Tower(10, new Point(130, 80)));
		// world.addItem(new Tower(10, new Point(150, 70)))

		world.addItem(new Grunt(10, new Point(100, 0)));
		world.addItem(new Grunt(10, new Point(200, 100)));

		const path = new Path();
		path.add(new LineTo(new Point(50, 50)));
		path.add(new LineTo(new Point(60, 60)));
		path.add(new SplineTo(new Point(150, 100)));
		path.add(new SplineTo(new Point(0, 200)));
		path.add(new SplineTo(new Point(200, 200)));
		const g = new Grunt(100, new Point(0,0));
		g.path = path;
		world.addItem(g);

		const playlist: TypedDict<any> = {
			0: {
				create: [
					{ type: "player", loc: "100;100" },
					{ type: "tower", loc: "130;80" },
					{ type: "grunt", loc: "100;0" },
					{ type: "grunt", loc: "200;100" },
				]
			},
			1000: {
				create: [
					{ type: "grunt", loc: "100;0" },
				]
			}
		};

		// playlist.keys
	}

	// static createType(type: string, arguments: any) {
	// 	let obj: GameObject;
	// 	switch (type) {
	// 		case "player":
	// 			// Player.call
	// 	}
	// }
}