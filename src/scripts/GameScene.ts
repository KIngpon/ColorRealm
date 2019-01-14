import GameController from "./GameController";
import AnimatedScene from "./AnimatedScene";
import { distance } from "./Utils";

const TILE_SIZE = 80;

export type GameConfig = {
    rows: number;
    columns: number;
    moves: number;
    colors: number;
    bonusTime: number;
    level: string;
}

export default class GameScene extends AnimatedScene {

    constructor() {
        super();
        this.autoDestroyAtClosed = true;
    }

    // UI
    private clipMovesTen: Laya.Clip;

    private clipMovesDigit: Laya.Clip;

    private clipTimeTen: Laya.Clip;

    private clipTimeDigit: Laya.Clip;

    private btnPause: Laya.Sprite;

    private viewField: Laya.View;

    private viewButtons: Laya.View;

    private field: Laya.Sprite[][];

    private buttons: Button[];

    private control: GameController;

    private config: GameConfig;

    set moves(value: number) {
        let ten = Math.floor(value / 10);
        let digit = value % 10;
        this.clipMovesTen.index = ten;
        this.clipMovesDigit.index = digit;
    }

    set time(value: number) {
        let ten = Math.floor(value / 10);
        let digit = value % 10;
        this.clipTimeTen.index = ten;
        this.clipTimeDigit.index = digit;
    }

    onOpened(config: GameConfig): void {
        this.config = config;
        this.moves = config.moves;
        this.time = config.bonusTime;
        // create field and buttons
        this.createField(config.rows, config.columns, config.colors);
        this.createButtons(config.colors);
        // start the game
        this.control = this.getComponent(GameController);
        this.control.startGame(config);
        this.addListeners();
    }

    updateField(tiles: Tile[], complete?: Laya.Handler) {
        // let len = tiles.length;
        // let delay = 500 / len;
        tiles
            // .sort((a, b) => distance(a.column, a.row, 0, 0) - distance(b.column, b.row, 0, 0))
            .forEach((tile, index) => {
                let sprite = this.field[tile.row][tile.column];
                // this.timer.once(index * delay, this, () => {
                sprite.graphics.clear();
                sprite.loadImage(`images/colors/${tile.color}.png`);
                // });
            });
        complete &&
            // this.timer.once(500, null, () => {
            complete.run()
        // });
    }

    onNewGame(): void {
        this.control.startGame();
        this.addListeners();
    }

    onResumeGame(): void {
        this.control.resumeGame();
        this.addListeners();
    }

    onWin(score: number): void {
        this.removeListeners();
        this.control.stopGame();
        let totalScore = parseInt(localStorage.getItem('totalScore'));
        totalScore += score;
        localStorage.setItem('totalScore', totalScore.toString());
        Laya.Dialog.open('scenes/PauseDialog.scene', false, { isWon: true, score: score, totalScore: totalScore, scene: this })
    }

    onLose(): void {
        this.removeListeners();
        this.control.stopGame();
        Laya.Dialog.open('scenes/PauseDialog.scene', false, { isWon: false, scene: this })
    }

    onRestartGame(): void {
        this.control.restartGame();
        this.addListeners();
    }

    private createField(rows: number, columns: number, colors: number): void {
        let w = this.viewField.displayWidth, h = this.viewField.displayHeight;
        let size = Math.floor(Math.min(w / columns, h / rows));
        let pivot = size >> 1;
        let sx = ((w - columns * size) >> 1) + pivot;
        let sy = ((h - rows * size) >> 1) + pivot;
        this.field = [];
        for (let r = 0; r < rows; r++) {
            this.field[r] = [];
            for (let c = 0; c < columns; c++) {
                let tile = new Laya.Sprite();
                tile.pos(sx + c * size, sy + r * size, true);
                tile.size(size, size);
                tile.pivot(pivot, pivot);
                this.field[r][c] = tile;
                this.viewField.addChild(tile);
            }
        }
    }

    private createButtons(colors: number): void {
        this.buttons = [];
        let g = Math.floor((this.viewButtons.displayWidth - colors * TILE_SIZE) / (colors - 1));
        let pivot = TILE_SIZE >> 1;
        for (let i = 0; i < colors; i++) {
            let button = new Button(i);
            button.loadImage(`images/colors/${i}.png`);
            button.pos((TILE_SIZE + g) * i + pivot, 0, true);
            button.size(TILE_SIZE, TILE_SIZE);
            button.pivot(pivot, pivot);
            this.buttons.push(button);
            Laya.Tween.from(button, { scaleX: 0, scaleY: 0 }, 250);
            this.viewButtons.addChild(button);
            // // set mask
            // let mask = new Laya.Sprite();
            // mask.graphics.drawCircle(pivot, pivot, pivot, '#ffffff');
            // button.mask = mask;
        }
    }

    private onColorButtonPressed(event: Laya.Event): void {
        event.stopPropagation();
        let button = event.target as Button;
        Laya.Tween.from(button, { scaleX: 1.2, scaleY: 1.2 }, 250);
        this.control.startFlood(button.color);
    }

    private addListeners(): void {
        this.btnPause.on(Laya.Event.CLICK, this, this.onPuaseButtonPressed);
        this.buttons.forEach(button => button.on(Laya.Event.CLICK, this, this.onColorButtonPressed));
    }

    private removeListeners(): void {
        this.btnPause.off(Laya.Event.CLICK, this, this.onPuaseButtonPressed);
        this.buttons.forEach(button => button.off(Laya.Event.CLICK, this, this.onColorButtonPressed));
    }

    private onPuaseButtonPressed(): void {
        this.removeListeners();
        this.control.pauseGame();
        Laya.Dialog.open('scenes/PauseDialog.scene', false, { isPaused: true, scene: this });
    }
}

class Button extends Laya.Sprite {
    constructor(public readonly color: number) { super(); }
}


export class Tile {
    public color: number;

    constructor(public readonly row: number, public readonly column: number, private readonly _color: number) {
        this.color = _color;
    }

    reset(): void {
        this.color = this._color;
    }
}