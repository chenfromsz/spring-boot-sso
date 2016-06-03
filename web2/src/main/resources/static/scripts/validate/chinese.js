
jQuery.extend(jQuery.validator.messages, {
  required: "该项为必输入项.",
  remote: "请修正该字段.",
  email: "请输入有效的邮件地址,如 username@example.com.",
  url: "请输入有效的URL地址.",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
  minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
  rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
  range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
  min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});
//验证时间
jQuery.validator.methods.compareDate3 = function(value, element, param) {
	
	var startDate = jQuery(param).val();  
	if(element==''||startDate==''){
		return true
	}
	var date1 = new Date(Date.parse(startDate.replace("-", "/").replace("-", "/")));
	var date2 = new Date(Date.parse(value.replace("-", "/").replace("-", "/")));
	return date1 <= date2;
};
jQuery.validator.methods.compareDate1 = function(value, element, param) {
    var startDate = jQuery(param).val();  
    var date1 = new Date(Date.parse(startDate.replace("-", "/").replace("-", "/")));
    var date2 = new Date(Date.parse(value.replace("-", "/").replace("-", "/")));
    return date1 <= date2;
};
//验证时间
jQuery.validator.methods.compareDate2 = function(value, element,param) {
	var strs= new Array();
	strs=param.split(',');
	var startDate1 = jQuery(strs[0]).val();  
	var startDate2 = jQuery(strs[1]).val();  
	var date1 = new Date(Date.parse(startDate1.replace("-", "/").replace("-", "/")));
	var date3 = new Date(Date.parse(startDate2.replace("-", "/").replace("-", "/")));
	var date2 = new Date(Date.parse(value.replace("-", "/").replace("-", "/")));
	return date1 <= date2 && date3 <= date2;
};

