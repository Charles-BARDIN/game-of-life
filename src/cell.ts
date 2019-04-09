export class Cell {
    private _isAlive = false

    public get isAlive(): boolean {
        return this._isAlive
    }

    public giveLife() {
        this._isAlive = true
    }

    public kill() {
        this._isAlive = false
    }
}