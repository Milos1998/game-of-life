import { setState } from "./utility_functions"

const GLIDER= [
    [false, true, false],
    [false, false, true],
    [true, true, true]
]

const HEX= [
    [false, true, false],
    [true, false, true],
    [true, false, true],
    [false, true, false]
]

const PRE_CHAOS= [
    [false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, true, true, false, false, false, false, false, false, false, true, true, false],
    [true, false, false, true, false, false, false, false, false, true, false, false, true],
    [false, true, true, false, false, false, false, false, false, false, true, true, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, false, false, false, false, false],
]

const CHAOS= [
    [false, false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, false, false, false, false, false, false, false, true, true, false],
    [true, true, false, false, true, false, false, false, false, false, true, false, false, true],
    [false, false, true, true, false, false, false, false, false, false, false, true, true, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, true, false, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, true, false, true, false, false, false, false, false],
    [false, false, false, false, false, false, false, true, false, false, false, false, false, false],
]

function implementFormation(DATA, formationName){
    let formation
    if(formationName === 'glider')
        formation= GLIDER
    else if(formationName === 'hex')
        formation= HEX
    else if(formationName === 'pre chaos')
        formation= PRE_CHAOS
    else if(formationName === 'chaos')
        formation= CHAOS
    else{
        alert('unknown formation name')
        return
    }

    if(formation.length > DATA.cells.length){
        alert('Map is too small for this formation')
        return
    }

    let startRowInd= Math.floor((DATA.cells.length-formation.length)/2)
    let endRowInd= startRowInd + formation.length
    let startColInd= Math.floor((DATA.cells[0].length-formation[0].length)/2)
    let endColInd= startColInd + formation[0].length

    for(let iData= startRowInd, iFormation= 0; iData < endRowInd; iData++, iFormation++){
        for(let jData= startColInd, jFormation= 0; jData < endColInd; jData++, jFormation++){
            DATA.cells[iData][jData]= formation[iFormation][jFormation]
            setState(DATA.grid[iData][jData], formation[iFormation][jFormation])
            if(formation[iFormation][jFormation]){
                DATA.liveCells++
                DATA.highestCellCount++
            }
        }
    }
}

export{
    implementFormation
}