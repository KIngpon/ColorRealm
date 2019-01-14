import GameScene, { Tile, GameConfig } from "./GameScene";
import { between } from "./Utils";


export default class GameController extends Laya.Script {

    private field: Tile[][];

    private matched: Tile[];

    private config: GameConfig;

    private rows: number;

    private columns: number;

    private colors: number;

    private _moves: number;

    /**
     *
     */
    constructor() {
        super();
        this.matched = [];
        this.gameCheckHandler = Laya.Handler.create(this, this.checkGameOver, null, false);
    }

    get moves() { return this._moves; }

    set moves(value) {
        this._moves = value;
        this.ui.moves = value;
    }

    private _bonusTime: number;

    get bonusTime() { return this._bonusTime; }

    set bonusTime(value) {
        this._bonusTime = value;
        if (value <= 0) {
            Laya.timer.clear(this, this.onTimerUpdate);
        }
        this.ui.time = value;
    }

    private isDone: boolean;

    private isWon: boolean;

    private ui: GameScene;

    private gameCheckHandler: Laya.Handler;

    onEnable(): void {
        this.ui = this.owner as GameScene;
        this.moves = this.config.moves;
        this.bonusTime = this.config.bonusTime;
        this.ui.updateField(this.matched);
        Laya.timer.loop(1000, this, this.onTimerUpdate);
    }

    startGame(config?: GameConfig): void {
        this.config = this.config || config;
        this.rows = this.config.rows;
        this.columns = this.config.columns;
        this.colors = this.config.colors;
        this.matched.length = 0;
        if (this.field) {
            this.shuffleField();
        } else {
            this.createField();
        }
        this.enabled = true;
    }

    pauseGame(): void {
        Laya.timer.clear(this, this.onTimerUpdate);
    }

    resumeGame(): void {
        Laya.timer.loop(1000, this, this.onTimerUpdate);
    }

    stopGame(): void {
        Laya.timer.clear(this, this.onTimerUpdate);
        this.enabled = false;
    }

    restartGame(): void {
        this.matched.length = 0;
        this.resetField();
        this.enabled = true;
    }

    startFlood(color: number) {
        let oldColor = this.field[0][0].color;
        if (oldColor === color) {
            Laya.SoundManager.playSound('sounds/click-fail.mp3');
            return;
        }
        Laya.SoundManager.playSound('sounds/click-success.mp3');
        this.moves--;
        this.flood(color, 0, 0);
        this.ui.updateField(this.matched, this.gameCheckHandler);

    }

    private checkGameOver(): void {
        let isDone = this.checkIsDone();
        // win
        if (isDone && this.moves >= 0) {
            Laya.SoundManager.playSound('sounds/win.mp3');
            this.ui.onWin(this.calculateScore());
            return;
        }
        // lose
        if (!isDone && this.moves <= 0) {
            Laya.SoundManager.playSound('sounds/lose.mp3');
            this.ui.onLose();
            return;
        }
    }

    private flood(color: number, row: number, column: number) {
        this.matched.length = 0;
        let oldColor = this.field[row][column].color;
        let stack = [this.field[row][column]];
        while (stack.length !== 0) {
            let tile = stack.pop();
            let r = tile.row;
            let c = tile.column;
            if (this.matched.indexOf(tile) === -1) {
                tile.color = color;
                this.matched.push(tile);
            }
            if (r > 0 && this.field[r - 1][c].color === oldColor && this.matched.indexOf(this.field[r - 1][c]) === -1) {
                stack.push(this.field[r - 1][c]);
            }
            if (c < this.columns - 1 && this.field[r][c + 1].color === oldColor && this.matched.indexOf(this.field[r][c + 1]) === -1) {
                stack.push(this.field[r][c + 1]);
            }
            if (r < this.rows - 1 && this.field[r + 1][c].color === oldColor && this.matched.indexOf(this.field[r + 1][c]) === -1) {
                stack.push(this.field[r + 1][c]);
            }
            if (c > 0 && this.field[r][c - 1].color === oldColor && this.matched.indexOf(this.field[r][c - 1]) === -1) {
                stack.push(this.field[r][c - 1]);
            }
        }
    }

    private checkIsDone(): boolean {
        for (let r = this.rows - 1; r >= 0; r--) {
            for (let c = this.columns - 1; c >= 0; c--) {
                if (this.field[r][c].color !== this.field[0][0].color) {
                    return false;
                }
            }
        }
        return true;
    }

    private calculateScore(): number {
        let scorePerMove: number, scorePerSecond: number;
        switch (this.config.level) {
            case 'easy':
                scorePerMove = 10;
                scorePerSecond = 20;
                break;
            case 'normal':
                scorePerMove = 25;
                scorePerSecond = 50;
                break;
            case 'hard':
                scorePerMove = 100;
                scorePerSecond = 200;
                break;

        }
        return this.moves * scorePerMove + this.bonusTime * scorePerSecond;
    }

    private createField(): void {
        this.field = [];
        for (let r = 0; r < this.rows; r++) {
            this.field[r] = [];
            for (let c = 0; c < this.columns; c++) {
                let tile = new Tile(r, c, between(0, this.colors));
                this.field[r][c] = tile;
                this.matched.push(tile);
            }
        }
    }

    private resetField(): void {
        let tile: Tile;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                tile = this.field[r][c];
                tile.reset();
                this.matched.push(tile);
            }
        }
    }

    private shuffleField(): void {
        let tile: Tile;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                tile = this.field[r][c];
                tile.color = between(0, this.config.colors);
                this.matched.push(tile);
            }
        }
    }

    private onTimerUpdate(): void {
        this.bonusTime--;
    }
}


