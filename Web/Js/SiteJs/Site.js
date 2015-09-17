/// <reference path="../jquery-1.9.1.js" />
/// <reference path="../Cmn.js" />
/// <reference path="../CmnAjax.js" />
/// <reference path="../animate/AnimateFrame.js" />



$(document).ready(function () {
    var _isFrist = true;
    AnimateFrame.OnScenesAfterHide = function () {
        $(".Js_city_float").hide();
    }
    AnimateFrame.OnScenesAfterShow = function () {
        $(".home_btn").removeClass("home_set");
        $(".Js_nav_btn1,.Js_nav_btn4,.Js_nav_btn2").removeClass("nav_set");
        var _IsFrist=true;//代表第一次进入，则绑定事件
        if (AnimateFrame.CurScenes.ID == "home") {
            $(".Js_nav_btn1").addClass("nav_set");
            //$(".home_nav1").addClass("home_set");


        }
        else if (AnimateFrame.CurScenes.ID == "gfx_mind") {
            $(".Js_nav_btn1").addClass("nav_set");
            //$(".home_nav2").addClass("home_set");
        }
        else if (AnimateFrame.CurScenes.ID == "route_introduction") {
            $(".Js_nav_btn1").addClass("nav_set");
            //$(".home_nav3").addClass("home_set");
        }
        else if (AnimateFrame.CurScenes.ID == "activity") {
            $(".Js_nav_btn1").addClass("nav_set");
            //$(".home_nav4").addClass("home_set");
        }
        else if (AnimateFrame.CurScenes.ID == "enlist") {
            $(".Js_nav_btn4").addClass("nav_set");
            //$(".home_nav5").addClass("home_set");
        } else if ($.trim(AnimateFrame.CurScenes.ID) == "route") {
            $(".Js_nav_btn2").addClass("nav_set");
            setTimeout(function () {
                $(".route_bar").mCustomScrollbar("destroy");
                $(".route_bar").mCustomScrollbar({
                    autoDraggerLength: false,
                    scrollButtons: {
                        enable: false,
                        scrollType: "continuous",
                        scrollSpeed: "auto",
                        scrollAmount: 40
                    },
                    theme: "light" /*"light", "dark", "light-2", "dark-2", "light-thick", "dark-thick", "light-thin", "dark-thin"*/
                });
            }, 200);

        }
        else if (AnimateFrame.CurScenes.ID == "history_strategy")
        {
        
            if (_isFrist)
            {
                _isFrist = false;
                Cycle();
             
            }

        }

    }



    Home.Init();
    //Home.BindClick();


});



//页面加载的时候的业务逻辑
(PageLoad = new function () {
    /// <summary>页面加载的时候的业务逻辑</summary>

    this.ResLoadComplete = function () {
        /// <summary>资源加载完成之后</summary>


    }




});


