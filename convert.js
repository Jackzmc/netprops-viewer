const fs = require('fs');
const parser = require('xml2json')

fs.readFile('./input.xml', (err, data) => {
    if(err) return console.error('readerr: ', err);
    if(!err) {
        const json = parser.toJson(data)
        fs.writeFile('./l4d2.netprops.json', json, (err) => {
            if(err) return console.error('writeerr: ', err);
        });
    }
})