"use strict";
/**
 * Secret Command/ 0:Swipe 1:click
 * 0↑ 0↑ 0↓ 0↓ 0← 0→ 0← 0→ 1Pink 2Blue
 */
var CLIENT_ID = "835389341072-68m6ok02dugcmjtvap1b1t7v60blbr3d.apps.googleusercontent.com";
var REDIRECT_URI = location.origin + location.pathname;
;
var appStatus = {
    verified: false,
};
var manageView = (function () {
    return {
        // 사용자의 채널과 이름으로 css스타일 적용
        appealUser: function (name, channelImg) {
            $("body").css({
                background: "url('" + channelImg + "')",
                backgroundSize: "10vw 10vw"
            });
            $(".hello").text(name + "아 반가워~~");
            $(".hello").css({ display: "block" });
        },
        // 확인버튼 활성화
        activeSendButton: function () {
            $(".ok").css("display", "block");
        },
        sendComplete: function () {
            $(".textarea textarea").val("질문해줘서 고마워!! 꼭 답변쓸께!!");
            $(".ok").css("display", "none");

        }
    };
})();
// 구글 oauth에서 인증코드를 받아온 직후의 설정
(function () {
    var getAuth = function () { return new URL(location.href).searchParams.get("code"); };
    var saveAccessToken = function (code) {
        $.ajax({
            url: "./api/get_token",
            dataType: "json",
            type: "POST",
            async: false,
            data: {
                redirect_uri: REDIRECT_URI,
                code: code
            }
        }).done(function (result) {
            console.log(result.responseText);
            window.location.search = "";
        }).fail(function (result) {
            //실패시 get파라미터 지우고 새로고침
            if (result.error == "invalid_grant")
                window.location.search = "";
            console.log(result.responseText);
        });
    };
    var authcode = getAuth();
    if (authcode) {
        saveAccessToken(authcode);
        window.location.search = "";
    }
})();
// 세션에 액세스 토큰이 남아있는지 확인
(function () {
    var isAviliableAuth = function () { return new URL(location.href).searchParams.get("code") != null; };
    // 액세스토큰 인증코드 요청
    function requestOAuthCode() {
        var url = new URL("https://accounts.google.com/o/oauth2/auth");
        url.searchParams.append("client_id", CLIENT_ID);
        url.searchParams.append("redirect_uri", REDIRECT_URI);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("scope", "https://www.googleapis.com/auth/youtube.readonly");
        window.location.href = url.href;
    }
    if (isAviliableAuth())
        return;
    $.ajax({
        url: "./api/get_userinfo",
        dataType: "json",
        type: "GET",
    }).done(function (result) {
        var _a = result.result, name = _a.name, channelImg = _a.channelImg;
        manageView.appealUser(name, channelImg);
        appStatus.verified = true;
    }).fail(function (res) {
        var errorCode = res.responseJSON.error.error_code;
        if (errorCode == 102 /* SESSION_CANNNOT_FOUND */)
            requestOAuthCode();
    });
})();
(function () {
    $.ajax({
        url: "./api/iswrite",
        dataType: "json",
        type: "GET",
    })
        .done(function (_a) {
        var result = _a.result;
        if (result.iswrite == true)
            manageView.sendComplete();
        else
            manageView.activeSendButton();
    });
})();
(function () {
    /**
     * 예외
     * 두번째로 눌러졌을 때
     * 인증상태가 아닐때
     * 1000자를 초과했을 때
     * 10자 미만일때
     */
    var clicked = false;
    $(".ok").on("click", function () {
        // 예외처리
        var $textarea = $(".textarea textarea");
        var errMessage = null;
        var outputText = $textarea.val();
        if (clicked)
            errMessage = "쫌만 기다려줘~~~~";
        else if (appStatus.verified == false)
            errMessage = "로그인 해줘~~~";
        else if (outputText.length < 0)
            errMessage = "암것도 안썼자너~~";
        else if (outputText.length < 10)
            errMessage = "좀만 더 써줘~~";
        else if (outputText.length > 1000)
            errMessage = "너무 많아 적당히쓰자~~";
        if (errMessage)
            return alert(errMessage);
        clicked = true;
        $.ajax({
            url: "./api/write",
            dataType: "json",
            type: "POST",
            data: {
                content: $textarea.val()
            }
        }).always(function () { return clicked = false; })
            .done(function (result) {
            manageView.sendComplete();
        }).fail(function (res) {
            var error = res.responseJSON.error;
            alert(JSON.stringify(error) + "\uC758 \uC774\uC720\uB85C \uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4..");
        });
    });
})();