//首页业务逻辑 此处名称可以和页面对应起来 也可以和场景ID对应
(Home = new function () {
    /// <summary>首页业务逻辑</summary>

    //设置网站默认分享
    SiteFunc.Share("设置网站默认分享");

    //获取随机数

    var _random = SiteFunc.GetRandom();

    //调用测试检测

    SiteFunc.Testing("进入首页场景");

    PageLoad.ResLoadComplete = function () {


    }



    this.Init = function () {
        /// <summary>页面或者场景的初始化</summary>

        //填充省份
        CmnMis.Itf.GetData("GetProvince", "", false, function (dat) {

            var _strTemp = '<option value="">请选择</option>';
            for (var _i = 0; _i < dat.data.length; _i++) {
                _strTemp += '<option value="' + dat.data[_i].province_id + '">' + dat.data[_i].province_desc + '</option>';
            }
            $("#Js_Province").html(_strTemp);

            //填充城市
            $("#Js_Province").change(function () {
                CmnMis.Itf.GetData("GetCity", { "province_id": $("#Js_Province").val() }, false, function (datcity) {
                    var _strTemp = '<option value="">请选择</option>';
                    for (var _i = 0; _i < datcity.data.length; _i++) {
                        _strTemp += '<option value="' + datcity.data[_i].city_id + '">' + datcity.data[_i].city_desc + '</option>';
                    }
                    $("#Js_City").html(_strTemp);

                });
            });
        });

        $(".Js_Name").val("");
        $(".Js_Phone").val("");
        $("#Js_City").html('<option value="">请选择</option>');

        //视屏单击
        $(".Js_video").click(function () {
            $(".pop_box_float").show();
            $(".video_float").show();


            $(".video_con").html(Cmn.Video.GetVideoPlayerHtml(Cmn.Func.GetAbsoluteUrl("Js/CmnControlRes/uservideo.flv"), "700", "500", "", true));
        });

        //视屏关闭
        $(".close_btn").click(function () {
            $(".pop_box_float").hide();
            $(".video_float").hide();
            $(".video_con").html("");
        });
        //活动说明单击
        $(".Js_events_btn").click(function () {
            $(".pop_box_float").show();
            $(".events_float").show();
            $(".events_btn").show();
        });
        //活动说明关闭
        $(".events_btn").click(function () {

            $(".pop_box_float").hide();
            $(".events_float").hide();
            $(".events_btn").hide();
        });

        //提交成功浮层关闭按钮
        $(".Js_success_btn").click(function () {
            $(".Js_pop_box_float").hide();
            $(".Js_SuccessFloat").hide();

        });

        //点击北京站浮层
        $(".Js_star .provinces_photo").click(function () {
            var _index = $(this).attr("myid");
            ShowWarp(_index);
        });

        //路线介绍点击省份弹出框部分
        $(".Jsc_pub_provinces").click(function () {
            var _index = $(this).index(".Jsc_pub_provinces");
            $(".Js_pub_provinces_pop").hide();
            $(".Js_pub_provinces_pop").eq(_index).show();
        });
        //点击关闭按钮
        $(".Js_shut_btn").click(function () {
            ShowWarp("");
        });

        //点击本站路书按钮
        $(".Js_way_btn").click(function () {
            $(".Js_station_bj").hide();
            $(".Js_station_float").hide();
            $(".Js_pop_box_float").hide();

            $(this).addClass("brilliant_set");
            $(".Js_pop_box_float").show();
            $(".Js_SuccessFloat").show();
            $(".Js_Text").text("精彩内容，敬请期待！");
        });
        //点击精彩内容按钮
        $(".Js_brilliant_btn").click(function () {
            $(this).addClass("brilliant_set");
            $(".Js_station_bj").hide();
            $(".Js_station_float").hide();
            $(".Js_pop_box_float").hide();
            AnimateFrame.SlideTo("route");
        });

        //点击参加城市列表
        $(".Js_activity_city").click(function () {
            $(".Js_city_float").show();
        });

        //点击参加城市关闭
        $(".Js_city_btn").click(function () {
            $(".Js_city_float").hide();
        });

        //右下角二维码点击和hover事件
        $(".Js_share_hover").hover(function () {
            $(".Js_share_link").removeClass("updateing");
        }, function () {
            $(".Js_share_link").addClass("updateing");
        });

        //历史回顾活动路线年份按钮切换
        $(".Jsc_year_box a").click(function () {
            //$(".map_box img").hide();
            $(".Jsc_year_box a").parent().removeClass("year_set");
            $(this).parent().addClass("year_set");
            if($(this).parent().attr("map")=="year"){
                $(".map_1").show();
                $(".map_2").hide();
            }else{
                $(".map_2").show();
                $(".map_1").hide();
            }
        })
        $(".Js_route_sidebar").on("mousewheel", function (e) {
            e.stopPropagation()
        })
        //历史回顾图片浮层关闭按钮
        $(".Js_pic_btn").click(function () {
            $(".Jsc_history_picfloat").hide();
            $(".Js_pop_box_float").hide();
        })
        $(".Js_share_btn1").hover(function () {
            $(".Js_share_link").removeClass("updateing");
            $(".code_float").show();
        }, function () {
            $(".code_float").hide();
            $(".Js_share_link").addClass("updateing");
        });

        //跳转历史回顾首页
        $(".Jsc_retrun_btn").click(function () {
            AnimateFrame.SlideTo("history_home");
        });

        //跳转图片集锦场景
        $(".Jsc_des_btn").click(function () {
            AnimateFrame.SlideTo("history_strategy");
        });

        var _isClick=true;
        //历届回顾攻略点击图片弹出大图
        $(".Jsc_strategy_nav li a").click(function () {
            var _index = $(this).index(".Jsc_strategy_nav li a");
            $(".Jsc_history_picfloat").show();
            $(".Js_pop_box_float").show();
            Cycle2(_index);
        });
        $(".JscHistoryVideo").on("click", function () {
            var _url = Cmn.Func.GetAbsoluteUrl("flash/History.mp4");
            var _videoHtml = Cmn.Video.GetVideoPlayerHtml(_url, $(".video_photo").width(), $(".video_photo").height(), "", true);
            $(this).html(_videoHtml);
        });

    
          

      
       


        //右下角二维码点击和hover事件
        //this.BindClick = function () {
        //    var _tempclass = "";
        //    $(".Js_share_hover").hover(function () {
        //        if ($(".Js_share_link ").hasClass("updateing")) {
        //            _tempclass = "updateing";
        //            $(".Js_share_link").removeClass("updateing");
        //        }
        //        else 
        //        {
        //            _tempclass = "";
        //            $(".code_float").hide();
        //        }


        //    }, function () {
        //        if (_tempclass!="") {

        //            $(".Js_share_link ").addClass("updateing");
        //            _tempclass = "";
        //        }
        //        else {
        //            _tempclass = "";
        //            $(".code_float").show();
        //        }
        //    });

        //私房路线，下拉单击
        $(".Js_P").click(function () {
            if ($(".Js_route_sidebar").is(":hidden")) {
                $(".Js_route_sidebar").show();
            } else {
                $(".Js_route_sidebar").hide();
            }
        });
        //重庆站,做单独处理
        //$(".Js_provinces_img_0").click(function () {
        //    $(".Js_pop_box_float").show();
        //    $(".Js_station_float").show();
        //    $(".Js_station_bj0").show();
        //});
        //下拉选项单击
        $(".Js_route_nav li").click(function () {
            if (!$(this).hasClass("not_selected")) {
                if ($(this).attr("star") == "4") {
                    $(this).parents(".route_set").addClass("select");
                } else {
                    $(this).parents(".route_set").removeClass("select");
                }
                $(".Js_P").html($(this).find("a").html());
                $(".Js_route_sidebar").hide();
                var _index = $(this).index(".Js_route_nav li");
                $(".Js_route_bar2 img").hide();
                $(".Js_route_bar2 img").eq(_index).show();
                setTimeout(function () {
                    $(".route_bar").mCustomScrollbar("destroy");
                    $(".route_bar").mCustomScrollbar({
                        autoDraggerLength: false,
                        scrollButtons: {
                            enable: false,
                            scrollType: "continuous",
                            scrollSpeed: "auto",
                            scrollAmount: 40
                        },
                        theme: "light" /*"light", "dark", "light-2", "dark-2", "light-thick", "dark-thick", "light-thin", "dark-thin"*/
                    });
                }, 100);
            }
            else {
                $(".Js_route_sidebar").hide();
            }
        });

        $(".Js_expect_close").click(function () {
            $(".Js_pop_box_float").hide();
            $(".Js_expect_float").hide();
        });

        $(".Js_share_btn1").click(function (e) {
            $(".code_float").show();
            $(this).find(".Js_share_link").removeClass("updateing");
            e.stopPropagation();
        });

        $(".code_float").click(function (e) {
            $(".Js_share_link").addClass("updateing");
            $(this).hide();
            e.stopPropagation();
        });

        $("body").click(function () {
            $(".Js_share_link").addClass("updateing");
            $(".code_float").hide();
        })
        //提交报名
        $(".Js_submit_btn").click(function () {
            MLTrackerz.track({ type: "event", action: "yuyueshijia" })
            var _param = {
                "name": $(".Js_Name").val(),
                "phone": $(".Js_Phone").val(),
                "province_id": $("#Js_Province").val(),
                "city_id": $("#Js_City").val(),
                "owners": $(".Js_choose_btn.set_btn ").attr("myid"),
                "source_location": "Pc报名页面",
                "memo": window.location.href
            }

            if (_param.name == "") {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("姓名不能为空！");

                return;
            }
            else if (_param.phone == "") {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("电话不能为空！");
                return;
            }
            else if (!Phonecheck(_param.phone)) {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("电话格式不正确！");

                return;
            }
            else if (_param.province_id == "") {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("请选择省份！");

                return;
            }
            else if (_param.city_id == "") {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("请选择城市！");

                return;
            }
            else if (_param.source_location == "") {
                $(".Js_pop_box_float").show();
                $(".Js_SuccessFloat").show();
                $(".Js_Text").text("当前位置为空！");
                return;
            }
            CmnAjax.PostData("Itf/Php/Itf.php?method=InsertPcEnrollment", _param, function (dat) {
                if (dat.IsSuccess == "1") {
                    $(".Js_pop_box_float").show();
                    $(".Js_SuccessFloat").show();
                    $(".Js_Text").text("提交成功！");
                    Home.Init();
                }
                else {

                    if (dat.IsSuccess == "2") {
                        $(".Js_pop_box_float").show();
                        $(".Js_SuccessFloat").show();
                        $(".Js_Text").text("手机号码已存在！");
                    }
                    else {
                        $(".Js_pop_box_float").show();
                        $(".Js_SuccessFloat").show();
                        $(".Js_Text").text("提交失败！");
                    }
                }

            });

        });

        //首页，左侧导航

        $(".Js_home_nav li").click(function () {
            if ($(".Js_home_nav li").index($(this)) == 0) {
                AnimateFrame.SlideTo("home");
            }
            else if ($(".Js_home_nav li").index($(this)) == 1) {
                AnimateFrame.SlideTo("gfx_mind");
            }
            else if ($(".Js_home_nav li").index($(this)) == 2) {
                AnimateFrame.SlideTo("activity");
            }
            else if ($(".Js_home_nav li").index($(this)) == 3) {
                AnimateFrame.SlideTo("route_introduction");
            }
            else if ($(".Js_home_nav li").index($(this)) == 4) {
                AnimateFrame.SlideTo("enlist");
            }

        });

        //是否虎翼车主
        $(".Js_choose_btn").click(function () {
            $(".Js_choose_btn").removeClass("set_btn");
            $(this).addClass("set_btn");

        });


        //2015无尽之yu
        $(".Js_nav_btn1").click(function () {
            AnimateFrame.SlideTo("home");
        });

        //私房路线
        $(".Js_nav_btn2").click(function () {
            AnimateFrame.SlideTo("route");

        });

        //历yu回顾
        $(".Js_nav_btn3").click(function () {
            AnimateFrame.SlideTo("history_home");
            //$(".Js_pop_box_float").show();
            //$(".Js_expect_float").show();
        });
        //路线介绍
        $(".Jsc_history_btn").click(function () {

            AnimateFrame.SlideTo("history_video");
        });
        //精彩视频
        $(".Jsc_video_buttn").click(function () {

            AnimateFrame.SlideTo("history_picture");
        });
        //图片集锦
        $(".Jsc_picture_btn").click(function () {

            AnimateFrame.SlideTo("history_strategy");
        });

        //立即报名
        $(".Js_nav_btn4").click(function () {
            AnimateFrame.SlideTo("enlist");

        });

        //本站路书
        $(".Js_book_btn").click(function () {
            $(".Js_pop_box_float").show();
            $(".Js_SuccessFloat").show();
            $(".Js_Text").text("精彩内容，敬请期待！");

        });

        //星级切换
        $(".Js_route_subnav li").click(function () {
            $(".Js_route_subnav li").removeClass("route_set");
            $(".Js_star").hide();
            $(".Js_guide").hide();
            $(this).addClass("route_set");
            $(".Js_star").eq($(".Js_route_subnav li").index($(this))).show();
            $(".Js_guide").eq($(".Js_route_subnav li").index($(this))).show();
            if ($(".Js_route_subnav li").index($(this)) == 0) {
                $("#route_introduction .provinces_pop .Js_pub_provinces_pop").hide();
            }
        });

        $(".Js_route_subnav li").eq(1).trigger("click");

        //********************************************************轮播Start**********************************************************************************************
        var _CurPostionLeft = -53;//当前父容器left值
        var _CurShaowbarIndex = 1;//当前遮罩下标
        var _CurSonleft = 0;//内部元素的left百分比
        var _IsClick = true;
        $(".Js_shadow_box1").hide();

        //左

        $(".left_arrow").click(function () {
            if (_IsClick) {
                _IsClick = false;
                var _CurWidth = parseFloat($(".shadow_bar").eq(1).css("left").replace("px", "") - $(".shadow_bar").eq(0).css("left").replace("px", ""));//元素之间的间隔
                _CurSonleft = parseFloat($(".shadow_bar").eq(0).css("left").replace("px", "")) - _CurWidth;
                $(".Js_mind_nav .shadow_bar").eq(5).insertBefore($(".shadow_bar").eq(0));
                $(".shadow_bar").eq(0).css("left", _CurSonleft + "px");

                $(".shadow_box").eq(_CurShaowbarIndex + 1).fadeIn(800);
                $(".shadow_box").eq(_CurShaowbarIndex).fadeOut(800);
                $(".shadow_box").eq(_CurShaowbarIndex - 1).fadeIn(800);
                _CurPostionLeft = _CurPostionLeft + 63;
                $(".Js_mind_nav").animate({ "left": _CurPostionLeft + "%" }, "slow", "", function () {
                    _IsClick = true;
                });

            }

        });

        //右  一次跑63%

        $(".Js_right_arrow").click(function () {
            if (_IsClick) {
                _IsClick = false;
                var _CurWidth = parseFloat($(".shadow_bar").eq(1).css("left").replace("px", "") - $(".shadow_bar").eq(0).css("left").replace("px", ""));//元素之间的间隔
                _CurSonleft = parseFloat($(".shadow_bar").eq(5).css("left").replace("px", "")) + _CurWidth;

                $(".shadow_box").eq(_CurShaowbarIndex + 1).fadeOut(800);
                $(".shadow_box").eq(_CurShaowbarIndex).fadeIn(800);

                _CurPostionLeft = _CurPostionLeft - 63;
                $(".Js_mind_nav").animate({ "left": _CurPostionLeft + "%" }, "slow", "", function () {
                    $(".Js_mind_nav .shadow_bar").eq(0).insertAfter($(".shadow_bar").eq(5));
                    $(".shadow_bar").eq(5).css("left", _CurSonleft + "px");
                    _IsClick = true;
                });

            }
        });
        //*************************************************************************End********************************************************************************************

        //新浪
        $(".Js_tsina").click(function () {
            Share("tsina");
        });

        //qq微博
        $(".Js_QQwb").click(function () {

            Share("txweibo");
        });

        //人人
        $(".Js_renren").click(function () {
            Share("renren");
        });

        //开心

        $(".Js_Kaixin").click(function () {

            Share("kaixin");
        });

        //豆瓣
        $(".Js_douban").click(function () {
            Share("douban");

        });


    }

})

