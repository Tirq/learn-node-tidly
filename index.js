const Joi = require('@hapi/joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const express = require('express');
const app = express();
const env = app.get('env'); // execute process.env.NODE_ENV - DEV is default
console.log(`Running in ${env.toUpperCase()} environment!`)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if(env === 'development') {
    console.log('Custom log and morgan log is enabled...');
    app.use(morgan('tiny'));
    app.use(logger);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

const rootUrl = '/api/genres/';

const genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Comedy'},
    {id: 3, name: 'Animation'}

];

app.get(rootUrl, (req, res) => {
    res.send(genres);
});

app.get(rootUrl + ':id', (req, res) => {
    const {error, genre} = getGenreById(req.params.id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    res.send(genre);
});

app.delete(rootUrl + ':id', (req, res) => {
    const id = req.params.id;
    const {error, genre} = getGenreById(id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    const index = genres.indexOf(id);
    genres.splice(index, 1);
    res.send(genre);
});

app.put(rootUrl + ':id', (req, res) => {
    const id = req.params.id;
    const {error, genre} = getGenreById(id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    const errorValidation = joiValidateGenre(req.body);
    if(errorValidation) return res.status(400).send(errorValidation);
    genre.name = req.body.name;
    res.send(genre);
});

app.post(rootUrl, (req, res) => {
    const errorValidation = joiValidateGenre(req.body);
    if(errorValidation) return res.status(400).send(errorValidation);
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

const getGenreById = (id) => {
    const error = joiValidateId(id);
    const genre = error ? null : genres.find(g => g.id === parseInt(id));
    return {error, genre};    
}

const joiValidateId = (id) => {
   const { error } = Joi.object({
        id : Joi.number().integer().min(1).required()
    }).validate({id});
    return error ? error.details[0].message : null;
};

const joiValidateGenre = (genre) => {
    const { error } = Joi.object({
        name : Joi.string().min(3).required()
    }).validate(genre);
    return error ? error.details[0].message : null;   
};


