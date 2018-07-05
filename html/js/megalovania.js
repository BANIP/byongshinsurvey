
/**
 * case stepmania
 * let noteInfo = notes
        //마디단위로 자르기
        .split(/\n,.*\n/)
        //노트단위로 자르기
        .map(measure => measure.split("\n"))
        //시간 계산
        .map(measure => {
            const tick = measuretick / measure.length;
            const result = measure.map(note => {
                time += tick;
                return [time,note]
            })
            return result;
        })
        //마디자른거 노트로 합치기
        .reduce((a,b) => a.concat(b),[])
        //동시치기 노트 분할
        .reduce((result,[time,note]) => {
            note.split("").forEach((step,i) => {
                if(step == "1" || step == "2") result.push([time, i]); 
            })
            return result;
        },[])
 */
if(location.origin != "http://localhost:8080" )
    window.history.pushState(null, null, "/survey/#");

let time = 0, bpm = 240.000; measuretick = 60 / (bpm) * 1000 * 2;
let noteInfo = notes
        //시간 계산
        .map( ( {beat:beatArray,column} ) => {
            const [measure,beatp,beatl] = beatArray;

            const time = (measure +2 + beatp / beatl)*measuretick;
            return [time,column];
        })

        console.log(JSON.stringify(noteInfo.splice(0,10)))

        var nowTime = 0,
        interval = 100,
        offset = 2900,
        perpectTop = $("hr.judgeline").offset().top / innerHeight - 0.05,
        speed = 600;
        if(isMobile.any) offset -= 300
    var playInterval;
    let isStart = false;
    
    function showMessage(pclass, descript) {
        var mes = $(".cloneable.message").clone();
        mes.text(descript);
        mes[0].classList.remove("cloneable");
        mes[0].classList.add(pclass);
        mes.appendTo("#display");
        mes.animate({
            "top": "350px",
            "opacity": "0"
        }, "slow", "swing", function() {
            $(this).remove();
        });
    }
    
    let comboClearInterval; 
    function pushnote(pclass) {
        $(pclass + ".key-intro")[0].classList.add("push");
        var note = $(pclass + ".note:first")
        if(note.length == 0)return;
        var timing = note.css("top").toString().replace("px", "");
        var noteoffset = $("#display .note").position().top / innerHeight;
    
        if (timing == undefined) return;
        pclass = pclass.substring(1);
        if (perpectTop - 0.04 < noteoffset && perpectTop + 0.04 > noteoffset) {
            $(".n-great").text(function(i, v) {
                return parseInt(v) + 1
            });
            $(".n-score").text(function(i, v) {
                return parseInt(v) + 2
            });
            addCombo(true);
            showMessage(pclass, "와!!");
    
            note[0].classList.add("pushed");
            note.remove();
        } else if (perpectTop - 0.15 < noteoffset && perpectTop + 0.15 > noteoffset) {
            $(".n-good").text(function(i, v) {
                return parseInt(v) + 1
            });
            $(".n-score").text(function(i, v) {
                return parseInt(v) + 1
            });
            addCombo(true);
            showMessage(pclass, "샌즈!!");
    
            note[0].classList.add("pushed");
            note.remove();
        } else if (perpectTop - 0.3 < noteoffset && perpectTop + 0.3 > noteoffset) {
            $(".n-miss").text(function(i, v) {
                return parseInt(v) + 1
            });
            addCombo(false);
            showMessage(pclass, "파피루스..");
    
            note[0].classList.add("pushed");
            note.remove();
        }
        //콤보창 표시
        $(".combo").show();
        clearInterval(comboClearInterval);
        comboClearInterval = setInterval(() => {
            $(".combo").hide();
            
        },500)
    }
    
    function addCombo(status) {
        if (status == true) {
            $(".combo").text(function(i, v) {
                return parseInt(v) + 1
            });
            var combo = parseInt($(".combo").text());
            $(".n-maxcombo").text(function(i, v) {
                var maxcombo;
                if (parseInt(v) < combo) {
                    maxcombo = combo;
                } else {
                    maxcombo = parseInt(v);
                }
                return maxcombo;
            });
        } else {
            $(".combo").text(0);
        }
    }
    $("body").on("keydown", function(e) {
        switch (e.keyCode) {
            case 90:
                pushnote(".position-0");
                break;
            case 88:
                pushnote(".position-1");
                break;
            case 190:
                pushnote(".position-2");
                break;
            case 191:
                pushnote(".position-3");
                break;
        }
    });
    

    function getTouchPosition(touch){
        const touchPosition = touch.pageX / innerWidth;
        const viewMargin = 0.01;
        const padding = 0.25
        if( touchPosition > viewMargin + padding * 0 && 
            touchPosition < viewMargin + padding * 1) 
            return 0;
        else if( touchPosition > viewMargin + padding * 1 && 
                 touchPosition < viewMargin + padding * 2 )
                 return 1;
        else if( touchPosition > viewMargin + padding * 2 && 
                 touchPosition < viewMargin + padding * 3 )
                 return 2;
        else if( touchPosition > viewMargin + padding * 3 && 
                 touchPosition < viewMargin + padding * 4 )
                 return 3;
        return null;
    }

    let remainTouches = []
    $("body").on("touchstart", function(e) {
        if(isStart) e.preventDefault();
        const touches = e.originalEvent.touches;
        const now = Date.now();
        console.log(touches.length)
        for(let i = 0; i < touches.length; i++){
            
            const touch = touches.item(i);
            console.log(`%c${now}:  ${touch.identifier} ${touch.pageX} ${touch.pageY}`,`color:white;background:hsl(${now},100%,50%);`) 
            if( remainTouches[ touch.identifier ] ) continue;

            let p = getTouchPosition(touch);
            if(p != null) pushnote(".position-" + p);
            remainTouches[ touch.identifier ] = touch;
        }
    });

    $("body").on("touchmove", function(e) {
        if(isStart) e.preventDefault();
    });

    $("body").on("touchend",(e) => {
        if(isStart) e.preventDefault();
        const isEnabled = [false,false,false,false];

        //remainTouches 초기화
        remainTouches = [];
        const touches = e.originalEvent.touches;
        for(let i = 0; i < touches.length; i++){
            const touch = touches.item(i);
            remainTouches[ touch[identifier] ] = touch;
            let p = getTouchPosition(touch);
            if(p != null) isEnabled[p];

        }
        // push상태 제거
        isEnabled.forEach((state,key) => {
            if(state == false) 
                $(`.position-${key}.key-intro`)[0].classList.remove("push");
        })

    })

    $("body").on("keyup", function(e) {
        switch (e.keyCode) {
            case 90:
                $(".position-0.key-intro")[0].classList.remove("push");
                break;
            case 88:
                $(".position-1.key-intro")[0].classList.remove("push");
                break;
            case 190:
                $(".position-2.key-intro")[0].classList.remove("push");
                break;
            case 191:
                $(".position-3.key-intro")[0].classList.remove("push");
                break;
        }
    });
    setTimeout(() => {
        $(".startbutton").removeClass("hide")
        startTriggerInit();
    },2000)
    

