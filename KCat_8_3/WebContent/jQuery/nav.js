$(function () {

	$('#search_button').button({
		icons : {
			primary : 'ui-icon-search',	//去除图标外按钮控件的空白区域
		}
	});
	
	$('#member , #logout').hide();		//先隐藏掉登录用户名和退出用户
	
	
	if ($.cookie('user')) {	
		$('#member, #logout').show();
		$('#reg_a, #login_a').hide();
		$('#member').html($.cookie('user'));
	} else{
		$('#member, #logout').hide();
		$('#reg_a, #login_a').show();
	}
	
	$('#logout').click(function () {		//点击退出时刷新页面
		$.removeCookie('user');
		window.location.href = '/KCat_2_28/index.jsp'
	});
	
	//表单验证时的加载动画
	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().parent().find('.ui-widget-header').hide();		//将弹出框的头样式去掉
	
	$('#reg').dialog({			//用户注册弹出框
		title : 'K-Cat 用户注册',
		width : 600,
		height : 440,
		show : true,
		hide : true,
		resizable : false,
		modal : true,
		closeText : '关闭',
		autoOpen : false,
		//提交按钮
		buttons : {
			'提交' : function () {
				$(this).submit();
			}
		}
	}).buttonset().validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : '../addUser.do',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(.../images/nav/success.gif) no-repeat 20px center').html('数据新增成功...');
						
						//验证成功后，在客户端生成一个名为user的cookie文件
						$.cookie('user',$('#user').val());
						
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(.../images/nav/loading.gif) no-repeat 20px center').html('数据交互中...');
							//刷新页面，用于显示用户名
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('.reg').dialog('option', 'height', errors * 20 + 365);
			} else {
				$('.reg').dialog('option', 'height', 365);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid red');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.reg_error',
		wrapper : 'li',
		
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : '../checkUser.do',
					type : 'POST',
				},
			},
			password : {
				required : true,
				minlength : 6,
			},
			repassword : {
				required : true,
				equalTo : '#password',
			},
			email : {
				required : true,
				email : true,
			},
		},
		messages : {
			user : {
				required : '账户不得为空！',
				minlength : jQuery.format('账户长度不得小于{0}位！'),
				remote : '帐号被占用！',
			},
			password : {
				required : '密码不得为空！',
				minlength : jQuery.format('密码长度不得小于{0}位！'),
			},
			repassword : {
				required : '请确认密码！',
				equalTo : '密码不一致，请重新输入！',
			},
			email : {
				required : '邮箱不得为空！',
				email : '请输入正确的邮箱！',
			},
		},
	});
		
	$('#login').dialog({
		autoOpen : false,
		modal : true,
		resizable : false,
		width : 320,
		height : 240,
		buttons : {
			'登录' : function () {
				$(this).submit();
			}
		}
	}).validate({
	
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : '${pageContext.request.contextPath}/login.do',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#login').dialog('widget').find('button').eq(1).button('disable');
				},
				
				showErrors : function (errorMap, errorList) {
//					alert("...");
					var errors = this.numberOfInvalids();
					
					if (errors > 0) {
						$('#login').dialog('option', 'height', errors * 20 + 240);
					} else {
						$('#login').dialog('option', 'height', 240);
					}
					
					this.defaultShowErrors();
				},
				
				highlight : function (element, errorClass) {
					$(element).css('border', '1px solid #630');
					$(element).parent().find('span').html('*').removeClass('succ');
				},
				
				unhighlight : function (element, errorClass) {
					$(element).css('border', '1px solid #ccc');
					$(element).parent().find('span').html('&nbsp;').addClass('succ');
				},
			
				errorLabelContainer : 'ol.login_error',
				wrapper : 'li',
			
				rules : {
					login_user : {
						required : true,
						minlength : 2,
					},
					login_pass : {
						required : true,
						minlength : 6,
						remote : {
							url : '../login.do',
							type : 'POST',
							data : {
								login_user : function () {
									return $('#login_user').val();
								},
							},
						},
					},
				},
				messages : {
					login_user : {
						required : '帐号不得为空！',
						minlength : jQuery.format('帐号不得小于{0}位！'),
					},
					login_pass : {
						required : '密码不得为空！',
						minlength : jQuery.format('密码不得小于{0}位！'),
						remote : '帐号或密码不正确！',
					}
				},
				
				success : function (responseText, statusText) {
//					alert(responseText+":"+statusText);
					if (responseText) {
						$('#login').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(.../images/nav/success.gif) no-repeat 20px center').html('登录成功...');
						if ($('#expires').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {
								expires : 7,
							});
						} else {
							$.cookie('user', $('#login_user').val());
						}
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#login').dialog('close');
							$('#login').resetForm();
							$('#login span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(.../images/nav/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	});
	
	$('#reg_a').click(function () {
		$('.reg').dialog('open');
	});
	
	$('#login_a').click(function () {
		$('#login').dialog('open');
	});
	
	$('.reg').buttonset();
	
//	日历UI插件
	$('#date').datepicker({		//引入日历插件，中文包位置：jquery-ui-1.10.4.custom/development-bundle/ui/i18n
		changeYear : true,
		changeMonth : true,
		showOn : 'button',
		buttonImage : 'images/nav/calendar.gif',
		buttonImageOnly : true,
//		maxDate : 5,			限定最大日期			
//		minDate : -5,		限定最小日期
		hideIfNoPrevNext : true,
		yearRange : '1980 : 2020',
		yearSuffix : '',		//去掉选择时的'年'字符导致换行的情况出现
//		日期的优先级：maxDate和minDate最高，而yearRange对年份限定优先级高
	});	
	
//	工具提示功能，需要配合html页面的title属性来使用
	$('.reg input[title]').tooltip({
//		tooltipClass : 'a',  用于更改title的样式，可在css中自定义样式
		position : {
			my : 'left center',
			at : 'right+5 center',
		},
		//默认提示是淡入淡出效果，项目中应去掉
		show : false,
		hide : false,
	});
	
//	邮箱自动补全功能模块
//	var host = ['aa','aaaa','aaaaaaa','bb'];
	$('#email').autocomplete({
		delay : 0,
		autoFocus : true,
		source : function (request, response) {
			//获取用户输入的内容
			//alert(request.term);
			//绑定数据源的
			//response(['aa', 'aaaa', 'aaaaaa', 'bb']);
			
			var hosts = ['qq.com', '163.com', '263.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
				term = request.term,		//获取用户输入的内容
				name = term,				//邮箱的用户名
				host = '',					//邮箱的域名
				ix = term.indexOf('@'),		//@的位置
				result = [];				//最终呈现的邮箱列表
				
			result.push(term);
			
			//当有@的时候，重新分别用户名和域名
			if (ix > -1) {
				name = term.slice(0, ix);
				host = term.slice(ix + 1);
			}
			
			if (name) {
				//如果用户已经输入@和后面的域名，
				//那么就找到相关的域名提示，比如bnbbs@1，就提示bnbbs@163.com
				//如果用户还没有输入@或后面的域名，
				//那么就把所有的域名都提示出来
				
				var findedHosts = (host ? $.grep(hosts, function (value, index) {
						return value.indexOf(host) > -1
					}) : hosts),
					findedResult = $.map(findedHosts, function (value, index) {
					return name + '@' + value;
				});
				
				result = result.concat(findedResult);
			}
			
			response(result);
		},	
	});
	
	
});

