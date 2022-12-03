/**
 * 
 * @param {*} tagName the tag to add in html
 * @param {*} className the class of the tag; you can write a class list like in html
 * @param {*} content the content of the tag to append into
 * @returns the element 
 */
function createElement(tagName, className = '', content = ''){
    const element = document.createElement(tagName);
    element.className = className;
    element.append(content);
    return element;
}

/**
 * 
 * @param {*} min min range is inclusive
 * @param {*} max max range is exclusive
 * @returns random number between min and max -1
 */
function getRandom(min = 0, max){
    return Math.floor(Math.random() * (max - min) + min);;
}

/**
 * 
 * @param {*} nBombs number of bombs to generate
 * @param {*} nCells number of cells to randomly plant nBombs into
 */
function generateBombsPositions(nBombs, collectionLength){
    const bombPositons = [];
    while(bombPositons.length < nBombs){
        let randomIndex = getRandom(0, collectionLength);
        if(!bombPositons.includes(randomIndex)){
            bombPositons.push(randomIndex);
        }
    }
    return bombPositons;
}

/**
 * 
 * @param {*} gameOverlayDOM the DOM to display the message
 * @param {*} message get the message : 'You Win' | 'You Lose'
 * @param {*} gameFieldDOM the parent of the cells; to get the cells to clone and replace
 */
function gameOver(gameOverlayDOM, message, gameFieldDOM){
    gameOverlayDOM.childNodes[1].innerHTML = message;
    //display overlay
    gameOverlayDOM.classList.replace('d-none', 'd-flex');
    //show all bombs
    for(let i = 0; i < gameFieldDOM.childNodes.length -1; i++){
        gameFieldDOM.childNodes[i+1].childNodes[1].classList.remove('d-none');
        if(gameFieldDOM.childNodes[i+1].childNodes[1].innerHTML === ''){
            gameFieldDOM.childNodes[i+1].classList.add('bomb');
        }
    } 
}

/**
 * 
 * @param {*} cellPos the position of the cell we are in going to check
 * @param {*} bombsPosition the list of all bombs position
 * @param {*} nCellsPerRow the number of cells in a row
 * @returns the number of bombs around to the ray of one cell
 */
function getNBombAround(cellPos, bombsPosition, nCellsPerRow){
    let nBombAround = 0;

    if (!bombsPosition.includes(cellPos)){
        //right
        if(bombsPosition.includes(cellPos + 1)){
            //the bomb is on my right
            nBombAround += ((cellPos + 1) % nCellsPerRow === 0)? 0 : 1;
        }
        if(bombsPosition.includes(cellPos - (nCellsPerRow - 1))){
            //the bomb is on my top-right
            nBombAround += ((cellPos + 1) % nCellsPerRow === 0)? 0 : 1;
        }
        if(bombsPosition.includes(cellPos + (nCellsPerRow + 1))){
            //the bomb is on my bottom-right
            nBombAround += ((cellPos + 1) % nCellsPerRow === 0)? 0 : 1;
        }
        //left
        if(bombsPosition.includes(cellPos - 1)){
            //the bomb is on my left
            nBombAround += (cellPos % nCellsPerRow === 0)? 0 : 1;
        }  
        if(bombsPosition.includes(cellPos - (nCellsPerRow + 1))){
            //the bomb is on my top-left
            nBombAround += (cellPos % nCellsPerRow === 0)? 0 : 1;
        }  
        if(bombsPosition.includes(cellPos + (nCellsPerRow - 1))){
            //the bomb is on my bottom-left
            nBombAround += (cellPos % nCellsPerRow === 0)? 0 : 1;
        }  
        //top-bottom
        if(bombsPosition.includes(cellPos + nCellsPerRow)){
            //the bomb is on my bottom
            nBombAround ++;
        }
        if(bombsPosition.includes(cellPos - nCellsPerRow)){
            //the bomb is on my top
            nBombAround ++;
        }
    }
    else{
        nBombAround = '';
    }

    return nBombAround;
}

/**
 * 
 * @param {*} nCells number of cell to create, must be the pow of a number
 * @param {*} difficulty nBomb; must be smaller than nCells
 */
