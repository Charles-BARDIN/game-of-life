import { Grid, GridDimensions, GridPosition } from "./grid"

const NUMBERS_OF_ALIVE_NEIGHBOURS_REQUIRED_TO_SURVIVE = [2, 3]
const NUMBER_OF_ALIVE_NEIGHBOURS_REQUIRED_TO_GET_LIFE = 3

export class GameRunner {
    public grid: Grid

    private _dimensions: GridDimensions
    private _config = { updateInterval: 500 }

    private _intervalRef: number
    private _hasStarted = false

    private _onCellChange: (row: number, column: number, isAlive: boolean) => void
    public set onCellChange(onCellChange: (row: number, column: number, isAlive: boolean) => void) {
        this._onCellChange = onCellChange
        if(this.grid) {
            this.grid.onCellChange = this._onCellChange
        }
    }

    private get _isRunning(): boolean {
        return this._intervalRef == null
    }

    private get _isStopped(): boolean {
        return !this._isRunning
    }

    public createNewGrid(dimensions: GridDimensions) {
        this._dimensions = dimensions
        this.grid = new Grid(this._dimensions)
        this.grid.onCellChange = this._onCellChange
    }

    public giveLifeToCell(position: GridPosition) {
        if(this._hasStarted) {
            return
        }
        
        this.grid.giveLifeToCell(position)
    }

    public killCell(position: GridPosition) {
        if(this._hasStarted) {
            return
        }

        this.grid.killCell(position)
    }

    public run(config?: { updateInterval: number }) {
        if(!this.grid) {
            console.error('A new grid must be created first with the createNewGrid method')
            return
        }

        if(this._isRunning) {
            return
        }

        if(config) {
            this._config = config
        }

        this._hasStarted = true
        this._runTurn()
        this._intervalRef = setInterval(this._runTurn.bind(this), this._config.updateInterval)
    }

    public pause() {
        if(this._isStopped) {
            return
        }

        clearInterval(this._intervalRef)
        this._intervalRef = undefined
    }

    public stop() {
        this.pause()
        this._hasStarted = false
        this.grid = new Grid(this._dimensions)
    }

    private _runTurn() {
        const aliveCellsPositions = this.grid.aliveCellsPositions
        const deadCellToAliveNeighbourMap: Map<GridPosition, number> = new Map()
        const cellsToKillPositions: GridPosition[] = []

        aliveCellsPositions
            .forEach(cellPosition => {
                let aliveNeighboursCount = 0
                
                this.grid
                    .getNeighboursPositions(cellPosition)
                    .forEach(neighbourPosition => {
                        if(this.grid.isAlive(neighbourPosition)) {
                            aliveNeighboursCount++
                            return
                        } 
                        
                        if(deadCellToAliveNeighbourMap.has(neighbourPosition)) {
                            deadCellToAliveNeighbourMap.set(neighbourPosition, deadCellToAliveNeighbourMap.get(neighbourPosition) + 1) 
                        } else {
                            deadCellToAliveNeighbourMap.set(neighbourPosition, 1)
                        }
                    })

                if(!NUMBERS_OF_ALIVE_NEIGHBOURS_REQUIRED_TO_SURVIVE.includes(aliveNeighboursCount)) {
                    cellsToKillPositions.push(cellPosition)
                }
            })
        
        cellsToKillPositions
            .forEach(position => this.grid.killCell(position))
        deadCellToAliveNeighbourMap
            .forEach((count, position) => {
                if(count === NUMBER_OF_ALIVE_NEIGHBOURS_REQUIRED_TO_GET_LIFE) {
                    this.grid.giveLifeToCell(position)
                }
            })
    }
}