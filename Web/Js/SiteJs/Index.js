/// <reference path="CmnSite.js" />

//首页业务逻辑 此处名称可以和页面对应起来 也可以和场景ID对应
(Index = new function () {
    /// <summary>首页业务逻辑</summary>

    SiteFunc.Share("设置网站默认分享");

    //获取随机数
    var _random = SiteFunc.GetRandom();

    //调用测试检测
    SiteFunc.Testing("进入首页场景");


})