$('.error').live('mouseover',function(){
	var error=$(this).attr('data');	
	var tip=new tooltip($(this),error);
});  
//验证商圈
 jQuery.validator.addMethod("circleCheck", function(value, element) {
	 var len=0;
	 $('.circle').each(function(i,e){
		 if(e.value!=''&&e.value!=null){
			 len++;
		 }
	 });
	 $('.circle').parent('div').css({'border':len==0?'1px dotted red':'1px solid #cdcdcd'});
     return len>0;       
 }, "请选择门店所属的商圈");     
 //验证商家类型
 jQuery.validator.addMethod("sortCheck", function(value, element) {
	 var len=0;
	 $('.sort').each(function(i,e){
		 if(e.value!=''&&e.value!=null){
			 len++;
		 }
	 });
	 $('.sort').parent('div').css({'border':len==0?'1px dotted red':'1px solid #cdcdcd'});
	 return len>0;       
 }, "请选择门店所属商家类型");     
 //验证SELECT选择框必选项
 jQuery.validator.addMethod("selectRequired", function(value, element) {
	 $(element).parent('div').css({'border':value==null||value==''?'1px dotted red':'1px solid #cdcdcd'});
	 return value!=null&&value!='';      
 }, "该项为必输入项");  
 // 判断上传图片不能为空
 jQuery.validator.addMethod("isImageEmpty", function(value, element) {
	 $(element).parents('.uploadImg').css({'border':value==null||value==''?'2px dashed red':'2px dashed #e4e4e4'});
	 var v=$.trim(value)
	 return v.length>5;       
 }, "请上传一张图片！"); 
 
 // 判断整数value是否等于0 
 jQuery.validator.addMethod("isIntEqZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value==0;       
 }, "整数必须为0"); 
   
 // 判断整数value是否大于0
 jQuery.validator.addMethod("isIntGtZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value>0;       
 }, "整数必须大于0"); 
   
 // 判断整数value是否大于或等于0
 jQuery.validator.addMethod("isIntGteZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value>=0;       
 }, "整数必须大于或等于0");   
 
 // 判断整数value是否不等于0 
 jQuery.validator.addMethod("isIntNEqZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value!=0;       
 }, "整数必须不等于0");  
 
 // 判断整数value是否小于0 
 jQuery.validator.addMethod("isIntLtZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value<0;       
 }, "整数必须小于0");  
 
 // 判断整数value是否小于或等于0 
 jQuery.validator.addMethod("isIntLteZero", function(value, element) { 
      value=parseInt(value);      
      return this.optional(element) || value<=0;       
 }, "整数必须小于或等于0");  
 
 // 判断浮点数value是否等于0 
 jQuery.validator.addMethod("isFloatEqZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value==0;       
 }, "浮点数必须为0"); 
   
 // 判断浮点数value是否大于0
 jQuery.validator.addMethod("isFloatGtZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value>0;       
 }, "浮点数必须大于0"); 
 // 判断是否输入的是金钱
 jQuery.validator.addMethod("isMoney", function(value, element) { 
	 value=parseFloat(value);    
	 return (this.optional(element) || value>0)&&/^(([0-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$ /.test(value);       
 }, "请输入正确的金钱，如：2.50"); 
   
 // 判断浮点数value是否大于或等于0
 jQuery.validator.addMethod("isFloatGteZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value>=0;       
 }, "浮点数必须大于或等于0");   
 
 // 判断浮点数value是否不等于0 
 jQuery.validator.addMethod("isFloatNEqZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value!=0;       
 }, "浮点数必须不等于0");  
 
 // 判断浮点数value是否小于0 
 jQuery.validator.addMethod("isFloatLtZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value<0;       
 }, "浮点数必须小于0");  
 
 // 判断浮点数value是否小于或等于0 
 jQuery.validator.addMethod("isFloatLteZero", function(value, element) { 
      value=parseFloat(value);      
      return this.optional(element) || value<=0;       
 }, "浮点数必须小于或等于0");  
 
 // 判断浮点型  
 jQuery.validator.addMethod("isFloat", function(value, element) {       
      return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
 }, "只能包含数字、小数点等字符"); 
  
 // 匹配integer
 jQuery.validator.addMethod("isInteger", function(value, element) {       
      return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value)>=0);       
 }, "匹配integer");  
  
 // 判断数值类型，包括整数和浮点数
 jQuery.validator.addMethod("isNumber", function(value, element) {       
      return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
 }, "匹配数值类型，包括整数和浮点数");  
 
 // 只能输入[0-9]数字
 jQuery.validator.addMethod("isDigits", function(value, element) {       
      return this.optional(element) || /^\d+$/.test(value);       
 }, "只能输入0-9数字");  
 
 // 判断中文字符 
 jQuery.validator.addMethod("isChinese", function(value, element) {       
      return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
 }, "只能包含中文字符。");   

 // 判断英文字符 
 jQuery.validator.addMethod("isEnglish", function(value, element) {       
      return this.optional(element) || /^[A-Za-z]+$/.test(value);       
 }, "只能包含英文字符。");   

  // 手机号码验证    
 jQuery.validator.addMethod("isMobile", function(value, element) {    
   var length = value.length;    
   return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));    
 }, "请正确填写您的手机号码。");

 // 电话号码验证    
 jQuery.validator.addMethod("isPhone", function(value, element) {    
   var tel = /^(\d{3,4}-?)?\d{7,9}$/g;    
   return this.optional(element) || (tel.test(value));    
 }, "请输入正确的电话号码,如:010-29392929.");
 // 传真号码验证    
 jQuery.validator.addMethod("isFax", function(value, element) {    
	 var tel = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/g;    
	 return this.optional(element) || (tel.test(value));    
 }, "请输入有效的传真地址.如：+123 -999 999.");

 // 联系电话(手机/电话皆可)验证   
 jQuery.validator.addMethod("isTel", function(value,element) {   
     var length = value.length;   
     var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;   
     var tel = /^(\d{3,4}-?)?\d{7,9}$/g;       
     return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));   
 }, "请正确填写您的联系方式"); 

  // 匹配qq      
 jQuery.validator.addMethod("isQq", function(value, element) {       
      return this.optional(element) || /^[1-9]\d{4,12}$/;       
 }, "匹配QQ");   

  // 邮政编码验证    
 jQuery.validator.addMethod("isZipCode", function(value, element) {    
   var zip = /^[0-9]{6}$/;    
   return this.optional(element) || (zip.test(value));    
 }, "请正确填写您的邮政编码。");  
 
 // 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。      
 jQuery.validator.addMethod("isPwd", function(value, element) {       
      return this.optional(element) || /^[a-zA-Z]\\w{6,12}$/.test(value);       
 }, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");  
 
 // 身份证号码验证
 jQuery.validator.addMethod("isIdCardNo", function(value, element) { 
   //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;   
   return this.optional(element) || isIdCardNo(value);    
 }, "请输入正确的身份证号码。"); 

 // IP地址验证   
 jQuery.validator.addMethod("ip", function(value, element) {    
   return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);    
 }, "请填写正确的IP地址。");

 // 字符验证，只能包含中文、英文、数字、下划线等字符。    
 jQuery.validator.addMethod("stringCheck", function(value, element) {       
      return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);       
 }, "只能包含中文、英文、数字、下划线等字符");   

 // 匹配english  
 jQuery.validator.addMethod("isEnglish", function(value, element) {       
      return this.optional(element) || /^[A-Za-z]+$/.test(value);       
 }, "匹配english");   
 
 // 匹配汉字  
 jQuery.validator.addMethod("isChinese", function(value, element) {       
      return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);       
 }, "匹配汉字");   
 
 // 匹配中文(包括汉字和字符) 
 jQuery.validator.addMethod("isChineseChar", function(value, element) {       
      return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
 }, "匹配中文(包括汉字和字符) "); 
   
 // 判断是否为合法字符(a-zA-Z0-9-_)
 jQuery.validator.addMethod("isRightfulString", function(value, element) {       
      return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);       
 }, "判断是否为合法字符(a-zA-Z0-9-_)");   
 
 // 判断是否包含中英文特殊字符，除英文"-_"字符外
 jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {  
      var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);   
      return this.optional(element) || !reg.test(value);       
 }, "含有中英文特殊字符");   
