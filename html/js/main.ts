const CLIENT_ID = "835389341072-kr7rep1n0c3jmntkl1qvaeli4r3klf8s.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:8080";
const enum EC {
    SESSION_CANNNOT_FOUND = 102,
    DATABASE_ERROR,
    DATA_NOT_FOUND,
    GOOGLE_API_ERROR
};

const appStatus = {
    verified: false,
}
const manageView = (function(){
    
    return {
        // 사용자의 채널과 이름으로 css스타일 적용
        appealUser: (name:string,channelImg:string)=>{
            $("body").css({
                background:`url(${channelImg})`,
                backgroundSize:"10vw 10vw"
            });
            $(".hello").text(name+"아 반가워~~");
            $(".hello").css({display: "block"});
        },
        // 확인버튼 활성화
        activeSendButton: ()=>{
            $(".ok").css("display","block")
        },
        sendComplete: ()=>{
            $(".textarea textarea").val("질문해줘서 고마워!! 꼭 답변쓸께!!")
        }
        
    }
})();

// 구글 oauth에서 인증코드를 받아온 직후의 설정
(function(){
    const getAuth = () => new URL(location.href).searchParams.get("code");
    const saveAccessToken = (code:string) => {
        $.ajax({
            url: "./api/get_token",
            dataType: "json",
            type:"POST",
            async:false,
            data:{
                redirect_uri:REDIRECT_URI,
                code
            }
        }).done((result) => {
            console.log(result.responseText) 
            window.location.search = "";
        }).fail((result:any) => {
            //실패시 get파라미터 지우고 새로고침
            if(result.error == "invalid_grant") window.location.search = "";
            console.log(result.responseText)
        })
    }

    const authcode = getAuth();
    if(authcode){
        saveAccessToken(authcode);
        window.location.search = "";
    }


})();

// 세션에 액세스 토큰이 남아있는지 확인
(function(){
    const isAviliableAuth = () => new URL(location.href).searchParams.get("code") != null;
    
    // 액세스토큰 인증코드 요청
    function requestOAuthCode(){
        var url = new URL("https://accounts.google.com/o/oauth2/auth");
        url.searchParams.append("client_id",CLIENT_ID)
        url.searchParams.append("redirect_uri",REDIRECT_URI);
        url.searchParams.append("response_type","code");
        url.searchParams.append("scope","https://www.googleapis.com/auth/youtube.readonly")
        window.location.href = url.href;
    }

    if( isAviliableAuth() ) return;

    $.ajax({
        url: "./api/get_userinfo",
        dataType: "json",
        type:"GET",
    }).done((result) => {
        const { name,channelImg} = result.result;
        manageView.appealUser( name,channelImg );
        appStatus.verified = true;
    }).fail((res:any) => {
        const errorCode = res.responseJSON.error.error_code;
        if(errorCode == EC.SESSION_CANNNOT_FOUND)
            requestOAuthCode();
    })

})();

(function(){
    $.ajax({
        url: "./api/iswrite",
        dataType: "json",
        type:"GET",
    })
    .done(({result}) => {
       if(result.iswrite == true) manageView.sendComplete();
        else manageView.activeSendButton();
    })
})();


(function(){
    /**
     * 예외
     * 두번째로 눌러졌을 때
     * 인증상태가 아닐때
     * 1000자를 초과했을 때
     * 10자 미만일때
     */
    let clicked = false;
    const $textarea = $(".textarea textarea");
    $(".ok").on("click",function(){
        // 예외처리
        let errMessage: string | null = null;
        const outputText:string = $textarea.val() as string; 
        if(clicked) errMessage = "쫌만 기다려줘~~~~";
        else if(appStatus.verified == false) errMessage = "로그인 해줘~~~";
        else if( outputText.length < 0 ) errMessage = "암것도 안썼자너~~";
        else if( outputText.length < 10 ) errMessage = "좀만 더 써줘~~";
        else if( outputText.length > 1000 ) errMessage = "너무 많아 적당히쓰자~~";
        if(errMessage) return alert(errMessage);
        clicked = true;

        $.ajax({
            url: "./api/write",
            dataType: "json",
            type:"POST",
            data:{
                content: $textarea.text()
            }
        }).always(() => clicked = false)
        .done((result) => {
            manageView.sendComplete();
        }).fail((res:any) => {
            const error = res.responseJSON.error;
            alert(`${JSON.stringify(error)}의 이유로 전송에 실패했어..`);
              
        })
    })

})();