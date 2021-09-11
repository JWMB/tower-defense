export class ImageLibrary {
	images = <{[name: string]: ImageBitmap}>{};

	getImage(filename: string) {
		return this.images[filename];
	}

	loadImages(filenames: string[]): Promise<number> {
		return new Promise<number>((res, rej) => {
			Promise.all(filenames.map(async o => {
				const bmp = await this.loadImage(o);
				this.images[o] = bmp;
				return { filename: o, bmp: bmp };
			}))
			.then(r => { res(r.length);});
		});
	}

	loadImage(filename: string): Promise<ImageBitmap> {
		return new Promise<ImageBitmap>((res, rej) => {
			const img = new Image();
			img.onload = async () => {
				const bmp = await createImageBitmap(img);
				res(bmp);
			};
			img.src = filename;
		});
	}
	
}