//过滤特殊字符串
 jQuery.validator.addMethod("filterChar", function(value, element, param) {
	 var reg = RegExp(param[0]);   
     return this.optional(element) || !reg.test(value);   
 }, $.validator.format("含有非法特殊字符{1}"));

 //身份证号码的验证规则
 function isIdCardNo(num){ 
	 var len = num.length, re; 
	  if (len == 15){
		  re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/); 
	  }else if (len == 18){
		  re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/); 
	  }else{
		  return false;
	  }
	 var a = num.match(re); 
	 if (a != null) {
		 if (len==15) { 
			 var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]); 
			 var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
		 }else{ 
			 var D = new Date(a[3]+"/"+a[4]+"/"+a[5]); 
			 var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
		 } 
		 if (!B) {
	         //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。"); 
	         return false;
	     } 
	 }
	 if(!re.test(num)){
	      return false;
	 }	 
	  return true; 
 } 
 
var tooltip=function(ele,txt){
	var pos=$(ele).offset();
    var pos_x=eval(pos.left)+30;
    var pos_y=eval(pos.top)-20;
    pos_x=pos_x.toString();
    pos_x=pos_x+'px';
    pos_y.toString();
    pos_y=pos_y+'px';    
	var tooltipString = ''+
	'<div class="hi-tooltip">' +
		'<div class="xtop">' +
			'<div class="xb1" style="background-color: rgb(204, 153, 102);"></div>' +
			'<div class="xb2" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
			'<div class="xb3" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
			'<div class="xb4" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
		'</div>' +
		'<div class="xboxcontent" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153); color: rgb(0, 0, 0); text-shadow: 2px 2px 0pt rgb(255, 255, 255);">'+
			txt +
		'</div>' +
		'<div class="xbottom">' +
			'<div class="xb4" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
			'<div class="xb3" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
			'<div class="xb2" style="border-color: rgb(204, 153, 102); background-color: rgb(255, 204, 153);"></div>' +
			'<div class="xb1" style="background-color: rgb(204, 153, 102);"></div>' +
		'</div>' +
	'</div>'
    var tip=$(tooltipString);
    $('body').append(tip);    
    $('.hi-tooltip').css({"top":pos_y,"left":pos_x});
    $(ele).live('mouseout',function(){
    	 $('.hi-tooltip').remove();
    });
    $(ele).live('focus',function(){
    	 $('.hi-tooltip').remove();
    });
    tip.close=function(){
    	tip.remove();
    }
    return tip;
};