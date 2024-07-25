const fs = require('fs');
const ntn = require('./ntn');
const b1 = require('./ntn');
const filePath = './scripts/indexdata.js';

(function () {
    "use strict";

    var indexData = {};

    var updateIndex = (word, index) => {
       
        // Loop through the word, extracting substrings from the start to each character
        for (let i = 1; i <= word.length; i++) {
            var subWord = word.substring(0, i);
            if(indexData[subWord] && !indexData[subWord].includes(index)){
                indexData[subWord].push(index);
            }
            else{
                indexData[subWord] = [index];
            }
        }
    }

    var list = ntn.concat(b1);
    for(var i=0; i<list.length; i++){
        var bhajan = list[i];
        var words = bhajan.eng.split(' ');
        for(var j=0; j<words.length; j++){
            var word = words[j];
            updateIndex(word, i);
        }
    }

    var indexDataStr = "indexData=" + JSON.stringify(indexData, null, 2);
    //console.log("indexData="+ indexDataStr);

    fs.writeFile(filePath, indexDataStr, 'utf8', (err) => {
        if (err) throw err;
        console.log(`File updated with new index data: ${filePath}`);
      });

} )();  
