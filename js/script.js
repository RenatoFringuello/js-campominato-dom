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
 * @param {*} gameScoreDOM the DOM to display the score
 * @param {*} score get the score
 * @param {*} gameOverlayDOM the DOM to display the message
 * @param {*} message get the message : 'You Win' | 'You Lose'
 * @param {*} gameFieldDOM the parent of the cells; to get the cells to clone and replace
 */
function gameOver(gameScoreDOM, score, gameOverlayDOM, message, gameFieldDOM){
    //display score and message
    gameScoreDOM.innerHTML = score;
    gameOverlayDOM.childNodes[1].innerHTML = message;
    //display overlay
    gameOverlayDOM.classList.replace('d-none', 'd-flex');
    //show all bombs

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
 * @param {*} obj parent to create gameFieldDOM into
 * @param {*} difficulty nBomb; must be smaller than nCells
 */
function createGame(nCells, obj, difficulty){
    //get the score dom
    const gameScoreDOM = document.getElementById('score');
    //get the message dom
    const gameOverlayDOM = document.getElementById('overlay');
    //restart game
    obj.innerHTML = '';
    let scoreN = 0;
    let message = 'You Win';
    let isGameOver = false;
    const point = 100;
    gameScoreDOM.innerHTML = scoreN;
    gameOverlayDOM.classList.replace('d-flex', 'd-none');
    
    //create and append the field
    const gameFieldDOM = createElement('div', 'd-flex flex-wrap m-auto game-field');
    
    obj.append(gameFieldDOM);
    
    //generate the bombs positons
    const bombsPositions = generateBombsPositions(difficulty, nCells);
    console.log(bombsPositions);

    //create the cells
    for (let i = 0; i < nCells; i++) {
        //if is a bomb the class is 'bomb' otherwise is 'blue'
        let classReveal = 'blue';

        //create the cell 
        const cell = createElement('div', 'd-flex text-center cell');
        cell.style.width = 'calc(100% / ' + Math.sqrt(nCells) + ')';
        cell.style.height = cell.style.width;
        //append his number positon
        cell.append(createElement('span', 'm-auto ', getNBombAround(i, bombsPositions, Math.sqrt(nCells))));
        
        //if is a bomb give it a bomb class
        if(bombsPositions.includes(i)){
            //there is a bomb at i position
            classReveal = 'bomb';
        }

        //add a click event to listen once
        cell.addEventListener('click', function handler(e){
            if(!isGameOver){
                if(e.button === 0 && e.altKey === false){
                    this.classList.add(classReveal);
                    this.childNodes[1].classList.replace('d-none', 'd-inline');
    
                    scoreN += point;
                    if(classReveal === 'bomb' || scoreN === point * (nCells - difficulty)){
                        //if bomb clicked
                        scoreN -= (classReveal === 'bomb') ? point : 0;
                        message = (classReveal === 'bomb') ? 'You Lose' : message;
                        isGameOver = true;
                        //end of the match
                        gameOver(gameScoreDOM, scoreN, gameOverlayDOM, message, gameFieldDOM);
                    }
                    this.removeEventListener('click', handler);
                }
                else {
                    //se clicchi tenendo premuto pure alt o option
                    this.classList.toggle('flag');
                }
            }
        });

        //append to the field
        gameFieldDOM.append(cell);
    }
}

//init
const gameDOM= document.getElementById('game');
const playhBtn = document.getElementById('play-btn');
const numOfCellsDOM = document.getElementById('n-cells');
const diffSelectDOM = document.getElementById('difficulty');

//match click
playhBtn.addEventListener('click', function(){
    //get the number of cells
    const numOfCells = Math.pow(parseInt(numOfCellsDOM.value, 10), 2);

    createGame(numOfCells, gameDOM, Math.floor((parseInt(diffSelectDOM.value, 10) / 10) * numOfCells));
});