let solveBtn = document.querySelector(".solve-btn");
let warningEle = document.querySelector(".warning");
let resetBtn = document.querySelector(".reset-btn");
let sudokuContainer = document.querySelector(".sudoku-container");

// Create suduko board UI
for(let i=0;i<9;i++)
{
    let sudokuInnerContainer = document.createElement("div");
    sudokuInnerContainer.classList.add("sudoku-innerbox");

    for(let j=0;j<9;j++)
    {
        let sudokuCell = document.createElement("input");
        sudokuCell.setAttribute("type","text");
        sudokuCell.setAttribute("maxLength","1");
        sudokuCell.classList.add("sudoku-cell");
        sudokuInnerContainer.appendChild(sudokuCell);
    }

    sudokuContainer.appendChild(sudokuInnerContainer);    
}

let allSudokuCells = document.querySelectorAll(".sudoku-cell");

let sudokuMatrix = [];

for(let i=0;i<9;i++)
{
    sudokuMatrix[i] = [];
}

let solutionMatrix = [];

// Check if placing current val is valid
function isValid(x,y,num){
    // Row check
    for(let j=0;j<sudokuMatrix[0].length;j++)
    {
        if(sudokuMatrix[x][j] == num)
        {
            return false;
        }
    }

    // Column check
    for(let i=0;i<sudokuMatrix.length;i++)
    {
        if(sudokuMatrix[i][y] == num)
        {
            return false;
        }
    }

    // Submatrix check
    let submatI = Math.floor(x / 3) * 3;
    let submatJ = Math.floor(y / 3) * 3;

    for(let i=0;i<3;i++)
    {
        for(let j=0;j<3;j++)
        {
            if(sudokuMatrix[submatI+i][submatJ+j] == num)
            {
                return false;
            }
        }
    }

    return true;
}

// Solve sudoku using recursion and backtracking
function solveSudoku(i,j){
    if(i == sudokuMatrix.length)
    {
        for(let i=0;i<sudokuMatrix.length;i++)
        {
            solutionMatrix[i] = [...sudokuMatrix[i]];
        }

        return true;
    }

    let ni = 0;
    let nj = 0;

    if(j == sudokuMatrix[0].length-1)
    {
        ni = i+1;
        nj = 0;
    }else{
        ni = i;
        nj = j+1;
    }

    if(sudokuMatrix[i][j] != 0)
    {
        return solveSudoku(ni,nj);
    }else{
        for(let val=1;val<=9;val++)
        {
            if(isValid(i,j,val))
            {
                sudokuMatrix[i][j] = val;
                
                if(solveSudoku(ni,nj))
                {
                    return true;
                }
            }
        }

        sudokuMatrix[i][j] = 0;

        return false;
    }
}

function createMatrix(){
    for(let idx=0;idx<allSudokuCells.length;idx++)
    {
        let spare = idx % 9;

        let iOffset = Math.floor(spare / 3);
        let jOffset = (spare % 3);

        let boxNum = Math.floor(idx/9);

        let iStart = Math.floor(boxNum / 3) * 3;
        let jStart = (boxNum % 3) * 3;

        let iIdx = iStart + iOffset;
        let jIdx = jStart + jOffset;

        let currValue = allSudokuCells[idx].value;
        sudokuMatrix[iIdx][jIdx] = (currValue === "") ? 0 : parseInt(currValue);
    }
}

function fillSudoku(){
    let idx = 0;

    let startI = 0;
    let startJ = 0;

    while(startI <= 6)
    {
        for(let i=startI;i<(startI+3);i++)
        {
            for(let j=startJ;j<(startJ+3);j++)
            {
                let currValue = allSudokuCells[idx].value;

                if(currValue === "")
                {
                    allSudokuCells[idx].classList.add("algo-filled");
                }

                allSudokuCells[idx].value = solutionMatrix[i][j];
                allSudokuCells[idx].setAttribute("disabled","true");
                idx++;
            }
        }

        if(startJ == 6)
        {
            startI += 3;
            startJ = 0;
        }else{
            startJ += 3;
        }
    }
}

function displayWarning(message)
{
    warningEle.innerText = message;
    warningEle.style.display = "block";
}

solveBtn.addEventListener("click",function(e){
    warningEle.style.display = "none";

    let allIntegers = true;

    let numClues = 0;

    allSudokuCells.forEach(cell => {
        if(isNaN(cell.value))
        {
            displayWarning("Invalid Sudoku : All values must be integers");
            allIntegers = false;
            return;
        }

        if(cell.value !== "")
        {
            numClues += 1;
        }
    });

    if(allIntegers)
    {
        if(numClues < 17)
        {
            displayWarning("No unique solution exists");
            return;
        }

        createMatrix();
        solveSudoku(0,0);
        
        if(solutionMatrix.length == 0)
        {
            displayWarning("No unique solution exists");
            return;
        }

        fillSudoku();
        solveBtn.setAttribute("disabled","true");
    }
});

resetBtn.addEventListener("click",function(e){
    allSudokuCells.forEach(cell => {
        warningEle.style.display = "none";
        cell.value = "";
        cell.classList.remove("algo-filled");
        cell.removeAttribute("disabled");
        solveBtn.removeAttribute("disabled");
    });
});