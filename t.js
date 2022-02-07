const fs = require('fs');

// read JSON object from file
fs.readFile('user.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    // parse JSON object
    const user = data.toString();

    // print JSON object
    console.log(user);
});

var http = require('http');

var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(user));
});
app.listen(3000);