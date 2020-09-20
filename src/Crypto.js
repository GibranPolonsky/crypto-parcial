import * as  math from 'mathjs';
const alphabet = "abcdefghijklmnopqrstuvwxyz ";

export const toMatrix = (text = "") => {
    let result = [];
    let column = [];

    [...text.trim()].forEach(x => {
        const position = alphabet.indexOf(x.toLowerCase()) + 1;
        if(column.length >= 3){
            result = [...result, column];
            column = [];
        }
        column = [...column, position];
    });
    if(column.length > 0 ){
        result = [...result, fillMissingColumn(column) ];
    }
    return math.matrix( flipMatrix(result) );
}

export const encrypt = (text = "", secret=[]) => {
    try{
        let matrix1 =  toMatrix(text);
        let matrixSecret = math.matrix(secret);

        const result = math.multiply(matrixSecret._data, matrix1._data);
        return JSON.stringify(result);
    }catch(e){
        alert(e.message);
    }
    
}

export const decrypt = (criptedJson = "[]", secret = []) => {
    try{
        const matrix1 = math.matrix( JSON.parse(criptedJson));
        const matrixSecret = math.inv(math.matrix(secret));
        const result = math.multiply(matrixSecret._data, matrix1._data);
        return flipMatrix(result).map(x => {
        return x.map(y => alphabet[Math.round(y) - 1].toUpperCase()).join('');
        }).join("");
    }catch(e){
        alert(e.message);
    }
}

export const encryptCajas = (text = "", secret = "") => {
    const result = {};
    let secretCount = 0; 
    [...text.replaceAll(' ', '')].forEach(x => {
        if(secretCount >= secret.length){
            secretCount = 0;
        }
        const secretIndex = [...secret][secretCount];
        result[secretIndex + secretCount] = result[secretIndex + secretCount] || [];
        result[secretIndex + secretCount] = [...result[secretIndex + secretCount], x];
        secretCount++;
    });
    return Object.keys(result).sort(sortAlphabetically).map(x => {
        return result[x].join('');
    }).join(" ");
}

export const decryptCajas = (text = "", secret = "") => {
    const normalizedSecret = [...secret].map((x, index) => x.toString() + index.toString());
    let finalResult = "";
    const decrypedObject = {};
    [...normalizedSecret].sort(sortAlphabetically).forEach((x, index) => {
        decrypedObject[x] = text.split(" ")[index];
    });
    const resultRaw = [...normalizedSecret].map((x, index) => {
        return decrypedObject[x];
    });
    const maxIterator = resultRaw[0].length;
    for(let i = 0; i < maxIterator; i++) {
        for(let j = 0; j <  resultRaw.length; j++){
            resultRaw[j] = resultRaw[j] || [];
            finalResult = finalResult + ([...resultRaw[j]][i] || "");
        }
    }
    return finalResult;
}

const sortAlphabetically = (a, b) => {
    if (a > b) {
        return 1;
    }
    if (b > a) {
        return -1;
    }
    return 0;
}


const fillMissingColumn = (array = []) => {
    const maxValue = 3;
    let result = [...array];
    for(let i = 0; i < maxValue - array.length; i++){
        result = [...result, alphabet.indexOf(" ") + 1];
    }
    return result;
}

const flipMatrix = ( array = []) => {
    const resultRows = array[0].length;
    const resultColumns = array.length;
    let result = [];
    for(let i = 0; i < resultRows; i++){
        let row = [];
        for(let j = 0; j < resultColumns; j++){
          row = [...row, array[j][i]];
        }
        result = [...result, row];
    }
    return result;
}