$(document).ready(function(){
	///// 显示或隐藏用户信息 ///// 
	$('.userinfo').click(function(){
		if(!$(this).hasClass('active')) {
			$('.userinfodrop').show();
			$(this).addClass('active');
		} else {
			$('.userinfodrop').hide();
			$(this).removeClass('active');
		}
		return false;
	});

	// 点击菜单	
	$('.vernav2 > ul li a').each(function(){
		var url = $(this).attr('href');
		$(this).click(function(){
			if($(url).length > 0) {
				if($(url).is(':visible')) {
					if(!$(this).parents('div').hasClass('menucoll') &&
						!$(this).parents('div').hasClass('menucoll2'))
							$(url).slideUp();
				} else {
					$('.vernav2 ul ul').each(function(){
							$(this).slideUp();
					});
					if(!$(this).parents('div').hasClass('menucoll') &&
						!$(this).parents('div').hasClass('menucoll2'))
							$(url).slideDown();
				}
				return false;	
			}
		});
	});

	// 折叠状态下鼠标滑动到菜单
	$('.vernav2 > ul > li > a').mouseenter(function(){
		if($(this).parent().parent().parent().hasClass('menucoll2')){
			$(this).parent().siblings().removeClass('hover').find('ul').hide();
			$(this).parent().addClass('hover').find('ul').show().mouseleave(function(){
				$(this).hide().parent().removeClass('hover');
			})	
		}
		}).mouseleave(function(){
			if($(this).parent().parent().parent().hasClass('menucoll2')){
				$(this).parent().siblings().removeClass('hover').find('ul').hide();
			}
		});

	///// HORIZONTAL NAVIGATION (AJAX/INLINE DATA) /////	
	$('.hornav a').click(function(){
		
		//this is only applicable when window size below 450px
		if($(this).parents('.more').length == 0)
			$('.hornav li.more ul').hide();
		
		//remove current menu
		$('.hornav li').each(function(){
			$(this).removeClass('current');
		});
		
		$(this).parent().addClass('current');	// set as current menu
		
		var url = $(this).attr('href');
		if($(url).length > 0) {
			$('.contentwrapper .subcontent').hide();
			$(url).show();
		} else {
			$.post(url, function(data){
				$('#contentwrapper').html(data);
				$('.stdtable input:checkbox').uniform();	//restyling checkbox
			});
		}
		return false;
	});

	// 关闭通知
	$('.notibar .close').click(function(){
		$(this).parent().fadeOut(function(){
			$(this).remove();
		});
	});

	// 菜单折叠
	$('.togglemenu').click(function(){
		if(!$(this).hasClass('togglemenu_collapsed')) {
			if($('.vernav2').length > 0) {
				$('body').addClass('withmenucoll2');
				$('.iconmenu').addClass('menucoll2');
			}
			$(this).addClass('togglemenu_collapsed');
		} else {
			if($('.vernav2').length > 0) {
				$('body').removeClass('withmenucoll2');
				$('.iconmenu').removeClass('menucoll2');
			}
			$(this).removeClass('togglemenu_collapsed');	
		}
	});

	// 响应式布局
	if($(document).width() < 640) {
		$('.togglemenu').addClass('togglemenu_collapsed');
		if($('.vernav2').length > 0) {
			$('.iconmenu').addClass('menucoll2');
			$('body').addClass('withmenucoll2');
		}
	}

	// 窗口改变时
	$(window).resize(function(){
		if($(window).width() > 640)
			$('.centercontent').removeAttr('style');
		if($(document).width() < 640) {
			$('.togglemenu').addClass('togglemenu_collapsed');
			if($('.vernav2').length > 0) {
				$('.iconmenu').addClass('menucoll2');
				$('body').addClass('withmenucoll2');
			}
		}
	});
});