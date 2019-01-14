import GameScene from "./GameScene";

export default class PauseDialog extends Laya.Dialog {

    private lblPause: Laya.Label;

    private lblWin: Laya.Label;

    private lblLose: Laya.Label;

    private viewScore: Laya.View;

    private lblScore: Laya.Label;

    private lblTotalScore: Laya.Label;

    private imgPause: Laya.Sprite;

    private imgLose: Laya.Sprite;

    private imgWin: Laya.Sprite;

    private btnLeft: Laya.Sprite;

    private btnRight: Laya.Sprite;

    private lblContinue: Laya.Label;

    private lblAnotherGame: Laya.Label;

    private lblRestart: Laya.Label;

    private gameScene: GameScene;

    constructor() { super(); this.autoDestroyAtClosed = true; }

    private onBackToMainMenu(): void {
        this.close();
        Laya.Scene.open('scenes/StartScene.scene');
    }

    private onContinueGame(): void {
        this.close();
        this.gameScene.onResumeGame();
    }

    private onAnotherGame(): void {
        this.close();
        this.gameScene.onNewGame();
    }

    private onRestartGame(): void {
        this.close();
        this.gameScene.onRestartGame();
    }

    onOpened(data: any) {
        this.gameScene = data['scene'];
        if (data['isPaused']) {
            this.lblPause.visible = true;
            this.imgPause.visible = true;
            this.lblContinue.visible = true;
            this.btnRight.on(Laya.Event.CLICK, this, this.onContinueGame);
        } else {
            if (data['isWon']) {
                this.lblWin.visible = true;
                this.viewScore.visible = true;
                this.lblScore.changeText(data['score']);
                this.lblTotalScore.changeText(data['totalScore']);
                this.imgWin.visible = true;
                this.lblAnotherGame.visible = true;
                this.btnRight.on(Laya.Event.CLICK, this, this.onAnotherGame);
            } else {
                this.lblLose.visible = true;
                this.imgLose.visible = true;
                this.lblRestart.visible = true;
                this.btnRight.on(Laya.Event.CLICK, this, this.onRestartGame);
            }
        }
        this.btnLeft.on(Laya.Event.CLICK, this, this.onBackToMainMenu);
    }

    onClosed(): void {
        this.gameScene = null;
    }
}