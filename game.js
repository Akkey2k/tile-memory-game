const $menu = document.querySelector("#menu");
const $game = document.querySelector("#root");

const $complexities = document.querySelectorAll(".complexity-lvl");

$complexities.forEach((comp) => {
    comp.addEventListener("click", () => chooseComplexity(Number(comp.dataset.complexity)))
});


/**
 * Запускает генерацию игры с выбранной сложностью
 *
 * @param {Number} complexity
 */
function chooseComplexity(complexity) {
    this.complexity = complexity;
    initGame(complexity);
}


/**
 * Мешает массив плиток
 *
 * @param {Array.<Number>} array
 */
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


/**
 * Генерирует двумерный массив на основе выбранной сложности и запускает отрисовку игрового поля
 *
 * @param {Number} complexity
 */
function initGame(complexity) {
    let tilesViewCount = (complexity * (complexity/2));

    let tiles = [];

    for (let i = 1; i < tilesViewCount + 1; i++){
        tiles.push(i);
        tiles.push(i);
    }

    shuffle(tiles)

    let matrix = [];

    let index = 0;

    for (let i = 0; i < complexity; i++){
        matrix[i] = [];
        for (let j = 0; j < complexity; j++){
            matrix[i][j] = tiles[index];
            index++;
        }
    }

    drawGame(matrix)
}


/**
 * Массив иконок для плиток
 *
 * @type {string[]}
 */
iconIndex = [
    "",
    "fa fa-skating",
    "fa fa-acorn",
    "fa fa-alarm-clock",
    "fa fa-alicorn",
    "fa fa-atom",
    "fa fa-axe",
    "fa fa-apple-alt",
    "fa fa-basketball-ball",
    "fa fa-bat",
    "fa fa-compass",
    "fa fa-comments",
    "fa fa-anchor",
    "fa fa-award",
    "fa fa-backpack",
    "fa fa-bacon",
    "fa fa-baseball",
    "fa fa-bell",
    "fa fa-bomb"
]


/**
 * Рисует игровое поле на основе сгенерированного двумерного массива
 *
 * @param {Array.<Array.<Number>>} matrix
 */
function drawGame(matrix) {
    $menu.style.display = "none";

    $game.innerHTML = "";
    const size = 50;
    const sizeText = 50 + "px";
    $game.style.width = (matrix.length * size) + matrix.length * 10 + "px";

    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < matrix.length; j++){
            $game.insertAdjacentHTML("beforeend", `
                <div onclick="chooseTile(${matrix[i][j]},${i},${j})" style="width: ${sizeText}; height: ${sizeText}" data-tilePosition=${i + "" +j} class="tile">
                    <div class="front"></div>
                    <div class="back">
                        <span class="${this.iconIndex[matrix[i][j]]}"></span>
                    </div>
                </div>
            `);
        }
    }
}


/**
 * Обрабатывает клик по плитке
 *
 * @param {Number} val  Значение плитки
 * @param {Number} i    Позиция ряда
 * @param {Number} j    Позицтя колонки
 */
function chooseTile(val, i, j) {
    this.values = this.values ? this.values : {};

    const currentPos = i + "" + j;

    // Клик по одной и той же ячейке
    if(this.values[currentPos]){
        disableTileByPosition(currentPos);
        this.values = {};
        return;
    }

    this.values[currentPos] = val;

    activateTileByPosition(currentPos);

    if(Object.keys(this.values).length === 2){
        let firstPos = Object.keys(this.values)[0];
        let firstVal = this.values[firstPos];
        let secondPos = Object.keys(this.values)[1];
        let secondVal = this.values[secondPos];


        if(firstVal === secondVal){
            this.values = {};
        } else{
            window.setTimeout(function () {
                disableTileByPosition(firstPos);
                disableTileByPosition(secondPos);
            }, 500)

            this.values = {};
        }
    }
}


/**
 * Переворачивает плитки, запускает проверку на конец игры
 *
 * @param {Number} pos  Позиция плитки
 */
function activateTileByPosition(pos){
    const $tiles = $game.querySelectorAll(".tile");

    $tiles.forEach(tile => {
        if(tile.dataset.tileposition === pos){
            tile.classList.add("tile_found")
        }
    })

    let foundTilesCount = 0;

    $tiles.forEach(tile =>{
        if(tile.classList.contains("tile_found")){
            foundTilesCount++
        }
    });

    checkGameOver($tiles.length, foundTilesCount);
}


/**
 * Переворачивает плитку обратно
 *
 * @param {Number} pos  Позиция плитки
 */
function disableTileByPosition(pos) {
    const $tiles = $game.querySelectorAll(".tile");

    $tiles.forEach(tile => {
        if(tile.dataset.tileposition === pos){
            tile.classList.remove("tile_found")
        }
    })
}


/**
 * Проверяет - если все плитки перевернуты (угаданы), то рисует диалоговое окно и меню
 *
 * @param {Number} allTiles     Кол-во всех плиток
 * @param {Number} foundTiles   Кол-во угаданных плиток
 */
function checkGameOver(allTiles, foundTiles) {
    if(allTiles === foundTiles){
        window.setTimeout(function () {
            showMenu();

            $game.insertAdjacentHTML("afterbegin", `
                <div class="game-over">
                    <button onclick="initGame(${this.complexity})"><span class="fa fa-redo"></span>Заново</button>
                </div>
            `);
        }.bind(this), 500)
    }
}


/**
 * Показывает (Меню) те блоки выбора сложности, которые не равны выбранной в данный момент
 */
function showMenu(){
    $menu.style.width = $game.style.width;
    $menu.style.display = "flex";
    $menu.querySelectorAll(".complexity-lvl").forEach(comp =>{
        if(comp.dataset.complexity !== this.complexity){
            comp.style.display = "flex"
        } else {
            comp.style.display = "none"
        }
    });
}