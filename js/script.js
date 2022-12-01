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
 * @param {*} max max range is inclusive
 * @returns random number between min and max 
 */
function getRandomInclusive(min = 0, max){
    return Math.floor(Math.random() * (max - min + 1) + min);;
}

/**
 * 
 * @param {*} nBombs number of bombs to generate
 * @param {*} nCells number of cells to randomly plant nBombs into
 */
function generateBombsPosition(nBombs, collectionLength){
    const bombPositons = [];
    while(bombPositons.length < nBombs){
        let randomIndex = getRandomInclusive(0, collectionLength);
        if(!bombPositons.includes(randomIndex)){
            bombPositons.push(randomIndex);
        }
    }
    console.log(bombPositons);
    return bombPositons;
}

function gameOver(gameScoreDOM, score){
    gameScoreDOM.innerHTML = score;
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
    //restart game
    obj.innerHTML = '';
    let score = 0;
    const point = 100;
    gameScoreDOM.innerHTML = score;
    
    //create and append the field
    const gameFieldDOM = createElement('div', 'd-flex flex-wrap m-auto game-field');
    obj.append(gameFieldDOM);
    
    //generate the bombs positons
    const bombPositions = generateBombsPosition(difficulty, nCells);

    //create the cells
    for (let i = 0; i < nCells; i++) {
        //if is a bomb the class is 'bomb' otherwise is 'blue'
        let classReveal = 'blue';

        //create the cell 
        const cell = createElement('div', 'd-flex text-center cell');
        //append his number positon
        cell.append(createElement('span', 'm-auto', i + 1));
        
        //if is a bomb give it a bomb class
        if(bombPositions.includes(i)){
            //there is a bomb at i position
            classReveal = 'bomb';
        }

        //add a click event to listen once
        cell.addEventListener('click', function(){
            cell.classList.add(classReveal);
            if(classReveal === 'bomb' || score === point * (nCells - difficulty - 1)){
                //you clicked a bomb, game over
                console.log(score);
                gameOver(gameScoreDOM, score);
            }
            else{
                score += point;
                console.log(score);
            }
        }, {once : true});

        //append to the field
        gameFieldDOM.append(cell);
    }
}



//init
const gameDOM= document.getElementById('game');
const playBtn = document.getElementById('play-btn');

//play click
playBtn.addEventListener('click', function(){
    createGame(100, gameDOM, 16);
});


