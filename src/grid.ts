import { Cell } from './cell'

export class Grid {
    private _grid: Cell[][]
    private _aliveCellsPositions: GridPosition[] = []

    private _onCellChange: (row: number, column: number, isAlive: boolean) => void
    public set onCellChange(onCellChange: (row: number, column: number, isAlive: boolean) => void) {
        this._onCellChange = onCellChange
    }

    constructor(private _dimensions: GridDimensions) {
        this._grid = Array
            .from({ length: this._dimensions.height })
            .map(() => Array
                .from({ length: this._dimensions.width })
                .map(() => new Cell())
            )
    }

    public get aliveCellsPositions(): GridPosition[] {
        return this._aliveCellsPositions
    }

    public getNeighboursPositions(position: GridPosition): GridPosition[] {
        if(this._grid.length === 0) {
            return []
        }

        const neighbours: GridPosition[] = []
        const { row, column } = position

        if(row < this._grid.length - 1) {
            neighbours.push({ row: row + 1, column: column })
        }

        if(row > 0) {
            neighbours.push({ row: row - 1, column: column })
        }

        if(column < this._grid[row].length - 1) {
            neighbours.push({ row: row, column: column + 1 })
        }

        if(column > 0 && this._grid[row].length > 0) {
            neighbours.push({ row: row, column: column - 1 })
        }

        return neighbours
    }

    public killCell(position: GridPosition) {
        const positionIndex = this._aliveCellsPositions
            .findIndex(_position => _position.row === position.row && _position.column === position.column)
        
        if(positionIndex < 0) {
            return
        }

        const cell = this._grid[position.row][position.column]
        if(!cell) {
            return
        }

        cell.kill()
        this._aliveCellsPositions.splice(positionIndex, 1)

        if(this._onCellChange) {
            this.onCellChange(position.row, position.column, false)
        }
    }

    public giveLifeToCell(position: GridPosition) {
        const positionIndex = this._aliveCellsPositions
            .findIndex(_position => _position.row === position.row && _position.column === position.column)
    
        if(positionIndex >= 0) {
            return
        }

        const cell = this._grid[position.row][position.column]
        if(!cell) {
            return
        }

        cell.giveLife()
        this._aliveCellsPositions.push(position)
        
        if(this._onCellChange) {
            this.onCellChange(position.row, position.column, true)
        }
    }

    public isAlive(position: GridPosition): boolean {
        const positionIndex = this._aliveCellsPositions
            .findIndex(_position => _position.row === position.row && _position.column === position.column)
        
        return positionIndex >= 0
    }
}

export type GridDimensions = { width: number, height: number }
export type GridPosition = { row: number, column: number }