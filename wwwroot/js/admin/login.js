// 页面加载调用函数
$(function(){
    // 输入框获得焦点隐藏错误信息
    $('input').on('focus',function(){
        $('.loginerr').hide('normal')
    })
    // 检查是否记住密码
    if($.cookie('remberPass') == 'true'){
        $('#checkbox').attr('checked',true);
        $('#username').val($.cookie("userName"));
        $('#password').val($.cookie("passWord"));
    }
    // 判断有没有错误信息
    if($('.loginmsg').text()){
        $('.loginmsg').parent().show('normal');
    }
})

$('form').submit(function(ev){
    ev.preventDefault()
    var data = $(this).serialize()
    remberPass()
    $.post('/admin/login', data, function(res){
        console.log(res.code)
        if(res.code == 'success'){
            window.location.href = '/admin';
        }else{
            $('.loginmsg').html(res.message).parent().show('normal');
        }
    })
})

function remberPass(){
    // 记住密码功能
    if($('#checkbox').is(':checked')){
        var username = $('#username').val();
        var password = $('#password').val();
        $.cookie("remberPass", "true", { expires: 7 }); // 存储一个带7天期限的 cookie 
        $.cookie("userName", username, { expires: 7 }); // 存储一个带7天期限的 cookie 
        $.cookie("passWord", username, { expires: 7 }); // 存储一个带7天期限的 cookie 
    }else{
        $.cookie("remberPass", "false", { expires: -1 });
        $.cookie("userName", '', { expires: -1 });
        $.cookie("passWord", '', { expires: -1 });
    }
}