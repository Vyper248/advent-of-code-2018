const fs = require('fs');

const readFile = (filename, func) => {
    fs.readFile(filename, (err, data)=>{
        func(data.toString());
    });
}

module.exports = {readFile};