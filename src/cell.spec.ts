import "mocha"
import { expect } from "chai"

import { Cell } from "./cell"

let sut: Cell

describe('Class: Cell', () => {
    beforeEach(() => {
        sut = new Cell()
    })

    describe('Getter: isAlive', () => {
        it('Should return true if the cell is alive', () => {
            sut.giveLife()
            expect(sut.isAlive).to.be.true
        })

        it('Should return false if the cell is not alive', () => {
            expect(sut.isAlive).to.be.false
        })
    })

    describe('Method: giveLife', () => {
        it('Should give life to the cell', () => {
            sut.giveLife()
            expect(sut.isAlive).to.be.true
        })
    })

    describe('Method: kill', () => {
        it('Should kill the cell', () => {
            sut.kill()
            expect(sut.isAlive).to.be.false
        })
    })
})