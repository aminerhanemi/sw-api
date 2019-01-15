const express = require('express');
const app = express();
const port = 3000;
const rp = require('request-promise');

const swapi_end_point = 'https://swapi.co/api/people/?page=';
let swCharacters = [];

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/swpeople', async (req, res) => {
    if (swCharacters.length === 0) {
        try {
            const results = await makeRequestAll(1);
            swCharacters = results.map(person => person.name);
        } catch (err) {
            console.err(err);
        };
    }
    res.send(swCharacters);
});

app.get('/', async (req, res) => {
    res.send('app running');
});


async function makeRequestAll (page, list = []) {
    try {
        const data = JSON.parse(await rp(swapi_end_point + page));
        list = list.concat(data.results);
        if (data.next) {
            list = await makeRequestAll(page + 1, list);
        }
        return list;
    } catch (err) {
        console.error(err);
    }
}

app.listen(port, () => console.log(` app listening on port ${port}!`));


