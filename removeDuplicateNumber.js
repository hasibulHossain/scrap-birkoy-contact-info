const fs = require('fs');
const data = require('./data/data.json');


const parseData = JSON.parse(JSON.stringify(data))

// array of name and number obj ex=> {name: 'example', number: 12345}
const processedData = [];

// processing raw data
parseData.forEach(obj => {
   return obj.userNumberList.forEach(item => {
      processedData.push(item)
      return item
   })
})

// Removing duplicating array
function getUnique(arrWithDuplication, key) {

   // store the comparison  values in array
   const unique = arrWithDuplication.map(e => e[key])
      // store the indexes of the unique objects
      .map((e, i, arrWithDuplication) => {
         return arrWithDuplication.indexOf(e) === i && i //indexOf shob shomoi first match er index return kore. ex, jodi kono same value akbar index 2 a thake, abr index 9 a thake, arrWithDuplication.indexOf(value) dile shob shomi index 2 ashbe
      }) // return value => 0, 1, 4, false, 6 (ata exact return value na unique.map er. ai map function theke return value kmon hote pare tar akta idea)

      // eliminate the false indexes & return unique objects
      .filter((e) => { return arrWithDuplication[e] }) //remove false from array. filter shob shomoi false value array theke remove kore dei.
      // return value => 0, 1, 4, 6

      // we get final array without duplication 
      .map(e => { return arrWithDuplication[e] });
      // return value without duplication

   return unique;
}

const finalArray = getUnique(processedData, 'number')


const objToJson = JSON.stringify(finalArray, null, '\t')

fs.appendFile('./final-data/final.json', objToJson, err => err ? console.log('something wrong') : console.log('successfully written file'))
