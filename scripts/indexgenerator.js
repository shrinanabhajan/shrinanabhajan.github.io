const fs = require('fs');
const ntn = require('./ntn');
const b1 = require('./b1');
const dt = require('./dt');
const filePath = './scripts/indexdata.js';

(function () {
    "use strict";

    var indexData = {};

    var updateIndex = (word, index) => {
        if(word.length > 2) {
            // Loop through the word, extracting substrings from the start to each character
            for (let i = 3; i <= word.length; i++) {
                var subWord = word.substring(0, i);
                if(indexData[subWord])
                {
                    if( !indexData[subWord].includes(index)) {
                        indexData[subWord].push(index);
                    }
                }
                else{
                    indexData[subWord] = [index];
                }
            }
        }
    }

    var list = dt;
    list = list.concat(b1);
    list = list.concat(ntn);
    
    
    //for(let i=0; i<2; i++) {
    for(let i=0; i<list.length; i++) {
        let bhajan = list[i];
        let words = bhajan.eng.split(' ');
            for(let j=0; j<words.length; j++) {
                let word = words[j];
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