function Phonecheck(val) {
    if (!/^[1][3-8]\d{9}$/.test(val)) {
        return false;
    }
    else {
        return true;
    }
}



function ShowWarp(index) {
    if (index == "") {
        $(".Js_pop_box_float").hide();
        $(".Js_station_float").hide();
        $(".Js_station_float>div").hide();
    }
    else if (index < $(".Js_station_float>div").length) {

        $(".Js_pop_box_float").show();
        $(".Js_station_float").show();
        $(".Js_station_float>div").hide();
        $(".Js_station_float>div").eq(index).show();

    }
    else {
        $(".Js_pop_box_float").show();
        $(".Js_expect_float").show();
    }
}

function Share(sharetype) {


    var _title = "2015福特翼虎“无尽之旅”再次启程，让我们一起挑战无人区、探秘私房路线、齐聚趣野营……无尽可能，等你探索！" + "http://" + Cmn.Func.GetMainDomain(location.href) + "/gfx/";
    var _sharePic = "http://" + Cmn.Func.GetMainDomain(location.href) + "/gfx/images/weibo.jpg";
    var _shareOnlyUrl = "http://" + Cmn.Func.GetMainDomain(location.href) + "/";

    if (sharetype == "tsina") {
        var _SinaShare = 'http://service.weibo.com/share/share.php?title=' + encodeURIComponent(_title) + '&url=' + _shareOnlyUrl + '&source=&appkey=&pic=' + _sharePic;
        window.open(_SinaShare);
    }
    else if (sharetype == "renren") {
        var _renrenShare = 'http://s.jiathis.com/?webid=renren&title=&summary=' + encodeURIComponent(_title) + '&url=' + _shareOnlyUrl + '&pic=' + _sharePic;


        window.open(_renrenShare);
    }
    else if (sharetype == "kaixin") {

        var _kaixinShare = 'http://www.kaixin001.com/rest/records.php?webid=kaixin&title=&content= ' + encodeURIComponent(_title) + '&pic=' + _sharePic + '&starid=&aid=&style=11&t=10&url=' + _shareOnlyUrl;
        window.open(_kaixinShare);
    }
    else if (sharetype == "txweibo") {

        var _tenxunShare = "http://share.v.t.qq.com/index.php?c=share&a=index&title=  " + encodeURIComponent(_title) + "&url=" + _shareOnlyUrl + "&site=&pic=" + _sharePic;
        window.open(_tenxunShare);

    }
    else if (sharetype == "douban") {
        var _doubanShare = "http://www.douban.com/share/service?image=" + _sharePic + "&href=" + _shareOnlyUrl + "&name=" + encodeURIComponent(_title) + "&text="
        window.open(_doubanShare);

    }


}


