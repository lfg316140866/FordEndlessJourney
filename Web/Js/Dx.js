/// <reference path="jquery-1.9.1.min.js" />
/// <reference path="Cmn.js" />
/// <reference path="CmnAjax.js" />
/// <reference path="CmnFuncExd.js" />
/// <reference path="animate/AnimateFrame.js" />
/// <reference path="animate/Scenes.js" />
/// <reference path="animate/ScenesSwitch.js" />


$(document).ready(function () {

     

    Cmn.PageIsLock = true;

    //if ($(window).width() < 1400)
    //{
    //    $(".Js_two_star_box").css("width","63%");
    //}

    Cmn.Func.ImageLazyLoading("body", function (pro) {
        $(".loadinner").css({ "width": pro + "%" });
        $("#counter").html(pro + "%");
    }, function () {
        $(".wrapper").delay(500).fadeOut(800);
        AnimateFrame.Init(500, SwitchMode.Shifting, Direction.Up, Direction.Down);
    });


    $(".inf_item,.inf_pop_box,.configure_con").on("touchstart", function (e) {
        e.stopPropagation();
    })
    $(".inf_item,.inf_pop_box,.configure_con").on("touchmove", function (e) {
        e.stopPropagation();
    });


    $("input").focus(function () {//点击输入框的时候
        $(".footer").hide();//底部的东西隐藏

    });
    $("input").blur(function () {
        $(".footer").show();
    });





})