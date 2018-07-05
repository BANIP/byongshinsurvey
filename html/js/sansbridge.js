$("*").mousemove(e => e.preventDefault());
function typing({ message, callback, tickCallback, interval, restInterval, $dom}){
    let leftMessage = message.split("");
    let messageOutputInterval = setInterval(() => {
        const alphabet = leftMessage.shift();
        if(leftMessage.length > 0) {
            $dom.html($dom.html() + alphabet)
            tickCallback(alphabet);
        } else {
            clearInterval(messageOutputInterval);
            callback();
        }

    }, interval)
}

function setProgress(progress,startPosition = 0){
    const resolveCallback = (interval,nextPosition = startPosition + 1) => {
        setTimeout( () => setProgress(progress,nextPosition)  ,interval)
    }
    progress[startPosition](resolveCallback);
}

const startBridge = () => {
    const st = (callback, timing) => setTimeout(callback,timing);
    const $sansMes = $("<div class='sansmessage'></div>").css({
        top:"50%",
        left:"50%",
        color:"white",
        fontFamily:"굴림",
        fontSize:"1.2em",
        position:"absolute",
        textAlign:"center",
        transform:"translate(-50%)",
        zIndex:"10",
        width:"80vw",
    });

    const sansTyping = (message,callback,isAngular = false) => typing({
        message,
        callback: ()=> {
            st(() => {
                if(!isAngular) $sansMes.html("");
                callback();
            },2000)
        },  
        tickCallback: (alphabet) => {
            if(![" ",".",","].some(v => v == alphabet) ) new Audio("./media/und_sans_single.ogg").play() 
            
        },
        interval:isAngular? 300:120,
        restInterval:100,
        $dom:$sansMes
    })
    
    const audios = {
        get : new Audio("./media/und_get.ogg"),
        battleFade : new Audio("./media/und_battle_fade.ogg"),
        battleStart : new Audio("./media/und_battle_start.ogg"),
        birdNoise : new Audio("./media/mus_birdnoise.ogg"),
    }

    
    setProgress({
        0:(resolve) => {
            audios.get.play();
            $("html").css("background","black");
            $("body").css("background","black");
            $("body").css("overflow","hidden");
            $("body").on("touchmove",(e) => e.preventDefault());
            $("body").on("mousemove",(e) => e.preventDefault());
            $("<div>Hidden Area Unlatched </div> ").addClass("absolutlyCenter").css({
                padding: "2em",
                border: "1px solid #4CAF50",
                background: "white",
                color: "#4CAF50",
                display:"none",
                testAlign:"center",
            }).appendTo("body").fadeIn();
            resolve(3000)
        },
        1:(resolve) => {
            audios.battleFade.play();
            st(
                () => $("body").find("*").not("script").remove(),
            500);
            resolve(3000)
        },
        2:(resolve) => {
            try{document.body.webkitRequestFullScreen()} catch{}
            try{document.body.requestFullScreen()} catch{}
            $("body").append($sansMes);
            audios.birdNoise.play();
            sansTyping("정말 아름다운 날이야.",() => resolve(2000))
        },
        3:(resolve) => {
            sansTyping("새들은 지저귀고, 꽃들은 피어나고... ",() => resolve(2000))
        },
        4:(resolve) => {
            sansTyping("이런 날엔, 너 같은 호기심 많은 꼬마들은... ",() => resolve(2000))
        },
        5:(resolve) => {
            $("<img src='./img/sans_gif.gif' />")
                .addClass("absolutlyCenter").appendTo("body").css({
                width:"20vw",
            }).fadeIn(1000,() => resolve(1000))
        },
        6:(resolve) => {
            $sansMes.css({
                top:"70%",
                color:"red",
                fontSize:"2.4em"
            });
            audios.birdNoise.pause();
            sansTyping("리듬게임을 즐겨야해 ",() => resolve(1000),true)
        },
        7:(resolve) => {
            $("img").remove();
            $sansMes.remove();
            $heartimg = $("<img src='./img/heart.jpg' />").css({
                position:"absolute",
                top:"80%",
                left:"50%",
                transform:"translate(-50%,-50%)",
                width:"9vw"
            }).appendTo("body")
            audios.battleStart.play();
            for(var i = 0; i < 6; i++)
                setTimeout(
                    () => $heartimg.css("display",i % 2 ? "none" : "block")
                    ,(i + 1) * 90
                )
            resolve(1000);
        },
        8:() => {
            location.href = "./mega.html";
            /**$("img").remove();
            $("<iframe src='./mega.html'>")
                .css({
                    width:"100%",
                    height:"100%",
                    border:"none",
                    position:"absolute",
                    top:0,
                    left:0
                })
                .appendTo("body")
            */
        },
    })
    
}
const setCommand = (commands,callback,dom = document.body) => {
    let leftCommands = commands.concat();

    var hammertime = new Hammer(document.body);

    hammertime.on('swipeup swipedown swipeleft swiperight', function(ev) {
        const eventType = ev.type;
        if("swipe" + leftCommands.shift() == eventType)
            true;
        else leftCommands = commands.concat();
    });
    $(".flower.first").click(() => {
        if(leftCommands.length == 2) leftCommands.shift(); 
    })
    $(".flower.second").click(() => {
        if(leftCommands.length == 1) callback();
    })
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
}

setCommand(["up","up"
    ,"down","down"
    ,"left","right"
    ,"left","right"
    ,[$(".flower.first"),"click"]
    ,[$(".flower.second"),"click"] ],
    startBridge
);
new Audio("./media/und_get.ogg");
