var request = require('request');
var qs = require('querystring');
const CLIENT_ID = "835389341072-kr7rep1n0c3jmntkl1qvaeli4r3klf8s.apps.googleusercontent.com";
const CLIENT_SECRET = "44__Djd5wbgRzKhu_meEeBEa";

var EC = {
    SESSION_CANNNOT_FOUND : [102,"세션 데이터 없음"],
    DATABASE_ERROR : [103,"데이터베이스 에러"],
    DATA_NOT_FOUND : [104,"데이터 찾을 수 없음"],
    GOOGLE_API_ERROR : [105,"구글 API가 예외를 뱉음"]
}

module.exports = function(app,Survey){
        const getUserInfo = (req,res,errCallback,successCallback) => {

        const access_token = req.session.access_token;
        if(access_token == undefined){
            errCallback(EC.SESSION_CANNNOT_FOUND);
            return null;
        }
       request.get({
            url: 'https://www.googleapis.com/youtube/v3/channels',
            qs: {
                part:"snippet",
                mine:true,
                access_token
            }
          }, (err, gres, body) => {
            if(err) return errCallback(err)
            body = JSON.parse(body);
            const {snippet, id} = body.items[0];
            const channelImg = snippet.thumbnails.high.url;
            const name = snippet.title;
            successCallback({id, channelImg, name});
        });
    }

    const outputError = (res,message,code = 403 ) =>{
        
        let error;
        if(message instanceof Array) error = {error_code:message[0],message:message[1]};
            else error = {
                error_code:EC.GOOGLE_API_ERROR[0],
                message:EC.GOOGLE_API_ERROR[1],
                result:message
            }
            console.log(error)
        res.status(code).json({
            status: code,
            error
        });
    }

    const outputSuccess = (res,result ) =>{
        console.log(result)

        res.json({
            status: 200,
            message: "성공",
            result
        });
    }
    

    app.get('/',function(req,res){
       res.render('main'); 

    });

    app.get('/api/list',function(req,res){
        Survey.find((err, surveys) => {
            if(err) return outputError(res,EC.DATABASE_ERROR);
            res.json(surveys);
        })
    });

    app.get('/api/iswrite',function(req,res){
        new Promise((resolve,reject) => {
            getUserInfo(
                req,res,
                err => outputError(res,err),
                result => resolve(result)
            )
        }).then(({id}) => {
            Survey.findOne({id}, (err, survey) => {
                if(err) return outputError(res,EC.DATABASE_ERROR);
                outputSuccess(res,{iswrite:!!survey})
            })
        })
        
    })

    app.post('/api/write',function(req,res){
        new Promise((resolve,reject) => {
            getUserInfo(
                req,res,
                err => reject(err),
                result => resolve(result)
            )
        }).then(result => new Promise((resolve,reject) => {
            var survey = new Survey();
            
            survey.name = result.name;
            survey.channelImg = result.channelImg;
            survey.id = result.id;
            survey.content = req.body.content;
    
            survey.save((err) => {
                if(err) return reject(err);
                outputSuccess(res,{status:"save success"});
            });

        })).catch(err => outputError(res,err));


    })

    app.get('/api/get_userinfo',function(req,res){
        getUserInfo(
            req,res,
            err => outputError(res,err,403),
            result => outputSuccess(res,result)
        )
    })

    app.post('/api/get_token',function(req,res){
        const oauth = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: req.body.redirect_uri,
            code: req.body.code,
            grant_type:"authorization_code"
        },
       url = 'https://accounts.google.com/o/oauth2/token';

        
        request.post({url, form:oauth,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }, function(err,gres,body){
            if(err) return outputError(res,err);
            const reqData = JSON.parse(body);
            if(reqData.error) return outputError(res,reqData);
            
            req.session.access_token = reqData.access_token;
            outputSuccess(res,reqData);
        });
    })
}