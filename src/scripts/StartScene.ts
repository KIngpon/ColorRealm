import AnimatedScene from "./AnimatedScene";

export default class StartScene extends AnimatedScene {

    private lblStart: Laya.Label;

    constructor() {
        super();
        this.autoDestroyAtClosed = true;
    }

    onEnable(): void {
        this.lblStart.on(Laya.Event.CLICK, this, () => Laya.Scene.open('scenes/LevelScene.scene'));
    }

}