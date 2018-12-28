var LIVE2DCUBISMCORE =Live2DCubismCore
//如果资源在CDN，一定要写http://或者https://否则会以本域名请求且为相对路径
var themePath = window.location.protocol+'//'+ window.location.host+"/Resource/";
//模型的model3.json文件
var modelPath = themePath + 'xuefeng.model3.json';
var tag_target = '.waifu';
//待机的动作索引
var idleIndex;
//登录的动作索引
var loginIndex;
//渲染模型的宽高
var modelWidth = 280;
var modelHight = 250;
//渲染模型的比例
var scale = 17.5;
//动作总数
var motionCount = 0 ;
//测试用，加载时间起点，不保证准确性
var startTime = new Date().getTime();
//动作数组，存放格式化好的动作数据
var motions = [];
//第一种方式初始化模型，通过model3.json的内容去导入
function initModelConfig(modelJson){
    var fileReferences = modelJson.FileReferences;
    var mocPath =  fileReferences.Moc;
    loadMoc(mocPath);
    var textures = fileReferences.Textures;
    loadTextures(textures);
    var phyPath = fileReferences.Physics;
    var motions;
    for (const key in fileReferences.Motions) {
        motions =  fileReferences.Motions[key];
        console.log(motions);
    }
    PIXI.loader.load(function (loader, resources) {
        var app = new PIXI.Application(modelWidth, modelHight, { transparent: true });
        var canvas = document.querySelector(tag_target);
        canvas.appendChild(app.view);
        canvas.querySelector('canvas').setAttribute('id','live2d');
        var moc = Live2DCubismCore.Moc.fromArrayBuffer(resources['moc'].data);
        var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
        
        builder.setMoc(moc);
        builder.setTimeScale(1);
        var textureIndex = 0;
        for (const key in resources) {
            if(key.indexOf('texture')!= -1){
                builder.addTexture(textureIndex++ , resources[key].texture);
            }
        }
        if(resources['physics']){ builder.setPhysics3Json(resources['physics'].data); }
        var model = builder.build();
        app.stage.addChild(model);
        app.stage.addChild(model.masks);
        setMotions(model,resources);
        setMouseTrick(model,app,canvas);
        var onResize = function (event) {
            if (event === void 0) { event = null; }
            var width = modelWidth;
            var height = modelHight;
            app.view.style.width = width + "px";
            app.view.style.height = height + "px";
            app.renderer.resize(width, height);    
            model.position = new PIXI.Point(modelWidth/2, modelHight/2);
            model.scale = new PIXI.Point(scale, scale);
            model.masks.resize(app.view.width, app.view.height);
        };
        onResize();
        window.onresize = onResize;
    });
}
//加载MOC文件
function loadMoc(mocPath){
    if(typeof(mocPath) !== 'undefined'){
        PIXI.loader.add('moc', themePath + mocPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
    }else{
        console.log('Not find moc');
    }
}
//加载 texture 文件
function loadTextures(textures){
    if(textures.length >0){
        for (let i = 0; i < textures.length; i++) {
            console.log(textures[i]);
            //loadTextures;
            PIXI.loader.add('texture' + ( i + 1) , themePath + textures[i]);
        }
    }else{
        console.log("Not find textures");
    }
}
// 加载physics文件
function loadPhyPath(phyPath){
    if(typeof(phyPath) !== 'undefined'){
        PIXI.loader.add('physics', themePath + phyPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
    }else{
        console.log('Not find physics');
    }
}
//加载动作文件
function loadMotions(motions){
    if(motions.length >0){
        for (let i = 0; i < motions.length; i++) {
            PIXI.loader.add('motion'+ ( motionCount + 1) , themePath + motions[i].File, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            if(motions[i].File.indexOf('idle')!= -1){idleIndex = motionCount;}else if(motions[i].File.indexOf('login') != -1){loginIndex = motionCount;}
            motionCount ++ ;
        }
    }else{
        console.error('Not find motions')
    }
}
//简单发送AJAX异步请求读取json文件
function ajax(url){
    var ajax = null;
    if(window.XMLHttpRequest){ajax = new XMLHttpRequest();}else if(window.ActiveObject){
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        throw new Error('loadModelJsonError');
    }  
    ajax.open('GET', url, true);
    ajax.send();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){  
            if(ajax.status == 200){ 
                var data = JSON.parse(ajax.responseText)
                //initModelConfig(data);
                initModel(data);
            }else{
                console.error('Response error,Code:' + ajax.status);
            }
        }
    };
}
ajax(modelPath);
//另一种初始化模型方式
function initModel(data){
    var model3Obj = {data:data,url:themePath};
    var loader =PIXI.loader;
    for (const key in data.FileReferences.Motions) {
        loadMotions(data.FileReferences.Motions[key]);
    }
    //调用此方法直接加载，并传入设置模型的回调方法
    new LIVE2DCUBISMPIXI.ModelBuilder().buildFromModel3Json(loader, model3Obj, setModel);  
}
//设置模型的回调方法
function setModel(model){
    var app = new PIXI.Application(modelWidth, modelHight, { transparent: true });
    var canvas = document.querySelector(tag_target);
    canvas.appendChild(app.view);
    canvas.querySelector('canvas').setAttribute('id','live2d');
    app.stage.addChild(model);
    app.stage.addChild(model.masks);
    var resources = PIXI.loader.resources;
    setMotions(model,resources);
    setMouseTrick(model,app,canvas);
    app.view.style.width = modelWidth + "px";
    app.view.style.height = modelHight + "px";
    app.renderer.resize(modelWidth, modelHight);    
    model.position = new PIXI.Point(modelWidth/2, modelHight/2);
    model.scale = new PIXI.Point(scale, scale);
    model.masks.resize(app.view.width, app.view.height);
    loadTime = new Date().getTime() - startTime;
    console.log('Model initialized in '+ loadTime/1000 + ' second');
}
//设置模型动作
function setMotions(model,resources){
    var motions = [];
    for (const key in resources) {
        if(key.indexOf('motion') != -1){
            motions.push(LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources[key].data)); 
        }
    }
    var timeOut;
    if(motions.length > 0){
        window.clearTimeout(timeOut);
        model.animator.addLayer("motion", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1.0);
        model.animator.getLayer("motion").play(motions[loginIndex]);
        timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[loginIndex].duration * 1000 );
    }
}
//设置鼠标追击
function setMouseTrick(model,app,canvas){
    var rect = canvas.getBoundingClientRect();
    var center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
    var mouse_x = center_x, mouse_y = center_y;
    var angle_x = model.parameters.ids.indexOf("ParamAngleX");
    if(angle_x < 0){ angle_x = model.parameters.ids.indexOf("PARAM_ANGLE_X"); }
    var angle_y = model.parameters.ids.indexOf("ParamAngleY");
    if(angle_y < 0){ angle_y = model.parameters.ids.indexOf("PARAM_ANGLE_Y"); }
    var eye_x = model.parameters.ids.indexOf("ParamEyeBallX");
    if(eye_x < 0){ eye_x = model.parameters.ids.indexOf("PARAM_EYE_BALL_X"); }
    var eye_y = model.parameters.ids.indexOf("ParamEyeBallY");
    if(eye_y < 0){ eye_y = model.parameters.ids.indexOf("PARAM_EYE_BALL_Y"); }
    app.ticker.add(function (deltaTime) {
        rect = canvas.getBoundingClientRect();
        center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
        var x = mouse_x - center_x;
        var y = mouse_y - center_y;
        model.parameters.values[angle_x] = x * 0.1;
        model.parameters.values[angle_y] = -y * 0.1;
        model.parameters.values[eye_x] = x * 0.005;
        model.parameters.values[eye_y] = -y * 0.005;
        model.update(deltaTime);
        model.masks.update(app.renderer);
    });
    var scrollElm = bodyOrHtml();
    var mouseMove;
    document.body.addEventListener("mousemove", function(e){
        window.clearTimeout(mouseMove);
        mouse_x = e.pageX - scrollElm.scrollLeft;
        mouse_y = e.pageY - scrollElm.scrollTop;
        mouseMove =  window.setTimeout(function(){mouse_x = center_x , mouse_y = center_y} , 5000);
    });
    var timeOut;
    document.body.addEventListener("click", function(e){
        window.clearTimeout(timeOut);
        if(motions.length == 0){ return; }
        if(rect.left < mouse_x && mouse_x < (rect.left + rect.width) && rect.top < mouse_y && mouse_y < (rect.top + rect.height)){
            var rand = Math.floor(Math.random() * motions.length);
            model.animator.getLayer("motion").stop();
            model.animator.getLayer("motion").play(motions[rand]);
            timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[rand].duration * 1000 );
        }
    });
}
//获取页面内容方法
function bodyOrHtml(){
    if('scrollingElement' in document){ return document.scrollingElement; }
    if(navigator.userAgent.indexOf('WebKit') != -1){ return document.body; }
    return document.documentElement;
}