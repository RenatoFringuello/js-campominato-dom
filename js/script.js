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
    return bombPositons;
}

/**
 * 
 * @param {*} nCells number of cell to create, must be the pow of a number
 * @param {*} obj parent to create gamefield into
 */
function createGame(nCells, obj){
    obj.innerHTML = '';
    const gameField = createElement('div', 'd-flex flex-wrap m-auto game-field');
    obj.append(gameField);

    const bombPositions = generateBombsPosition(16, nCells);

    for (let i = 0; i < nCells; i++) {
        let classReveal = 'blue';//if is a bomb the class is 'bomb' otherwise is 'blue'
        const cell = createElement('div', 'd-flex text-center cell');
        cell.append(createElement('span', 'm-auto', i + 1));
        
        if(bombPositions.includes(i)){
            //there is a bomb at i position
            classReveal = 'bomb';
        }

        cell.addEventListener('click', function(){
            cell.classList.add(classReveal);
            if(classReveal === 'bomb'){
                alert('game over');
            }
        },{once : true});

        gameField.append(cell);
    }
}



//init
const game = document.getElementById('game');
const playBtn = document.getElementById('play-btn');

//play click
playBtn.addEventListener('click', function(){
    createGame(100, game);
});


