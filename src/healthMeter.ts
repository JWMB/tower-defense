export class HealthMeter {
	public static drawCanvas(ctx: CanvasRenderingContext2D, fract: number) {
		const width = 50;
		const height = 10;

		ctx.fillStyle = "rgba(64,196,0, 1)";
		ctx.fillRect(0,0, Math.round(width * fract), height);

		ctx.strokeStyle = "rgba(0,0,0, 1)";
		ctx.strokeRect(0,0, width, height);
	}
}