/**
 * Created by Re on 2018/2/25.
 */
function view() {
    return{
        w:document.documentElement.clientWidth,
        h:document.documentElement.clientHeight
    }
}//获取body高度和宽度

function $(id) {
    return document.getElementById(id)
}//获取id

function bind(obj,eve,fn) {
    if(obj.addEventListener){
        obj.addEventListener(eve,fn,false)
    }
    else{
        obj.attachEvent("on"+eve,function () {
            fn.call(obj);
        })
    }
}//兼容 添加事件监听器

function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}//添加类

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}//移除类


function fnLoad()
{
    var iTime=new Date().getTime();
    var oW=$("welcome");
    var bImgLoad=true;
    var bTime=false;
    var oTimer=0;
    bind(oW,"webkitTransitionEnd",end);
    bind(oW,"transitionend",end);
    oTimer=setInterval(function(){
        if(new Date().getTime()-iTime>=5000)
        {
            bTime=true;
        }
        if(bImgLoad&&bTime)
        {
            clearInterval(oTimer);
            oW.style.opacity=0;
        }
    },1000);
    function end()
    {
        removeClass(oW,"pageShow");
        fnTab();
    }

}/*打开网页加载*/

function fnTab()
{
    var oTab=$("tabPic");
    var oList=$("picList");
    var aNav=oTab.getElementsByTagName("nav")[0].children;
    var iNow=0;
    var iX=0;
    var iW=view().w;
    var oTimer=0;
    var iStartTouchX=0;
    var iStartX=0;
    bind(oTab,"touchstart",fnStart);
    bind(oTab,"touchmove",fnMove);
    bind(oTab,"touchend",fnEnd);
    auto();
    if(!window.BfnScore)
    {
        fnScore();
        window.BfnScore=true;
    }/*判断条件  只加载一次*/
    function auto()
    {
        oTimer=setInterval(function(){
            iNow++;
            iNow=iNow%aNav.length;
            tab();
        },2000);
    }/*定时器*/
    function fnStart(ev)
    {
        oList.style.transition="none";
        ev=ev.changedTouches[0];
        iStartTouchX=ev.pageX;
        iStartX=iX;
        clearInterval(oTimer);
    }/*touchstart事件*/
    function fnMove(ev)
    {
        ev=ev.changedTouches[0];
        var iDis=ev.pageX-iStartTouchX;
        iX=iStartX+iDis;
        oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
    }/*touchmove触摸移动事件*/
    function fnEnd()
    {
        iNow=iX/iW;
        iNow=-Math.round(iNow);
        if(iNow<0)
        {
            iNow=0;
        }
        if(iNow>aNav.length-1)
        {
            iNow=aNav.length-1;
        }
        tab();
        auto();
    }/*touchend事件*/
    function tab()
    {
        iX=-iNow*iW;
        oList.style.transition="0.5s";
        oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
        for(var i=0;i<aNav.length;i++)
        {
            removeClass(aNav[i],"active");
        }
        addClass(aNav[iNow],"active");
    }
}
function fnScore()
{
    var oScore=$("score");
    var aLi=oScore.getElementsByTagName("li");
    var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
    for(var i=0;i<aLi.length;i++)
    {
        fn(aLi[i]);
    }
    function fn(oLi)
    {
        var aNav=oLi.getElementsByTagName("a");
        var oInput=oLi.getElementsByTagName("input")[0];
        for(var i=0;i<aNav.length;i++)
        {
            aNav[i].index=i;
            bind(aNav[i],"touchstart",function(){
                for(var i=0;i<aNav.length;i++)
                {
                    if(i<=this.index)
                    {
                        addClass(aNav[i],"active");
                    }
                    else
                    {
                        removeClass(aNav[i],"active");
                    }
                }
                oInput.value=arr[this.index];
            });
        }
    }

    fnIndex();
}
/*评分*/
function fnInfo(oInfo,sInfo)
{
    oInfo.innerHTML=sInfo;
    oInfo.style.WebkitTransform="scale(1)";
    oInfo.style.opacity=1;
    setTimeout(function(){
        oInfo.style.WebkitTransform="scale(0)";
        oInfo.style.opacity=0;
    },1000);
}/*弹出框*/
function fnIndex()
{
    var oIndex=$("index");
    var oBtn=oIndex.getElementsByClassName("btn")[0];
    var oInfo=oIndex.getElementsByClassName("info")[0];
    var bScore=false;
    bind(oBtn,"touchend",fnEnd);
    function fnEnd()
    {
        bScore=fnScoreChecked();
        if(bScore)
        {
            if(bTag())
            {
                fnIndexOut();
            }
            else
            {
                fnInfo(oInfo,"给景区添加标签");
            }
        }
        else
        {
            fnInfo(oInfo,"给景区评分");
        }
    }
    function fnScoreChecked()
    {
        var oScore=$("score");
        var aInput=oScore.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++)
        {
            if(aInput[i].value==0)
            {
                return false;
            }
        }
        return true;
    }
    function bTag()
    {
        var oTag=$("indexTag");
        var aInput=oTag.getElementsByTagName("input");
        for(var i=0;i<aInput.length;i++)
        {
            if(aInput[i].checked)
            {
                return true;
            }
        }
        return false;
    }
}
function fnIndexOut()
{
    var oMask=$("mask");
    var oIndex=$("index");
    var oNew=$("news");
    addClass(oMask,"pageShow");
    addClass(oNew,"pageShow");
    fnNews();
    setTimeout(function(){
        oMask.style.opacity=1;
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";
    },14);
    setTimeout(function(){
        oNew.style.transition="0.5s";
        oMask.style.opacity=0;
        oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
        oNew.style.opacity=1;
        removeClass(oMask,"pageShow");
    },3000);
}/*index移除*/
function fnNews()
{
    var oNews=$("news");
    var oInfo=oNews.getElementsByClassName("info")[0];
    var aInput=oNews.getElementsByTagName("input");
    aInput[0].onchange=function()
    {
        if(this.files[0].type.split("/")[0]=="video")
        {
            fnNewsOut();
            this.value="";
        }
        else
        {
            fnInfo(oInfo,"请上传视频");
        }
    };
    aInput[1].onchange=function()
    {
        if(this.files[0].type.split("/")[0]=="image")
        {
            fnNewsOut();
            this.value="";
        }
        else
        {
            fnInfo(oInfo,"请上传图片");
        }
    };
}/*新闻页*/
function fnNewsOut()
{
    var oNews=$("news");
    var oForm=$("form");
    addClass(oForm,"pageShow");
    oNews.style.cssText="";
    removeClass(oNews,"pageShow");
    formIn();
}
function formIn()
{
    var oForm=$("form");
    var oOver=$("over");
    var aFormTag=$("formTag").getElementsByTagName("label");
    var oBtn=oForm.getElementsByClassName("btn")[0];
    var bOff=false;
    for(var i=0;i<aFormTag.length;i++)
    {
        bind(aFormTag[i],"touchend",function(){
            bOff=true;
            addClass(oBtn,"submit");
        });
    }
    bind(oBtn,"touchend",function(){
        if(bOff)
        {
            for(var i=0;i<aFormTag.length;i++)
            {
                aFormTag[i].getElementsByTagName("input")[0].checked=false;
            }
            bOff=false;
            addClass(oOver,"pageShow");
            removeClass(oForm,"pageShow");
            removeClass(oBtn,"submit");
            over();
        }
    });
}/*表单页*/
function over()
{
    var oOver=$("over");
    var oBtn=oOver.getElementsByClassName("btn")[0];
    bind(oBtn,"touchend",function()
    {
        removeClass(oOver,"pageShow");
    });
}