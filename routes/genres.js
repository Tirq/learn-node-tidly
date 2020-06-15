const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();

const genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Comedy'},
    {id: 3, name: 'Animation'}
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    const {error, genre} = getGenreById(req.params.id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const {error, genre} = getGenreById(id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {error, genre} = getGenreById(id);
    if(error) return res.status(400).send(error);
    if(!genre) return res.status(404).send('Genre not found');
    const errorValidation = joiValidateGenre(req.body);
    if(errorValidation) return res.status(400).send(errorValidation);
    genre.name = req.body.name;
    res.send(genre);
});

router.post('/', (req, res) => {
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

module.exports = router;