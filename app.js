const Koa = require('koa');
const app = new Koa();
const bodyParse = require('koa-bodyparser');
const static = require('koa-static');
const session = require('koa-session');
const redisStore = require('koa-redis');
const path = require('path');
const views = require('koa-views');


const router = require('./router');
const loggerGenerator = require('./middleware/logger-generator');
const staticPath = './static';

app.keys = ['session_id'];

const CONFIG = {
    key: 'session_id',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    store: new redisStore()
};

app.use(session(CONFIG, app));
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs',
}));
app.use(static(path.join(__dirname, staticPath)));

// 中间件
app.use(loggerGenerator());
app.use(bodyParse());

router(app);

app.listen(3000);

console.log('the server is starting at port 3000')