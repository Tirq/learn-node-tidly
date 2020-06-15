const debug = require('debug')('app::index');
const helmet = require('helmet');
const express = require('express');
const app = express();
const env = app.get('env'); // execute process.env.NODE_ENV - DEV is default
debug(`Running in ${env.toUpperCase()} environment!`)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if(env === 'development') {
    debug(`Custom log and morgan log is enabled... in ${env.toUpperCase()} envioronment!`);
    const logger = require('./middleware/logger');
    const morgan = require('morgan');
    app.use(morgan('tiny'));
    app.use(logger);
}

const genres = require('./routes/genres');
app.use('/api/genres/', genres);

const home = require('./routes/home');
app.use('/', home);

app.set('view engine', 'pug');
app.set('views', './views');

const port = process.env.PORT || 3000;
app.listen(port, () => debug(`Listening on port ${port}...`))
