
$(document).ready(function() {
	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams',
		data: { get_param: 'value' },
		dataType: 'json',
		type: 'GET',
		cache: true,
		success: function (data) { 
        $.each(data.streams, function(index, element) {

            var divCol = $('<div>', {
            	'class': 'col',
            	'id': 'col-' + index
            });

            var profileDiv = $('<div>', {
            	'class': 'profile'
            });

            var logo = $('<img>', {
        		'id': 'profile_logo',
        		'src': element.channel.logo
        		});

            var nameSpan = $('<span>', {
            	'class': 'name',
            	'html': element.channel.display_name
            });

            var previewImg = $('<img>', {
            	'src': element.preview.medium
            });

            var gameName = $('<p>', {
            	'id': 'game-name',
            	'html': element.channel.game
            });

            var viewers = $('<span>', {
            	'id': 'viewers',
            	'html': element.viewers + ' ' + element.created_at
            });

            var srcVideo = $('<iframe>', {
            	'class': 'video',
            	'id': "video-" + index,
            	'src': "http://player.twitch.tv/?channel=" + element.channel.name
            })

            profileDiv.css({
            	'box-shadow': 'inset 0 0 0 100px rgba(0, 79, 145, .8)',
            	'background-image': 'url('+element.channel.video_banner+')'
            });

            profileDiv.appendTo(divCol);
            logo.appendTo(profileDiv);
            nameSpan.appendTo(profileDiv);
            previewImg.appendTo(divCol);
            gameName.appendTo(divCol);
            viewers.appendTo(divCol);
        		$('.row').append(divCol);
        		$('#col-' + index).click(function() {
        			$('.container').append(srcVideo, gameName, viewers, logo, nameSpan)
        			$('.content').hide();
        		})
        		
            console.log('#col-' + index);
            console.log(element.channel.name);
        });
        
    }
	});
	$(function() {
    $(".col").slice(0, 9).show();
    $("#load_more").click(function(e) { 
        e.preventDefault();
        $(".col:hidden").slice(0, 16).show(); 
        $(this).hide();
    });
	});
});


var slidingMenu = function() {

	var menu = true;

  $('#menu-btn').click(function() {
    if(menu) {
      $('.menu').css('-webkit-transform', 'translate(0, 0');
      $('.menu').css('-moz-transform', 'translate(0, 0');
      $('.menu').css('transform', 'translate(0, 0');
      $('.container').css('-webkit-transform', 'translate(-400px, 0');
      $('.container').css('-moz-transform', 'translate(-400px, 0');
      $('.container').css('transform', 'translate(-400px, 0');
      
      menu = false;
    } else {
      $('.menu').css('-webkit-transform', 'translate(400px, 0');
      $('.menu').css('-moz-transform', 'translate(400px, 0');
      $('.menu').css('transform', 'translate(400px, 0');
      $('.container').css('-webkit-transform', 'translate(0, 0');
      $('.container').css('-moz-transform', 'translate(0, 0');
      $('.container').css('transform', 'translate(0, 0');

      menu = true;
    }
  });	

	  $('#filter-btn').click(function() {
	    if(menu) {
	      $('.filter').css('-webkit-transform', 'translate(400px, 0');
	      $('.filter').css('-moz-transform', 'translate(400px, 0');
	      $('.filter').css('transform', 'translate(400px, 0');
	      $('.container').css('-webkit-transform', 'translate(400px, 0');
	      $('.container').css('-moz-transform', 'translate(400px, 0');
	      $('.container').css('transform', 'translate(400px, 0');
	      
	      menu = false;
	    } else {
	      $('.filter').css('-webkit-transform', 'translate(-400px, 0');
	      $('.filter').css('-moz-transform', 'translate(-400px, 0');
	      $('.filter').css('transform', 'translate(-400px, 0');
	      $('.container').css('-webkit-transform', 'translate(0, 0');
	      $('.container').css('-moz-transform', 'translate(0, 0');
	      $('.container').css('transform', 'translate(0, 0');

	      menu = true;
	    }
	  });	  
}
slidingMenu();

