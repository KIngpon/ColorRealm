import { GameConfig } from "./GameScene";
import AnimatedScene from "./AnimatedScene";

const configEasy: GameConfig = {
    rows: 10, columns: 10, moves: 18, colors: 4, bonusTime: 30, level: 'easy'
}

const configNormal: GameConfig = {
    rows: 12, columns: 12, moves: 21, colors: 5, bonusTime: 45, level: 'normal'
}

const configHard: GameConfig = {
    rows: 14, columns: 14, moves: 25, colors: 6, bonusTime: 60, level: 'hard'
}

export default class LevelScene extends AnimatedScene {
    constructor() {
        super();
        this.autoDestroyAtClosed = true;
    }

    private btnEasy: Laya.Button;

    private btnNormal: Laya.Button;

    private btnHard: Laya.Button;

    onEnable(): void {
        this.btnEasy.on(Laya.Event.CLICK, this, () => Laya.Scene.open('scenes/GameScene.scene', true, configEasy));
        this.btnNormal.on(Laya.Event.CLICK, this, () => Laya.Scene.open('scenes/GameScene.scene', true, configNormal));
        this.btnHard.on(Laya.Event.CLICK, this, () => Laya.Scene.open('scenes/GameScene.scene', true, configHard));
    }
}