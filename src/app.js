import { DATA } from "./setup";
import {Ticker} from 'pixi.js'
import { createMatrix, setState } from "./utility_functions";
import { implementFormation } from "./formations";

let previousGen= createMatrix(DATA.cells.length, DATA.cells[0].length, false)

let elapsed= 0

implementFormation(DATA, 'chaos')

const TICKER= Ticker.shared

TICKER.add(gameLoop)
TICKER.start()

//TODO: make gameloop run on lower FPS (current solution is running at 60fps which is inefficient because I need 2 to 20ish fps)
function gameLoop(){
    elapsed+= TICKER.deltaMS
    if(DATA.goToNextGeneration  ||  elapsed > DATA.speed  &&  !DATA.paused){
        DATA.goToNextGeneration= false
        elapsed= 0

        logic()
        //sound()
    }
    render()
}

function logic(){
    for(let i= 0; i < DATA.cells.length; i++){
        for(let j= 0; j < DATA.cells[0].length; j++){
            let num= numberOfLiveNeighbours(DATA.cells, i, j)
            if(num > 3  ||  num < 2){
                previousGen[i][j]= false
                setState(DATA.grid[i][j], false)
            }
            if(num === 3){
                previousGen[i][j]= true
                setState(DATA.grid[i][j], true)
            }
            if(num === 2){
                previousGen[i][j]= DATA.cells[i][j]
                setState(DATA.grid[i][j], DATA.cells[i][j])
            }

            if(previousGen[i][j] !== DATA.cells[i][j]){
                DATA.liveCells+= previousGen[i][j] ? 1 : -1
            }
        }
    }

    if(DATA.liveCells > DATA.highestCellCount)
        DATA.highestCellCount= DATA.liveCells

    let tmp= DATA.cells
    DATA.cells= previousGen
    previousGen= tmp
    
    if(DATA.liveCells === 0){
        DATA.pauseGame()
        DATA.numberOfGenerations= 0
    }
    else{
        DATA.numberOfGenerations++
    }
}

function render(){
    DATA.displayCellCount()
    DATA.displayHighestCellCount()
    DATA.displayNumberOfGenerations()
}


function numberOfLiveNeighbours(cells, i, j){
    //we assume there are more than 9 cells in grid,
    //to save computation time we won't check for exception
    let count= 0;

    let l= j-1 < 0 ? cells[0].length-1 : j-1
    let r= j+1 === cells[0].length ? 0 : j+1
    let t= i-1 < 0 ? cells.length-1 : i-1
    let b= i+1 === cells.length ? 0 : i+1
    if(cells[t][l])
        count++
    if(cells[t][j])
        count++
    if(cells[t][r])
        count++
    if(cells[i][l])
        count++
    if(cells[i][r])
        count++
    if(cells[b][l])
        count++
    if(cells[b][j])
        count++
    if(cells[b][r])
        count++


    return count
}