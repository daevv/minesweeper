//Creating variables
var matrix = []; 
var rows = 16;
var columns = 16;
var field = document.querySelector('.main');

var minesCount = 40;
var minesLocation = []; //array to store mines' id
//number of cells we should open to win
var boxesToCLick = rows*columns-minesCount;


//(I know, it's strange decision but I didn't find
//the way to delete my listener after click)
var gameStart = false; //to keep track of first click on the field

//to keep track of cliking after loosing/winning
var gameOver = false;

let seconds = 1;
var interval = null;
var smile = document.querySelector('.smile');

window.onload = function() {
    createWindow();
}
//functions to create main parts of the field: 
//smile, minesCounter and timer
//-----------------------------
function createSmile() {
    //adding listeners to smile-button
    smile.addEventListener('click', reset); //reseting game
    smile.addEventListener('mousedown', (event) => {
        if (event.button == 0){
            smile.classList.add('smile-pressed')
        }
    }); //keydown
    smile.addEventListener('mouseup', (event) => {
        if (event.button == 0){
            smile.classList.remove('smile-pressed')
        }
    }); //keyup
}

function createCounter() {
    for(let i = 0; i<3; i++) {
        let dig = document.createElement('div');
        dig.classList.add("dig");
        dig.classList.add('d0');
        dig.crossOrigin = 'anonymous';
        document.querySelector(".counter").append(dig);
    }
    document.querySelectorAll('.dig')[1].classList.add('d4');;
}

function createTimer() {
    for(let i = 0; i<3; i++) {
        let dig = document.createElement('div');
        dig.classList.add("num");
        dig.classList.add('d0');
        document.querySelector(".timer").append(dig);
    }
}
//-----------------------------

//counting flags
function counter(decrease) {
    const dozensPrev = Math.trunc(minesCount/10);
    const unitsPrev = minesCount % 10;
    const digits = document.querySelectorAll('.dig');
    if (decrease) {
        minesCount--;
    } else {
        minesCount++;
    }
    //only 40 flags
    if (minesCount < 0) return;
    //getting pic from minesCount
    const dozens = Math.trunc(minesCount/10);
    const units = minesCount % 10;
    digits[1].classList.replace('d' + dozensPrev, 'd' + dozens)
    digits[2].classList.replace('d' + unitsPrev, 'd' + units)
}

//functions to keep track of time
//-------------------------------
function startTimer() {
    if (interval) {
        return;
    }
    interval = setInterval(timer, 1000);
}

function stopTimer(){
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.querySelectorAll('.num').forEach(block => 
        block.src = '/img/digits/0.png')
}
//-------------------------------

//convering time into pic
function getTime(number){
    //don't play too log, it's only 16x16 field
    const numberPrev = number-1;

    const hundredsPrev = Math.trunc(numberPrev/100);
    const dozensPrev = Math.trunc(numberPrev/10) % 10;
    const unitsPrev = numberPrev % 10;

    const hundreds = Math.trunc(number/100);
    const dozens = Math.trunc(number/10) % 10;
    const units = number % 10;
    if (number>999) {
        stopTimer;
        return;
    }
    const digits = document.querySelectorAll('.num');
    digits[0].classList.replace('d' + hundredsPrev, 'd' + hundreds);
    digits[1].classList.replace('d' + dozensPrev, 'd' + dozens)
    digits[2].classList.replace('d' + unitsPrev, 'd' + units);
}
//counting seconds
function timer() {
    getTime(seconds++);
}
//creating gaming window
function createWindow() {
    //adding timer, smile, counter
    createCounter();
    createTimer();
    createSmile();
    //making [][] to store cells(<div>) 
    //and adding them to the field
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let box = document.createElement("div");
            box.classList.add('cell');
            box.id = r.toString() + ":" + c.toString();
            //one-time click listener
            box.addEventListener('click', function handler(event) {
                //checking if it's the first click
                if (gameStart) {
                    return;
                } else {
                    gameStart = true;
                    startGame(event.target);
                }
            })
            document.querySelector(".matrix").append(box);
            row.push(box);
        }
        matrix.push(row);
    }
}

//starting the game after a click
function startGame(el) {
    startTimer();
    setMines(el.id);
    //adding listeners
    document.querySelectorAll('.cell').forEach(box => {
        //regular clicks
        box.addEventListener("click", leftClick);
        box.addEventListener("contextmenu", rightClick);
        //pressing leftClick and changing smile's face
        box.addEventListener('mousedown', (event) => {
            if (event.button == 0  && !gameOver){
                smile.classList.toggle('smile-shocked');
            }
        });
        box.addEventListener('mouseup', (event) => {
            if (event.button == 0 && !gameOver){
                smile.classList.toggle('smile-shocked');
            }
        });
    });
    //making a click to open the fist cell
    el.click();
}

