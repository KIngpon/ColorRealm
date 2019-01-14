export default class AnimatedScene extends Laya.Scene {
    onAwake(): void {
        Laya.Tween.from(this, { x: Laya.stage.width }, 250);
    }
}