# koa2 快速搭建个人项目

1.koa2 简析结构

    lib：
        appliction.js  是整个koa2的入口文件，封装了context、request、response，以及最核心的中间件处理l流程。
        context.js 处理应用上下文，里面直接封装了部分request.js、response.js的方法
        request.js 处理http请求
        response.js 处理http响应

    package.json

2.中间件开发

    // ./middleware/logger-generator.js

    const log = function (ctx) {
        console.log(ctx.method, ctx.header.host + ctx.url);
    }
    module.exports = function () {
        return async function (ctx, next) {
            log(ctx);
            await next();
        }
    };
    // ./app.js

    const loggerGenerator = require('./middleware/logger-generator');

    app.use(loggerGenerator());

3.路由、路由中间件

    // 原生实现
    const Koa = require('koa')
    const fs = require('fs')
    const app = new Koa()

    /**
     * 用Promise封装异步读取文件方法
     * @param  {string} page html文件名称
     * @return {promise}
     */
    function render( page ) {
      return new Promise(( resolve, reject ) => {
        let viewUrl = `./view/${page}`
        fs.readFile(viewUrl, "binary", ( err, data ) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( data )
          }
        })
      })
    }

    /**
     * 根据URL获取HTML内容
     * @param  {string} url koa2上下文的url，ctx.url
     * @return {string}     获取HTML文件内容
     */
    async function route( url ) {
      let view = '404.html'
      switch ( url ) {
        case '/':
          view = 'index.html'
          break
        case '/index':
          view = 'index.html'
          break
        case '/todo':
          view = 'todo.html'
          break
        case '/404':
          view = '404.html'
          break
        default:
          break
      }
      let html = await render( view )
      return html
    }

    app.use( async ( ctx ) => {
      let url = ctx.request.url
      let html = await route( url )
      ctx.body = html
    })

    app.listen(3000)
    console.log('[demo] route-simple is starting at port 3000')

>使用路由中间件 koa-router

>安装

    npm install koa-router --save

>./router/index.js



    const Router = require('koa-router');

    module.exports = (app) => {
        // 子路由
        let home = new Router();
        home.get('/', async (ctx) => {
            let html = `
            <ul>
                <li><a href="/page/helloworld">/page/helloworld</a></li>
                <li><a href="/page/404">/page/404</a></li>
            </ul>`;
            ctx.body = html;
        });
        // 子路由
        let page = new Router();

        // 装载所有子路由
        let router = new Router();
        router.use('/', home.routes(), home.allowedMethods());
        router.use('/page', page.routes(), home.allowedMethods());

        // 加载路由中间件
        app.use(router.routes()).use(router.allowedMethods())
    }


4.请求数据获取

>GET请求数据

    在koa中，获取GET请求数据源头是koa中request对象中的query方法或querystring方法，query返回是格式化好的参数对象，querystring返回的是请求字符串，由于ctx对request的API有直接引用的方式，所以获取GET请求数据有两个途径。

    1.上下文获取
        1.ctx.query => Object // {a:'1'}
        2.ctx.querystring => string // a=1&b=2
    2.上下文的request获取
        1.ctx.request.query => Object // {a:'1'}
        2.ctx.request.querystring => string // a=1&b=2

>POST请求数据

    koa2未提供自带的post数据的处理 需要中间件

>安装
    npm install koa-bodyparser --save

>koa-bodyparser

    上下文 ctx.request.body 获取


5.静态资源
>安装

    npm install koa-static --save


    const static = require('koa-static');
    const path = require('path');
    const staticPath = './static';

    app.use(static(path.join(__dirname, staticPath)));

6.cookie/session

>koa2使用cookie

    koa提供了从上下文直接读取、写入cookie的方法

        ctx.cookie.get(name,[options]); // 读取上下文请求中的cookie
        ctx.cookie.set(name,value,[options]); // 上下文中写入的cookie

        koa2中操作cookies是使用了npm的cookie模块
>koa2使用session

    koa2原生没有提供session的模块。自是实现或者中间件

        1.如果session数据量很小，可以直接存在内存中
        2.如果session数据量很大，则需要存储介质存放session数据
>安装

    npm install koa-session --save
    npm install koa-redis --save

>使用redis存储


        const session = require('koa-session');
        const redisStore = require('koa-redis');

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
        取值、赋值上下文
            ctx.session

7.模板引擎（ejs）
>安装

    npm install --save ejs
    npm install --save koa-views

    const views = require('koa-views')

    app.use(views(path.join(__dirname,'./views'),{
        extension:'ejs',
    }));

    router.get('/index',async (ctx)=>{
        let title='hello Koa2';
        await ctx.render('index',{
            title,
        });
    });

    // ./views/index.ejs
    <!DOCTYPE html>
    <html>
    <head>
        <title><%= title %></title>
    </head>
    <body>
        <h1><%= title %></h1>
        <p>EJS Welcome to <%= title %></p>
    </body>
    </html>

8.路径访问跨域

[cors使用文档](https://www.npmjs.com/package/koa-cors)

8.数据库（mongodb）

[mongodb使用文档](https://www.npmjs.com/package/mongodb)

[博客地址]()

