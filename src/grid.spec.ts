import "mocha"
import { expect } from "chai"

import { Grid, GridDimensions } from "./grid"

let sut: Grid, dimensions: GridDimensions

describe('Class: Grid', () => {
    beforeEach(() => {
        dimensions = {
            height: 5,
            width: 5
        }

        sut = new Grid(dimensions)
    })

    describe('Getter: aliveCellsPositions', () => {
        it('Should return the position of the alive cells', () => {
            sut.giveLifeToCell({ column: 1, row: 1 })
            expect(sut.aliveCellsPositions).to.deep.equal([{ column: 1, row: 1 }])
        })
    })

    describe('Method: getNeighboursPositions', () => {
        it('Should return the neighbours', () => {
            expect(sut.getNeighboursPositions({ column: 1, row: 1 }))
                .to.deep.equal([
                    { column: 1, row: 2 },
                    { column: 1, row: 0 },
                    { column: 2, row: 1 },
                    { column: 0, row: 1 },
                ])
            
            expect(sut.getNeighboursPositions({ column: 0, row: 0 }))
                .to.deep.equal([
                    { column: 0, row: 1 },
                    { column: 1, row: 0 },
                ])
        })
    })
})