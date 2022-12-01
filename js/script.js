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
    console.log(bombPositons);
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
    
    //remove click event from cells;
    //can be cancelled, beacuse the overlay unable the user to click the cells
    
    // for (let i = 0; i < gameFieldDOM.childNodes.length; i++) {
    //     //clone and replace all child to override their click event listener
    //     const cellClone = gameFieldDOM.childNodes[i].cloneNode(true);
    //     gameFieldDOM.replaceChild(cellClone, gameFieldDOM.childNodes[i]);
    // }
}

function getBombAround(cellPos, bombsPosition){
    let nBombAround = 0;

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
    let score = 0;
    let message = 'You Win';
    const point = 100;
    gameScoreDOM.innerHTML = score;
    gameOverlayDOM.classList.replace('d-flex', 'd-none');
    
    //create and append the field
    const gameFieldDOM = createElement('div', 'd-flex flex-wrap m-auto game-field');
    obj.append(gameFieldDOM);
    
    //generate the bombs positons
    const bombsPositions = generateBombsPositions(difficulty, nCells);

    //create the cells
    for (let i = 0; i < nCells; i++) {
        //if is a bomb the class is 'bomb' otherwise is 'blue'
        let classReveal = 'blue';

        //create the cell 
        const cell = createElement('div', 'd-flex text-center cell');
        //append his number positon
        cell.append(createElement('span', 'm-auto', i + 1));
        
        //if is a bomb give it a bomb class
        if(bombsPositions.includes(i)){
            //there is a bomb at i position
            classReveal = 'bomb';
        }

        //add a click event to listen once
        cell.addEventListener('click', function(){
            cell.classList.add(classReveal);
            score += point;
            if(classReveal === 'bomb' || score === point * (nCells - difficulty)){
                //if bomb clicked
                score -= (classReveal === 'bomb') ? point : 0;
                message = (classReveal === 'bomb') ? 'You Lose' : message;
                //end of the match
                gameOver(gameScoreDOM, score, gameOverlayDOM, message, gameFieldDOM);
            }
        }, {once : true});

        //append to the field
        gameFieldDOM.append(cell);
    }
}

//init
const gameDOM= document.getElementById('game');
const playhBtn = document.getElementById('play-btn');
const diffSelect = document.getElementById('difficulty');

//match click
playhBtn.addEventListener('click', function(){
    createGame(100, gameDOM, parseInt(diffSelect.value) * 8);
});