function ShowContent(index) {
    index = parseInt(index);
    if (!isNaN(index)) {
        index = index - 1;
        $(".Js_route_nav li").eq(index).trigger("click");
    }
    else {
        alert("输入index参数!");
    }
}


function Cycle()
{

    $(".Js_strategy_bar").cycle({
        timeout: 0,
        speed: 600,
        pause: true,
        fx: 'scrollHorz',
        prev: ".Js_strategy_left_arrow",
        next: ".Js_strategy_right_arrow"

    });


    //历史回顾，图片锦集
    //var _imgObj = new Image();
    //_imgObj.src = $(".Js_strategy_bar .Jsc_strategy_nav li img").eq(0).attr("src");
    //_imgObj.onload = function () {
    //    var _width = _imgObj.width * 3;
    //    var _height = _imgObj.height * 2;

    //    $(".Jsc_strategy_nav").each(function () {
    //        $(this).css("width", _width);
    //        $(this).css("height", _height);
    //    });

      

    //}

    ////历史回顾,浮层详情轮播
    //var _imgObj2 = new Image();
    //_imgObj2.src = $(".Js_pic_nav li img").attr("src");
    //_imgObj2.onload = function () {

    //    $(".Js_pic_nav li").each(function () {
    //        $(this).css("width", _imgObj2.width);
    //        $(this).css("height", _imgObj2.height);
    //    });
      

    //}


}

function Cycle2(index) {

    $(".Js_pic_nav").cycle("destroy").cycle({
        timeout: 0,
        speed: 600,
        pause: true,
        fx: 'scrollHorz',
        prev: ".Js_pic_left_arrow",
        next: ".Js_pic_right_arrow",
        startingSlide: index
    });

    //历史回顾，图片锦集
    //var _imgObj = new Image();
    //_imgObj.src = $(".Js_strategy_bar .Jsc_strategy_nav li img").eq(0).attr("src");
    //_imgObj.onload = function () {
    //    var _width = _imgObj.width * 3;
    //    var _height = _imgObj.height * 2;

    //    $(".Jsc_strategy_nav").each(function () {
    //        $(this).css("width", _width);
    //        $(this).css("height", _height);
    //    });



    //}

    ////历史回顾,浮层详情轮播
    //var _imgObj2 = new Image();
    //_imgObj2.src = $(".Js_pic_nav li img").attr("src");
    //_imgObj2.onload = function () {

    //    $(".Js_pic_nav li").each(function () {
    //        $(this).css("width", _imgObj2.width);
    //        $(this).css("height", _imgObj2.height);
    //    });


    //}


}