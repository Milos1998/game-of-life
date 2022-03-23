import { Application, BitmapText, Container, BitmapFont } from 'pixi.js'
import { createMatrix, createRec, pauseGame, nextGeneration, commitGenocide, cellClicked, pauseButtonAction, insertImage, initSpeedSelector} from './utility_functions'

const BACKGROUND_COLOR= 0x262339
const CELL_SIZE= 15
const GRID_CONTAINER_MARGIN= 6*CELL_SIZE
const MAP_HEIGHT= Math.floor((window.innerHeight - 2*GRID_CONTAINER_MARGIN)/CELL_SIZE)        //expressed in number of cells
const MAP_WIDTH= Math.floor((window.innerWidth - 2*GRID_CONTAINER_MARGIN)/CELL_SIZE)          //expressed in number of cells
const DATA= {}
const BUTTONS_Y= MAP_HEIGHT*CELL_SIZE + GRID_CONTAINER_MARGIN*1.2
const BUTTONS_HEIGHT= GRID_CONTAINER_MARGIN*0.6
const BUTTONS_WIDTH= CELL_SIZE*7
const PAUSE_BUTTON_X= 1/3*window.innerWidth - BUTTONS_WIDTH/2
const NEXT_GENERATION_BUTTON_X= 2/3*window.innerWidth - BUTTONS_WIDTH/2
const GENOCIDE_BUTTON_X= 1/2*window.innerWidth - BUTTONS_WIDTH/2
const INFO_BUTTON_SIZE= 50
const INFO_BUTTON_X= GRID_CONTAINER_MARGIN + MAP_WIDTH*CELL_SIZE - INFO_BUTTON_SIZE/2
const INFO_BUTTON_Y= GRID_CONTAINER_MARGIN/2
const COLOR_PAUSE_BUTTON_PAUSE= 0xd62d20
const COLOR_GENOCIDE_BUTTON= 0xffa700
const COLOR_NEXT_GENERATION_BUTTON= 0xe17400
const TEXT_X= GRID_CONTAINER_MARGIN
const TEXT_PADDING= 7
const CELL_COUNT_TEXT_Y= 0/3*GRID_CONTAINER_MARGIN + TEXT_PADDING
const HIGHEST_CELL_COUNT_TEXT_Y= 1/3*GRID_CONTAINER_MARGIN + TEXT_PADDING
const NUMBER_OF_GENERATIONS_TEXT_Y= 2/3*GRID_CONTAINER_MARGIN + TEXT_PADDING
const BASE_SPEED= 65
const DEFAULT_SPEED= 2*BASE_SPEED

//init app object
const app= new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    backgroundColor: BACKGROUND_COLOR,
    view: document.getElementById("pixi-canvas"),
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});



//init interactive objects
//map objects
const gridContainer= new Container()
gridContainer.x= GRID_CONTAINER_MARGIN
gridContainer.y= GRID_CONTAINER_MARGIN
gridContainer.interactive= true
DATA.liveCells= 0
//setup listener for user input on map
gridContainer.on('pointerup', cellClicked.bind(DATA))
DATA.grid= createMatrix(MAP_HEIGHT, MAP_WIDTH)
DATA.cells= createMatrix(DATA.grid.length, DATA.grid[0].length, false)
for(let i= 0; i < DATA.grid.length; i++){    //moving along y axis
    for(let j= 0; j < DATA.grid[i].length; j++){     //moving along x axis
        DATA.grid[i][j]= createRec(j*CELL_SIZE, i*CELL_SIZE, CELL_SIZE, CELL_SIZE)
        gridContainer.addChild(DATA.grid[i][j])
    }
}
//TODO: set starting state for game


//pause button
const pauseButton= createRec(PAUSE_BUTTON_X, BUTTONS_Y, BUTTONS_WIDTH, BUTTONS_HEIGHT, COLOR_PAUSE_BUTTON_PAUSE)
pauseButton.buttonMode= true
pauseButton.interactive= true
DATA.paused= true
DATA.pauseGame= pauseGame
pauseButton.on('pointertap', pauseButtonAction.bind(DATA))
DATA.pauseButton= pauseButton
DATA.pauseSprite= insertImage.bind(pauseButton, "./images/pause.png")()
DATA.pauseSprite.alpha= 0
DATA.resumeSprite= insertImage.bind(pauseButton, "./images/play.png")()

