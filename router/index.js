const Router = require('koa-router');

module.exports = (app) => {
    let router = new Router();

    router.get('/', async (ctx, next) => {
        await next();
    }, async (ctx) => {
        // ctx.session.user = '123123';
        let html = `
        <ul>
            <li><a href="/page/helloworld">/page/helloworld</a></li>
            <li><a href="/page/404">/page/404</a></li>
        </ul>`;
        ctx.body = html;
    });

    router.get('/index', async (ctx) => {
        console.log('hello koa2');
        let title = 'hello koa2';
        await ctx.render('index', {
            title,
        });
    });
    router.get('/query', async (ctx) => {
        let url = ctx.url;
        // 上下文的request
        let request = ctx.request;
        let reqQuery = request.query;
        let reqQuerystring = request.querystring;
        // 上下文中直接获取
        let ctxQuery = ctx.query;
        let ctxQuerystring = ctx.querystring;

        ctx.body = {
            url,
            reqQuery,
            reqQuerystring,
            ctxQuery,
            ctxQuerystring
        };
    });

    router.post('/post', async (ctx) => {
        let postData = ctx.request.body;
        ctx.body = postData;
    });

    router.get('/cookie', async (ctx) => {
        ctx.cookies.set('cookie01', 'cookie01', {
            // domain: 'localhost',  // 写cookie所在的域名
            // path: '/index',       // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            expires: new Date('2017-02-15'),  // cookie失效时间
            // httpOnly: false,  // 是否只用于http请求中获取
            // overwrite: false  // 是否允许重写
        });
        ctx.body = 'cookie is ok'
    });
    // 装载
    app.use(router.routes()).use(router.allowedMethods())
}