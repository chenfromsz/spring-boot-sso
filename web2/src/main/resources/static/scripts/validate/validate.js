/**
 * Created with JetBrains WebStorm.
 * To change this template use File | Settings | File Templates.
 * 注意！！！  必须是jquery 1.6+版本才可以用
 */
$.tool= function(options) {
    options = options || {};
    this.initialize(options);
};
//基类方法
$.extend($.tool, {
    //initialize方法用来代替构造函数
    initialize: function(options) {
        $.extend(this, options);
    }
});
$.tool.inherit= function(overrides) {
    var superClass = this;
    var subClass = function(options) {
        options = options || {};
        $.extend(this, subClass);
        this.initialize(options);
    };
    $.extend(subClass, superClass);
    $.extend(subClass, overrides);
    var p = function() { };
    p.prototype = superClass.prototype;
    subClass.prototype = new p();
    subClass.prototype.constructor = subClass;
    subClass.baseClass = superClass;
    return subClass;
};
$.validation={};
/*验证管理器*/
$.validation.validatorMgr={
    reg:function(name,type){
        this[name]=type;
    },
    cte:function(name,options){
        options=options||{};
        if(!this[name]){
            throw new Error("not found "+name+" validator!");
        }
        return new this[name](options);
    }
};
$.validation.ValidateResult = function() {
    this.result = false;
    this.msg = '';
    this.modifier = null;
    this.onModified = function(result) {
        //result is of type jQuery.ValidateResult
    };
    this.modify = function(result, msg, modifier) {
        this.result = result;
        this.msg = msg;
        this.modifier = modifier;

        if (jQuery.isFunction(this.onModified)) {
            this.onModified(this);
        }
    };
};
$.validation.Validator=$.tool.inherit({
    //验证未通过时显示的消息
    errorMsg: '',
    //下一个validator
    successor: null,

    //可验证的input类型
    acceptTypes: ['text', 'password', 'checkbox', 'radio', 'select'],

    initialize: function(options) {
        $.extend(this, options);
    },

    //可重写的验证方法
    doValidate: function(input, result) {
        this.setError(result);
    },

    //原则上不重写，模板方法
    validate: function(input, result) {
        //判断input的type是否在acceptTypes中，存在则调用验证方法
        //对于select之类的要判断tagName
        if ($.inArray($(input).prop('type').toLowerCase(), this.acceptTypes) != -1 ||
            $.inArray($(input).prop('tagName').toLowerCase(), this.acceptTypes) != -1) {
            //验证
            this.doValidate(input, result);
        }


        //如果验证通过，并且还有下一个validator，交给下一个validator
        if (result.result && this.successor) {
            this.successor.validate(input, result);
        }
    },

    //通知验证错误
    setError: function(result) {
        result.modify(false, this.errorMsg, this);
    }
});
//注册到验证管理器
$.validation.validatorMgr.reg("validator", $.Validator);
$.validation.FormValidator = function(form, options) {
    $.extend(this, {
        validators: new Array(),

        addValidator: function(validator) {
            this.validators.push(validator);
        },

        success: function() {
        },

        failure: function(errors) {
        },

        validate: function() {
            var errors = new Array();
            var result = true;

            var formValidator = $(this).data('validator');
            //使用所有的validator进行检验
            $.each(formValidator.validators, function() {
                if (!this.isValid()) {
                    result = false;
                    if (this.result.msg) {
                        errors.push(this.result.msg);
                    }
                }
            });

            //触发事件
            if (result && formValidator.success) {
                formValidator.success();
            }
            else if (formValidator.failure) {
                formValidator.failure(errors);
            }

            return result;
        },
		reset:function(){
			$.each($(this).data('validator').validators,function(){
				this.reset();
			});
		}
    });
	
    options = options || {};
    $.extend(this, options);

    //Add event to form
    $(form).bind('submit', this.validate).bind("reset",this.reset);

};
//formValidator方法
//说明:
//  为form元素绑定相应的验证事件
//参数:
//  options: 生成$.validation.FormValidator的参数
//返回:
//  可链式调用的jQuery对象
$.fn.formValidator = function(options) {
    return this.each(function() {
        var self = $(this);
        if (self.prop('tagName').toLowerCase() == 'form') {
            var validator = self.data('validator');
            if (validator) {
                $.extend(validator, options);
            }
            else {
                self.data('validator', new $.validation.FormValidator(self, options));
            }
        }
    });
};
$.fn.performValidation = function(group, onSuccess, onFailure) {
    this.doValidate = function(validators) {
        var errors = new Array();
        var result = true;

        $.each(validators, function() {
            if (!this.isValid()) {
                result = false;
                if (this.result.msg) {
                    errors.push(this.result.msg);
                }
            }
        });

        //触发事件
        if (result && onSuccess) {
            onSuccess();
        }
        else if (onFailure) {
            onFailure(errors);
        }

        return result;
    };

    var self = $(this);
    if (self.prop('tagName').toLowerCase() == 'form') {
        var validators = self.data('validator').validators;
        if (validators && validators.length > 0) {
            if (group && typeof group == 'string' && group.length > 0) {
                //对此组进行验证
                //获取所有group中的validator
                validators = $.grep(validators, function(validator) {
                    return (validator.group == group);
                });
            }
            //一一验证
            return this.doValidate(validators);
        }
    }

    //默认返回true
    return true;
};
$.validation.InputValidator= $.tool.inherit({
    //加载时显示的消息
    readyMsg: '',
    //获得焦点后显示的消息
    focusMsg: '',
    //验证通过后显示的消息
    validMsg: '',
    //控件加载时消息的css
    readyClass: 'validation-ready',
    //验证未通过时消息的css
    errorClass:'validation-error',
    //验证通过时消息的css
    focusClass: 'validation-focus',
    //获得焦点后消息的css
    validClass:'validation-valid',

    //验证组
    group: null,

    //显示消息的元素的id
    msgTarget: '',

    //待验证的input
    input: null,

    //第一个validator，用以形成责任链
    head: null,
    //最后一个validator，用以形成责任链
    tail: null,

    //添加一个validator，标准的链表操作形式
    addValidator: function(validator) {
        if (validator) {
            if (this.head) {
                this.tail.successor = validator;
                this.tail = validator;
            }
            else {
                this.head = validator;
                this.tail = validator;
            }
        }
    },

    //验证是否通过
    isValid: function() {
        if (!this.result.result) {
            this.validate();
        }
        return this.result.result;
    },

    onError: function(input, msgTarget, cssClass, msg) { },
    onValid: function(input, msgTarget, cssClass, msg) { },
    onReady: function(input, msgTarget, cssClass, msg) { },
    onFocus: function(input, msgTarget, cssClass, msg) { },

    //验证input
    validate: function() {
        //先设验证通过
        this.result.modify(true, this.validMsg, this);

        if (this.head) {
            this.head.validate(this.input, this.result);
        }
    },
	reset:function(){
		//重新初始化验证期结果
		this.result = new $.validation.ValidateResult();
		var self=this;
        this.result.onModified = function(result) {
            //根据验证结果显示不同的内容
            if (result.result) {
                self.onValid(self.input, self.msgTarget, self.validClass, self.validMsg);
            }
            else {
                self.onError(self.input, self.msgTarget, self.errorClass, result.msg);
            }
        };
		//恢复为ready状态
		this.onReady(this.input, this.msgTarget, this.readyClass, this.readyMsg);
	},
    initialize: function(options) {
        options = options || {};

        $.extend(this, options);
        if(typeof this.msgTarget=="string"){
        	this.msgTarget = $('#' + this.msgTarget);
        }

        //如果没有待验证的input元素则返回
        if (!this.input) {
            return;
        }

        //保持this指针的引用
        var self = this;
        //初始化ValidateResult
        this.result = new $.validation.ValidateResult();
        this.result.onModified = function(result) {
            //根据验证结果显示不同的内容
            if (result.result) {
                self.onValid(self.input, self.msgTarget, self.validClass, self.validMsg);
            }
            else {
                self.onError(self.input, self.msgTarget, self.errorClass, result.msg);
            }
        };

        //注册事件
        //这样注册会导致ajax验证的时候连续触发change和blur事件，需要2次请求服务器，很麻烦
        $(this.input).bind('change', function() {
            self.validate();
        }).bind('focus', function() {
                if (!self.isValid()) {
                    self.onFocus(self.input, self.msgTarget, self.focusClass, self.focusMsg);
                }
            }).bind('blur', function() {
                if (self.isValid()) {
                    self.onValid(self.input, self.msgTarget, self.validClass, self.validMsg);
                }
                else {
                    self.onError(self.input, self.msgTarget, self.errorClass, self.result.msg);
                }
            });
        this.onReady(this.input, this.msgTarget, this.readyClass, this.readyMsg);
    }
});
//默认的消息显示方案
$.extend($.validation.InputValidator, {
    //显示消息
    showMsg: function(css, msg) {
    	var cssArray=[this.readyClass,this.errorClass,this.focusClass,this.validClass];
        this.getTargetEl().removeClass(cssArray.join(" ")).addClass(css).html(msg);
    },

    //获取显示消息用的元素
    getTargetEl: function() {
        if (!this.msgTarget || this.msgTarget == '') {
            return $('#' + $(this.input).attr('id') + 'Tip');
        }
        else {
            return this.msgTarget;
        }
    },
	onReset: function(input, msgTarget, cssClass, msg){
		this.showMsg(cssClass,"");
	},
    onError: function(input, msgTarget, cssClass, msg) {
        this.showMsg(cssClass, msg);
    },
    onValid: function(input, msgTarget, cssClass, msg) {
        this.showMsg(cssClass, msg);
    },
    onReady: function(input, msgTarget, cssClass, msg) {
        this.showMsg(cssClass, msg);
    },
    onFocus: function(input, msgTarget, cssClass, msg) {
        this.showMsg(cssClass, msg);
    }
});
$.fn.initValidator=$.fn.i = function(options,ex) {
    return this.each(function() {
        var form = $(this.form);
        var formValidator = form.data('validator');
        
        if (!formValidator) {
            //初始化一个空的FormValidator
          //  form.formValidator({});
        	throw new Error($(this).get().outerHTML +" in form not init!");
        }

        options['input'] = this;
        $.extend(options,ex||{});
        var validator = new $.validation.InputValidator(options);
        formValidator.addValidator(validator);
        $(this).data('validator', validator);
    });
};
//重置 验证dom的验证状态，重置后状态变为ready状态
$.fn.resetValidate=function(){
	return this.each(function(){
		var validator=$(this).data("validator");
		if(validator){
			validator.reset();
		}
	});
};
$.fn.addValidator =$.fn.a= function(rule, options) {
    return this.each(function() {
        var validator = $(this).data('validator');

        if (validator) {
            validator.addValidator($.validation.validatorMgr.cte(rule, options));
        }
    });
} ;