function createGame(nCells, difficulty){
    const gameDOM= document.getElementById('game');
    //get the score dom
    const gameScoreDOM = document.getElementById('score');
    //get the message dom
    const gameOverlayDOM = document.getElementById('overlay');
    //restart game
    gameDOM.innerHTML = '';
    let scoreN = 0;
    let message = 'You Win';
    let isGameOver = false;
    const point = 100;
    gameScoreDOM.innerHTML = scoreN;
    gameOverlayDOM.classList.replace('d-flex', 'd-none');
    
    //create and append the field
    const gameFieldDOM = createElement('div', 'd-flex flex-wrap m-auto game-field');
    gameDOM.append(gameFieldDOM);
    
    //generate the bombs positons
    const bombsPositions = generateBombsPositions(difficulty, nCells);

    //create the cells
    for (let i = 0; i < nCells; i++) {
        //if is a bomb the class is 'bomb' otherwise is 'blue'
        let classReveal = 'safe';

        //create the cell 
        const cell = createElement('div', 'd-flex text-center cell');
        cell.style.width = cell.style.height = 'calc(100% / ' + Math.sqrt(nCells) + ')';
        //append his number positon
        cell.append(createElement('span', 'm-auto d-none', getNBombAround(i, bombsPositions, Math.sqrt(nCells))));
        
        //if is a bomb give it a bomb class
        if(bombsPositions.includes(i)){
            //there is a bomb at i position
            classReveal = 'bomb';
        }

        //add a click event to listen once
        cell.addEventListener('click', function handler(e){
            if(!isGameOver){
                if(!isFlagMode){
                    //click senza flag mode
                    if(this.classList[this.classList.length-1] !== 'flag'){
                        //se la cella non è un flag

                        //reveal cell
                        this.classList.add(classReveal);
                        this.childNodes[1].classList.remove('d-none');
                        //get point
                        scoreN += point;
                        
                        if(classReveal === 'bomb' || scoreN === point * (nCells - difficulty)){
                            //if bomb clicked or if win
                            //if loose
                            scoreN -= (classReveal === 'bomb') ? point : 0;
                            message = (classReveal === 'bomb') ? 'You Lose' : message;
                            //end of the match
                            isGameOver = true;
                            gameOver(gameOverlayDOM, message, gameFieldDOM);
                        }
                        //display score and message
                        gameScoreDOM.innerHTML = scoreN;
                        this.removeEventListener('click', handler);
                    }
                }
                else {
                    //se clicchi in FlagMode
                    this.classList.toggle('flag');
                }
            }
        });

        //append to the field
        gameFieldDOM.append(cell);
    }
}

//init
const playBtn = document.getElementById('play-btn');
const numOfCellsDOM = document.getElementById('n-cells');
const diffSelectDOM = document.getElementById('difficulty');
//get the flag mode dom
const gameFlagModeDOM = document.getElementById('flag-mode');
let isFlagMode ;

//play click
playBtn.addEventListener('click', function(){
    //get the number of cells
    const numOfCells = Math.pow(parseInt(numOfCellsDOM.value, 10), 2);
    isFlagMode = false;
    gameFlagModeDOM.innerHTML = 'off';
    gameFlagModeDOM.classList.remove('on');
    createGame(numOfCells, Math.floor((parseInt(diffSelectDOM.value, 10) / 10) * numOfCells));
});

//keydown
document.addEventListener('keydown', function(e){
    switch (e.code) {
        case 'KeyR':
            //get the number of cells
            const numOfCells = Math.pow(parseInt(numOfCellsDOM.value, 10), 2);
            isFlagMode = false;
            gameFlagModeDOM.innerHTML = 'off';
            gameFlagModeDOM.classList.remove('on');
            createGame(numOfCells, Math.floor((parseInt(diffSelectDOM.value, 10) / 10) * numOfCells));
            break;
        case 'KeyF':
            //toggle sul FlagMode
            isFlagMode = !isFlagMode;
            //get the flag mode dom
            gameFlagModeDOM.innerHTML = (isFlagMode)? 'on' : 'off';
            gameFlagModeDOM.classList.toggle('on');
            break;
    
        default:
            break;
    }
});