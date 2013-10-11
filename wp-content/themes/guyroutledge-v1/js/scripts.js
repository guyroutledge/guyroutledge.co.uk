/* Author: Guy Routledge */

jQuery(function($){

//*************************
// $$ Scroll to Comments
//**************************

	if ( $('#respond').length ) {

		$('[href="#respond"]').click(function(){
			var target = $(this).attr('href');
			var position = $(target).offset().top;
			$('html, body').animate({
				scrollTop : position
			}, 500);
			return false;
		});
	}

//*************************
// $$ Add Back to Top Link
//**************************

	if ( $('html').height() > 1500 ) {

		$('footer .inner-wrap').append('<a class="to-top fr" href="#">to the top ^</a>');
		$('.to-top').click(function(){
			$('html, body').animate({
			scrollTop : 0
			}, 500);
			return false;
		});

	}

//*************************
// $$ No More Widows
//**************************

	$('section p, article p').html(function(i, html) {
		return html.replace(/\s([\S]+)$/,'&nbsp;$1');
	});

});