//next generation button
const nextGenerationButton= createRec(NEXT_GENERATION_BUTTON_X, BUTTONS_Y, BUTTONS_WIDTH, BUTTONS_HEIGHT, COLOR_NEXT_GENERATION_BUTTON)
nextGenerationButton.buttonMode= true
nextGenerationButton.interactive= true
DATA.goToNextGeneration= false
nextGenerationButton.on('pointertap', nextGeneration.bind(DATA))
insertImage.bind(nextGenerationButton, "./images/next.png")()

//genocide button
const genocideButton= createRec(GENOCIDE_BUTTON_X, BUTTONS_Y, BUTTONS_WIDTH, BUTTONS_HEIGHT, COLOR_GENOCIDE_BUTTON)
genocideButton.buttonMode= true
genocideButton.interactive= true
genocideButton.on('pointertap', commitGenocide.bind(DATA))
insertImage.bind(genocideButton, "./images/trash.png")()

//init text style       //using bitmapText because it is cheaper to update
BitmapFont.from("mono", {
        fill: 0xFFFFFF,
        fontFamily: "\"Courier New\", Courier, monospace",
        fontSize: 20,
        fontWeight: 400
})

const TEXT_STYLE= {
    fontName: "mono"
}

//cell count
const cellCountText= new BitmapText("Cell Count   " + DATA.liveCells, TEXT_STYLE)
cellCountText.x= TEXT_X
cellCountText.y= CELL_COUNT_TEXT_Y
DATA.displayCellCount= function(){
    cellCountText.text= "Cell Count   " + DATA.liveCells
}

//highest Cell count
DATA.highestCellCount= 0
const highestCellCountText= new BitmapText("Highest Cell Count   " + DATA.highestCellCount, TEXT_STYLE)
highestCellCountText.x= TEXT_X
highestCellCountText.y= HIGHEST_CELL_COUNT_TEXT_Y
DATA.displayHighestCellCount= function(){
    highestCellCountText.text= "Highest Cell Count   " + DATA.highestCellCount
}

//generation number
DATA.numberOfGenerations= 0
const numberOfGenerationsText= new BitmapText("Generation Number   " + DATA.numberOfGenerations, TEXT_STYLE)
numberOfGenerationsText.x= TEXT_X
numberOfGenerationsText.y= NUMBER_OF_GENERATIONS_TEXT_Y
DATA.displayNumberOfGenerations= function(){
    numberOfGenerationsText.text= "Generation Number   " + DATA.numberOfGenerations
}

//set speed
DATA.speed= DEFAULT_SPEED
const speedContainer= new Container()
speedContainer.y= BUTTONS_Y
speedContainer.x= GRID_CONTAINER_MARGIN
let speedText= new BitmapText("Speed:", TEXT_STYLE)
speedContainer.addChild(speedText)
initSpeedSelector(speedContainer, DATA)     //TODO: make this better

//info
const infoButton= new Container()
infoButton.x= INFO_BUTTON_X
infoButton.y= INFO_BUTTON_Y
infoButton.width= infoButton.height= INFO_BUTTON_SIZE
infoButton.interactive= true
infoButton.buttonMode= true
infoButton.on('pointertap', e => {
    window.open("https://www.youtube.com/watch?v=R9Plq-D1gEk&ab_channel=Numberphile", "_blank")
})
insertImage.bind(infoButton, "./images/information.png")()



//append all needed objects
app.stage.addChild(gridContainer, pauseButton, nextGenerationButton, genocideButton, infoButton, cellCountText, highestCellCountText, numberOfGenerationsText, speedContainer)
//append pixi canvas to DOM
document.body.appendChild(app.view)



export {
    DATA
}