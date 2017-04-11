$(function(){
    $('#login').on('click', function(e){
	e.preventDefault();
    
	$.jAlert({
		'title': 'Login',
		'content': '<form action=""><label for="username">用户名：</label><input type="text" class="form-control" id="username" name="username" placeholder="请输入用户名." required><label for="password">密码：</label><input type="password" class="form-control" name="password" id="password" placeholder="请输入密码." required></form><br>',
        'theme': 'blue',
		'onOpen': function(alert){
            alert.find('form').on('submit', function(e){
                e.preventDefault();
            });
		},
		'btns': [
            { 
                'text': '登录',
                'theme': 'green',
                'closeAlert': false,
                'onClick': function(e){
                    e.preventDefault();
                    var btn = $('#'+this.id),
                    alert = btn.parents('.jAlert'),
                    form = alert.find('form'),
                    email = form.find('input[name="username"]').val(),
                    pass = form.find('input[name="password"]').val();
                    /* Verify required fields, validate data */
                    if( typeof username == 'undefined' || username == '' )
                    {
                        $.jAlert({
                            'content':'请输入用户名!'
                        })
                        return;
                    }
                    if( typeof pass == 'undefined' || pass == '' )
                    {
                        $.jAlert({
                            'content':'请输入密码!'
                        })
                        return;
                    }
                    var data = form.serialize()
                    $.post('/user/login', data, function(res){
                        if(res.code == 'success'){
                            alert.closeAlert();
                            window.location.href = '/';
                        }else{
                            $.jAlert({
                                'content':res.message
                            })
                        }
                    })
                    return false;
                }
            },
            {
                'text': '注册',
                'theme': 'green',
                'onClick': function(e){
                    $.jAlert({
                        'title': '注册',
                        'content': '<form action="/user/register" method="POST" role="form" class="register"><label for="username"  data-toggle="tooltip">用户名：</label><input type="text" class="form-control" id="username" name="username" placeholder="请输入用户名." required> <label for="petname">昵称：</label><input type="text" class="form-control" id="petname" name="petname" placeholder="请输入昵称." required><label for="petname">邮箱：</label><input type="email" class="form-control" id="email" name="email" placeholder="请输入邮箱." required><label for="password">密码：</label><input type="password" class="form-control" name="password" id="password" placeholder="请输入密码." required><label for="repassword">确认密码：</label><input type="password" class="form-control" id="repassword" placeholder="请输入密码." required></form>',
                        'onOpen':function(alert){
                            alert.find('form').on('submit', function(e){
                                e.preventDefault();
                            });
                        },
                        'btns': [
                            {
                                'text': '注册',
                                'theme': 'green',
                                'closeAlert': false,
                                'onClick': function(e, btn){
                                    e.preventDefault();
                                    var btn = $('#'+this.id),
                                    alert = btn.parents('.jAlert'),
                                    form = alert.find('form'),
                                    username = form.find('input[name="username"]').val(),
                                    petname = form.find('input[name="petname"]').val(),
                                    email = form.find('input[name="email"]').val(),
                                    pass = form.find('input[type="password"]').map(function(){
                                        return $(this).val()
                                    });
                                    if( typeof username == 'undefined' || username == '' )
                                    {
                                        $.jAlert({
                                            'content':'请输入用户名!'
                                        })
                                        return;
                                    }
                                    if( typeof petname == 'undefined' || petname == '' )
                                    {
                                        $.jAlert({
                                            'content':'请输入昵称!'
                                        })
                                        return;
                                    }
                                    if( typeof email == 'undefined' || email == '' )
                                    {
                                        $.jAlert({
                                            'content':'请输入email!'
                                        })
                                        return;
                                    }
                                    if( typeof pass == 'undefined' || pass == '' )
                                    {
                                        $.jAlert({
                                            'content':'请输入密码'
                                        })
                                        return;
                                    }
                                    if(pass[0] == pass[1]){
                                        var data = form.serialize()
                                        $.post('/user/register', data, function(res){
                                            console.log(res)
                                            if(res.code == "success"){
                                                $.jAlert({
                                                    'content':'注册成功'
                                                })
                                                alert.closeAlert();
                                            }else{
                                                $.jAlert({
                                                    'content':res.message
                                                })
                                            }
                                        })
                                    }
                                    else{
                                        $.jAlert({
                                            'content':'密码不一致'
                                        })
                                        return;
                                    }
                                    return false;
                                }
                            },
                            {
                                'text': '关闭',
                                'theme': 'green',
                                'onClick': function(e, btn){
                                    return;
                                }
                            }
                        ]
                    });
                }
            }
		]
	});
    return false;
});
})