function startTriggerInit(){
    
    $("body .startbutton").on("click keydown", function() {
        if(isMobile.any){
            try{document.body.webkitRequestFullScreen()} catch(e){ console.error(e)}
            try{document.body.requestFullScreen()}catch(e){ console.error(e)}
        }
        if(isStart) return
        isStart = true;

        $(".startbutton").addClass("hide");
        setTimeout(function() {
            $(".gameaudio")[0].play();
        }, offset);
        playInterval = setInterval(function() {
            var isNoteZero = noteInfo.length == 0;
            if (isNoteZero == false) {
                //겜중
                while (noteInfo[0][0] < nowTime + interval) {
                    (function() {
                        var notearr = noteInfo.shift();
                        setTimeout(function() {
                            var note = $(".note.cloneable").clone();
                            var noteHorizon = "position-" + notearr[1];
                            note[0].classList.remove("cloneable");
                            note[0].classList.add(noteHorizon);
                            note.appendTo("#display")
                                .animate({
                                    top: "100%"
                                }, speed, "linear", function() {
                                    if (this.classList.contains("pushed") == false) {
                                        showMessage(noteHorizon, "파피루스...")
                                        addCombo(false);
                                        $(".n-miss").text(function(i, v) {
                                            return parseInt(v) + 1
                                        });
                                        $(this).remove();
                                    }
                                });
                        }, notearr[0] - nowTime);
                    })()
                }
            } else {
                clearInterval(playInterval);
                // 겜끝
                const scoreResult = {
                    great : parseInt( $(".n-great").text() ),
                    good : parseInt($(".n-good").text()),
                    miss :  parseInt($(".n-miss").text()),
                    score : parseInt($(".n-score").text()),
                    combo : parseInt($(".n-maxcombo").text()),
                }
                scoreResult.allScore = 2 * (scoreResult.great + scoreResult.good + scoreResult.miss);
                scoreResult.percent = scoreResult.score * 100 / scoreResult.allScore;
                const percent = scoreResult.percent;
                var rank = "";
                if (percent > 95) {
                    rank = "S";
                } else if (percent > 90) {
                    rank = "AAA";
                } else if (percent > 80) {
                    rank = "AA";
                } else if (percent > 70) {
                    rank = "A";
                } else if (percent > 60) {
                    rank = "B";
                } else if (percent > 50) {
                    rank = "C";
                } else rank = "F";
                scoreResult.playerRank = rank;
                setTimeout(() => gameEnd( scoreResult ),600)
                

            }
            nowTime += interval;
        }, interval);
    
    });
}
    
    function setProgress(progress,startPosition = 0){
        const resolveCallback = (interval = 1000,nextPosition = startPosition + 1) => {
            setTimeout( () => setProgress(progress,nextPosition)  ,interval)
        }
        progress[startPosition](resolveCallback);
    }

    function gameEnd(scoreResult){
        const {great,good,miss,score,allScore,playerRank,percent,combo} = scoreResult;
        $("body").find("*").not("script, audio").remove();
        let playername = "무명"
        $("body, html").css("background","black");
        $("body").css({
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            textAlign:"center",
            color:"white",
            flexDirection: "column",
        })
        $.ajax({
            url: "./api/get_userinfo",
            dataType: "json",
            type:"GET",
        }).done((result) => {
            const { name,channelImg} = result.result;
            playername = name;
        })
        
        $.ajax({
            url: "./api/megalo_save",
            dataType: "json",
            type:"POST",
            data:scoreResult
        }).done((result) => {
            const { name,channelImg} = result.result;
            playername = name;
        })

        const progress = {
            0 : (resolve) => {
                $("<div>게임 결과</div>").css({
                    "marginDown":"2em",
                    "color":"red"
                }).appendTo("body")
                resolve();
            },
            1 : (resolve) => {
                $(`<div>총점 ${score}점<small>/${allScore}점</small></div>`).appendTo("body")
                resolve();
            },  
            2 : (resolve) => {
                $(`<div>퍼센테이지 ${percent}%</div>`).appendTo("body")
                resolve();
            },
            3 : (resolve) => {
                $(`<div>플레이어 랭크 ${playerRank}랭크</div>`).appendTo("body")
                if(miss == 0) $(`<div>풀콤보!!</div>`).appendTo("body")
                if(miss == 0 && good == 0) $(`<div>퍼펙트!!!!!!</div>`).appendTo("body")
                resolve();
            },
            4 : (resolve) => {
                $(`<div>${playername}의 소중한 기록은 병신TV가 가져가겠습니다</div>`).css({
                    "marginTop":"2em",
                    "color":"red"
                }).appendTo("body")
                resolve();
            },  
        }
        setProgress(progress)
    }