//Required
$.validation.RequiredValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if (!value || !value.length > 0) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('required', $.validation.RequiredValidator);

//Length
$.validation.LengthValidator =$.validation.Validator.inherit({
    min: 0,
    max: 0,
    getMin: function() {
        return this.min || this.min >= 0 ? this.min : 0;
    },

    getMax: function() {
        return this.max || this.max >= 0 ? this.max : 0;
    },

    doValidate: function(input, result) {
        var value = $(input).val();
        if (!value || value.length < this.getMin() || value.length > this.getMax()) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('length', $.validation.LengthValidator);

//Regex
$.validation.RegexValidator =$.validation.Validator.inherit({
    acceptTypes: ['text', 'password'],

    regex: '',

    getRegex: function() {
        return new RegExp(this.regex || '');
    },

    doValidate: function(input, result) {
        var regex = this.getRegex();
        if (!regex.test($(input).val())) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('regex', $.validation.RegexValidator);

//phone
$.validation.PhoneValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('phone', $.validation.PhoneValidator);

//email
$.validation.EmailValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('email', $.validation.EmailValidator);

//integer
$.validation.IntegerValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^[\-\+]?\d+$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('integer', $.validation.IntegerValidator);

//number
$.validation.NumberValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('number', $.validation.NumberValidator);

//date(yyyy-mm-dd)
$.validation.DateValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('date', $.validation.DateValidator);

//ipv4
$.validation.IPV4Validator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('ipv4', $.validation.IPV4Validator);

//url
$.validation.UrlValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('url', $.validation.UrlValidator);

//nospace
$.validation.NoSpaceValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^[^\s]*$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('nospace', $.validation.NoSpaceValidator);

//chinese
$.validation.ChineseValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^[\u4E00-\u9FA5]+$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('chinese', $.validation.ChineseValidator);

//idcard
$.validation.IDCardValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$)/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('idcard', $.validation.IDCardValidator);

//username
$.validation.UsernameValidator =$.validation.Validator.inherit({
    doValidate: function(input, result) {
        var value = $(input).val();
        if(value==""){
        	return;
        }
        if (!/^[a-zA-Z_][\w]{2,13}$/.test(value)) {
            this.setError(result);
        }
    }
});
$.validation.validatorMgr.reg('idcard', $.validation.UsernameValidator);

//Value
$.validation.ValueValidator =$.validation.Validator.inherit({
    not: null,

    accept: null,

    doValidate: function(input, result) {
        var val = $(input).val();
        if (this.accept && typeof this.accept == 'string' &&
            val != this.accept) {
            this.setError(result);
        }
        else if (this.accept && typeof this.accept == 'object' &&
            this.accept.length && this.accept.length > 0 &&
            $.inArray(val, this.accept) == -1) {
            this.setError(result);
        }
        else if (this.not && typeof this.not == 'string' &&
            val == this.not) {
            this.setError(result);
        }
        else if (this.not && typeof this.not == 'object' &&
            this.not.length && this.not.length > 0 &&
            $.inArray(val, this.not) != -1) {
            this.setError(result);
        }
    }
});

$.validation.validatorMgr.reg('value', $.validation.ValueValidator);
//相同验证期，一般用于两次输入密码相同
$.validation.EqualsValidator=$.validation.Validator.inherit({
	equalsTo:'',
	doValidate:function(input, result){
		if($(input).val()!=$(this.equalsTo).val()){
			this.setError(result);
		}
	}
});
$.validation.validatorMgr.reg('equals', $.validation.EqualsValidator);