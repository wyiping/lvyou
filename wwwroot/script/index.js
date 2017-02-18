// 隐藏警告信息
$(function(){
    $('input').on('focus',function(){
        $('.alert').hide('normal')
    })
})

$('#register form').submit(function(ev){
    ev.preventDefault()
    
    var pass = $(':password').map(function(){
        return $(this).val()
    })
    if(pass[1] == pass[2]){
        var data = $(this).serialize()
        $.post('/user/register', data, function(res){
            console.log(res)
            if(res.code == "success"){
                alert('注册成功')
            }else{
                alert(res.message)
            }
        })
    }
    else{
        alert('密码不一致')
    }
})

$('#login form').submit(function(ev){
    ev.preventDefault()
    var data = $(this).serialize()
    console.log(data)
    $.post('/user/login', data, function(res){
        console.log(res.code)
        if(res.code == 'success'){

        }else{
            $('#login-message').html(res.message).show('normal');
        }
    })
    
})