//setting mines on the field
function setMines(firstClick) {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + ":" + c.toString();
        //our fist-clicked cell can't be a mine
        if (!minesLocation.includes(id) && id !== firstClick) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


//listening to the left click
function leftClick() {
    //we can't open cell if it's flagged/questioned or opened
    if (gameOver || this.classList.contains('tile-clicked') 
    || this.classList.contains('flagged') || this.classList.contains('questioned')){
        return;
    }
    let box = this;
    //if our box contains mine - we lose the game
    if (minesLocation.includes(box.id))  {
        box.classList.add('bomb-pressed');;
        gameOver = true;
        showMines(box);
        return;
    }
    //we should check near cells to open them or not
    var coordinates = box.id.split(":");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    checkMine(r, c);
}

//listening to the right click
function rightClick(event) {
    event.preventDefault();
    //we can't click after we winned or lost
    if (gameOver || this.classList.contains('tile-clicked')){
        return;
    }
    //changing flag/question/closed
    let boxVisual = this.classList;
    if(boxVisual.contains('flagged')) {
        boxVisual.remove('flagged');
        boxVisual.add('questioned');
        counter(false);
    } else if (boxVisual.contains('questioned')) {
        boxVisual.remove('questioned');
    } else {
        boxVisual.add('flagged');
        counter(true);
    }
}

function isMine(r,c) {
    if (minesLocation.includes(r + ":" + c)) {
        return 1;
    }
    return 0;
}

function checkMine(r, c) {
    //in case current cell was opened or doesn't exist
    if (r < 0 || 
        r >= rows || 
        c < 0 || 
        c >= columns || 
        matrix[r][c].classList.contains("tile-clicked")) {
        return;
    }
    matrix[r][c].classList.add("tile-clicked");
    boxesToCLick--;

    let minesFound = 0;

    minesFound += isMine(r-1, c-1);      //top left
    minesFound += isMine(r-1, c);        //top 
    minesFound += isMine(r-1, c+1);      //top right
    minesFound += isMine(r, c-1);        //left
    minesFound += isMine(r, c+1);        //right
    minesFound += isMine(r+1, c-1);      //bottom left
    minesFound += isMine(r+1, c);        //bottom 
    minesFound += isMine(r+1, c+1);      //bottom right
    //opening not empty field
    if (minesFound > 0) {
        matrix[r][c].innerText = '';
        matrix[r][c].classList.add("x" + minesFound.toString());
    }
    //opening empty field
    else {
        checkMine(r-1, c-1);    //top left
        checkMine(r-1, c);      //top
        checkMine(r-1, c+1);    //top 
        checkMine(r, c-1);      //left
        checkMine(r, c+1);      //right
        checkMine(r+1, c-1);    //bottom left
        checkMine(r+1, c);      //bottom
        checkMine(r+1, c+1);    //bottom right
    }
    //checking the win
    if (boxesToCLick == 0) {
        stopTimer();
        document.querySelectorAll(".dig").forEach(dig => 
            dig.src = '/img/digits/0.png');
            gameOver = true;
            smile.classList.add('smile-cool');
    }
}

//if we failed:
function showMines(pressed) {
    stopTimer();
    smile.classList.add('smile-sad');
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let box = matrix[r][c];
            if ( pressed == box) continue;
            if (box.classList.contains('questioned')) {
                continue;                
            } else if (box.classList.contains('flagged')) {
                if (!minesLocation.includes(box.id)) {
                    box.classList.add('not-a-bomb');
                }
                continue;
            } else if (minesLocation.includes(box.id)) {
                box.classList.add('bomb');
            }
        }
    }
}

function reset () {
    //renewing vars
    matrix = [];
    minesCount = 40;
    minesLocation = [];
    boxesToCLick = rows*columns-minesCount;
    seconds = 1;
    gameStart = false;
    gameOver = false;
    //cleaning the field
    document.querySelector(".matrix").innerHTML='';
    document.querySelector(".counter").innerHTML='';
    document.querySelector(".timer").innerHTML='';
    smile.classList.toggle('smile-sad', false);
    smile.classList.toggle('smile-cool',false);

    resetTimer();
    createWindow();
}