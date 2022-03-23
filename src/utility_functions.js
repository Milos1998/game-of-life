import {Graphics, Sprite} from 'pixi.js'

const LINE_COLOR= 0xC1C0C1
const LIVE_CELL= 0xEEEE33
const BASE_COLOR= 0xFFFFFF       //color of cell befor adding tint to it
const DEAD_CELL= 0x7D7C7E
const CELL_SIZE= 15             //TODO: have this in setup too, find better way for this const than defining it twice
const COLOR_PAUSE_BUTTON_PAUSE= 0xd62d20
const COLOR_PAUSE_BUTTON_PLAY= 0x0057e7
const BASE_SPEED= 65
const DEFAULT_SPEED_LVL= 1

function createRec(x, y, width, height, tint= DEAD_CELL){
    let rec= new Graphics();
    rec.beginFill(BASE_COLOR)
    rec.tint= tint
    rec.live= false
    rec.lineStyle(1, LINE_COLOR)
    rec.drawRect(0, 0, width, height)
    rec.x= x
    rec.y= y
    rec.endFill()
    return rec
}

function createMatrix(x, y, defaultVal= undefined){
    let arr= Array(x)
    for(let i= 0; i < x; i++){
        arr[i]= Array(y)
        for(let j= 0; j < arr[i].length; j++)
            arr[i][j]= defaultVal
    }

    return arr
}

function setState(rec, isLive){
    rec.live= isLive
    rec.tint= rec.live ? LIVE_CELL : DEAD_CELL
}

function pauseButtonAction(e){
    if(this.liveCells <= 0)
        return
    if(this.paused)
        resumeGame.bind(this)()
    else
        pauseGame.bind(this)()
}

function pauseGame(){
    this.paused= true
    this.pauseButton.tint= COLOR_PAUSE_BUTTON_PAUSE
    this.pauseSprite.alpha= 0
    this.resumeSprite.alpha= 1
}

function resumeGame(){
    this.paused= false
    this.pauseButton.tint= COLOR_PAUSE_BUTTON_PLAY
    this.pauseSprite.alpha= 1
    this.resumeSprite.alpha= 0
}

function nextGeneration(e){
    if(this.paused  &&  this.liveCells > 0)
        this.goToNextGeneration= true

}

function commitGenocide(e){
    if(this.liveCells > 0)
        pauseGame.bind(this)()
    for(let i= 0; i < this.cells.length; i++){
        for(let j= 0; j < this.cells[0].length; j++){
            this.cells[i][j]= false
            setState(this.grid[i][j], false)
        }
    }
    this.liveCells= 0
    this.numberOfGenerations= 0
}

function cellClicked(e){
    let position= e.data.getLocalPosition(e.target)
    let col= Math.floor(position.x/CELL_SIZE)
    let row= Math.floor(position.y/CELL_SIZE)
    this.cells[row][col]= !this.cells[row][col]
    setState(this.grid[row][col], this.cells[row][col])
    this.liveCells+= this.cells[row][col] ? 1 : -1
    if(this.liveCells > this.highestCellCount)
        this.highestCellCount= this.liveCells
}

function insertImage(imageURL){
    let sprite= Sprite.from(imageURL)
    sprite.anchor.set(0.5, 0.5)
    sprite.x= this.width/2
    sprite.y= this.height/2
    this.addChild(sprite)
    return sprite
}

function initSpeedSelector(speedContainer, DATA){
    let speedElements= Array(6)

    let speedElementsY= 2*CELL_SIZE
    let speedElementsX= 0
    for(let i= 0; i < speedElements.length; i++){
        let speedElementsSpacing= i*2*CELL_SIZE
        speedElements[i]= createRec(speedElementsX+speedElementsSpacing, speedElementsY, CELL_SIZE, CELL_SIZE)
        speedElements[i].interactive= true
        speedElements[i].on("pointertap", e => changeSpeed(speedElements, i, DATA))
        speedContainer.addChild(speedElements[i])
    }
    changeSpeed(speedElements, DEFAULT_SPEED_LVL, DATA)
}

function changeSpeed(speedElements, selectedSpeed, DATA){
    for(let i= 0; i < speedElements.length; i++){
        if(i === selectedSpeed){
            setState(speedElements[i], true)
            DATA.speed= BASE_SPEED * i
        }
        else{
            setState(speedElements[i], false)
        }
    }
}


export{
    createRec,
    createMatrix,
    setState,
    pauseGame,
    nextGeneration,
    commitGenocide,
    cellClicked,
    resumeGame,
    pauseButtonAction,
    insertImage,
    initSpeedSelector
}