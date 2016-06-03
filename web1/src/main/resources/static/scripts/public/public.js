
$.ajaxSetup({
	contentType : "application/x-www-form-urlencoded;charset=utf-8",
    complete: function(XMLHttpRequest, textStatus) {
    },
    statusCode: {
        401: function() {
            var conf=confirm('您还未登录，或者您的登录已失效。是否需要重新登录？');
            if(conf==true){
                window.location.reload();
            }
        },
        403: function() {
            alert('请求的页面不存在或没有权限访问。请联系系统管理员，错误代码：403');
        },
        404: function() {
            alert('数据获取/输入失败，没有此服务。请联系系统管理员，错误代码：404');
        },
        504: function() {
            alert('数据获取/输入失败，服务器没有响应。请联系系统管理员，错误代码：504');
        },
        500: function() {
            alert('服务器有误。请联系系统管理员，错误代码：500');
        },
	    400:function(){
		    alert(' 由于语法格式有误，服务器无法理解此请求。请联系系统管理员，错误代码：400');
	    }
    }
});


//扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2000-03-05 01:05:04"
 * 为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}
/**
 *转换当前日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2000-03-05 01:05:04"
 * 为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatNowDate(isFull) {
    return getSmpFormatDate(new Date(), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 * 为true时, 格式如"2000-03-05 01:05:04"
 * 为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDateByLong(l, isFull) {
    return getSmpFormatDate(new Date(l), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDateByLong(l, pattern) {
    return getFormatDate(new Date(l), pattern);
}
/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}


if(typeof $ =="undefined"){
	$={};
}

$.isMoney=function(x){
	var value=parseFloat(x);
	if(isNaN(value) || value>20000000.0 || value<0 || ((value+"").split(".").length==2 && (value+"").split(".")[1].length>2)){
		return false;
	}
	return true;
};

$.isPositiveNum=function(s,max){//是否为正整数
	var re = /^[0-9]*[1-9][0-9]*$/ ;
	if(re.test(s)==false){
		return false;
	}
	if(max==null || max==undefined ){
		return true;
	}
	if(parseInt(s)>max){
		return false;
	}
	return true;
};

//验证手机号
String.prototype.isMobile = function() {
	var pattern = /^(13[0-9]{9})|(14[0-9])|(18[0-9])|(15[0-9][0-9]{8})$/;
	if (!pattern.exec(this)){
		return false;
	}
	return true;
};

//验证电话
String.prototype.isTel = function() {
	return (/^(([0+]d{2,3}-)?(0d{2,3})-)(d{7,8})(-(d{3,}))?$/.test(this));
};

//邮箱验证函数
String.prototype.isEmail=function (){
	var reg=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
	return reg.test(this);
};
function trimAllText(){
	$("input:text").each(function(){
		$(this).val($.trim($(this).val()));
	});
};

$.fn.maxLength=function(){
	var maxLength=$(this).attr("maxLength");
	if(maxLength==undefined || $(this).val()==undefined){
		return true;
	}
	if($(this).val().length>maxLength){
		return false;
	}
};

$.fn.getLabel=function(){
	var parent=$(this).parent();
	if(parent.get(0).nodeName.toLowerCase()=="td"){
		return parent.prev("td").html();
	}
	return undefined;
};

$(function () {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});
