
$(document).ready(function() {

	var gameMenu = $('<ul>').appendTo('.menu');

	var games = [];

	var currentGame = null;

	var currentCheck = null;

	var getStreams = function(params, game, check) {
		
		$.ajax( {
		url: 'https://api.twitch.tv/kraken/streams',
		data: $.extend({limit: 9}, params, game, check),
		dataType: 'json',
		type: 'GET',
		cache: true,
		success: function (data) { 
			// Push unique game names
			Array.prototype.unique = function() {
	    	var unique = [];
	    	for (var i = 0; i < this.length; i++) {
	        if (unique.indexOf(this[i]) == -1) {
	          unique.push(this[i]);
	        }
    		}
    		return unique;
			};

      $.each(data.streams, function(index, element) {

      	// Create new elements
    		var divCol = $('<div>', {
        	'class': 'col',
        	'id': 'stream-' + element.channel._id
        });

        var profileDiv = $('<div>', {
        	'class': 'profile'
        });

        var logo = $('<img>', {
    		'id': 'profile-logo',
    		'src': element.channel.logo
    		});

        var nameSpan = $('<span>', {
        	'id': 'name',
        	'html': element.channel.display_name
        });

        var previewImg = $('<img>', {
        	'src': element.preview.medium
        });

        var gameName = $('<p>', {
        	'id': element.channel.game,
        	'class': 'game-name',
        	'html': element.channel.game
        });

        var viewers = $('<span>', {
        	'id': 'viewers',
        	'html': element.viewers + ' '
        });

        var dateCreated = new Date(element.created_at);

        var createdSpan = $('<span>', {
        	'id': 'date',
        	'html': dateCreated.toDateString()
        });

        var srcVideo = $('<iframe>', {
        	'class': 'video',
        	'id': "video-" + element.channel._id,
        	'src': "http://player.twitch.tv/?channel=" + element.channel.name
        })

        var closeBtn = $('<button>', {
        	'id': 'close-btn',
        	'html': '<img src="img/close-btn.png">'
        });

        profileDiv.css({
        	'box-shadow': 'inset 0 0 0 100px rgba(0, 79, 145, .8)',
        	'background-image': 'url('+element.channel.video_banner+')'
        });

        // Append new DOM elements
        profileDiv.appendTo(divCol);
        logo.appendTo(profileDiv);
        nameSpan.appendTo(profileDiv);
        previewImg.appendTo(divCol);
        gameName.appendTo(divCol);
        viewers.appendTo(divCol);
        createdSpan.appendTo(divCol);
    		$('.row').append(divCol);

    		// Open and hide modal window on click
    		$('#stream-' + element.channel._id).click(function() {		
    			$('#modal').append(srcVideo, gameName, logo, nameSpan, viewers, createdSpan, closeBtn);
    			$('#close-btn').click(function() { 
    				$('#modal').empty();
						$('.content').show();
						$('#filter-btn').css('visibility', 'visible');
    				$('#menu-btn').css('visibility', 'visible'); 
					});
					// Hide content and menu buttons
    			$('.content').hide();
    			$('#filter-btn').css('visibility', 'hidden');
    			$('#menu-btn').css('visibility', 'hidden');
    		});
    		

    		// List game names in menu
	  		if ($.inArray(element.channel.game, games) === -1) {
	  			games.push(element.channel.game);
	    		var menuList = $('<li>', {
	    			'id': element.channel.game,
	    			'html': '<a href="#">' + element.channel.game + '</a>'
	    		}).click(function() {
	    			// Define parameter in new var
	    			var gm = {
	    				game: element.channel.game
	    			}
	    			// Remove other games and show 
	    			// only the one that is selected in menu
	    			$('.row').empty();
	    			getStreams(gm);
	    			currentGame = element.channel.game;
	    			offsetValue = 9;
	    		}).appendTo(gameMenu);

	    	}
      });
    }
	});
	}

	var offsetValue = 9;

	// Load 9 more streams with parameters offset and game
	$('#load-more').click(function() {
		var offset = {offset: offsetValue};
		if (currentGame !== null) {
			$.extend(offset, {game: currentGame})
		} 
		if (currentCheck !== null) {
			$.extend(offset, {language: currentCheck})
		}
		getStreams(offset);
		offsetValue += 9;
	});

	$('#stream_lang').click(function() {
		if ($('#stream_lang').is(":checked")) {
			var check = {language: 'en'};
			$('.row').empty();
			if (currentGame !== null) {
				$.extend(check, {game: currentGame})
			}
			currentCheck = 'en';
			getStreams(check);
			offsetValue = 9;
			} else {
			getStreams();
			}	
	});
	// Slide in menu on click and push container
	var slidingMenu = function() {

		var menu = true;

	  $('#menu-btn').click(function() {
	    if(menu) {
	    	$('#menu-img').hide();
	    	$('#menu-close').show();
	    	$('.menu').css('transform', 'translate(-400px, 0');
	      $('.container').css('transform', 'translate(-400px, 0');
	      menu = false;
	    } else {
	      $('.menu').css('transform', 'translate(0, 0');
	      $('.container').css('transform', 'translate(0, 0');
	      $('#menu-img').show();
	    	$('#menu-close').hide();
	      menu = true;
	    }
	  });	

	  // Slide in filter menu on click and push container
	  $('#filter-btn').click(function() {
	    if(menu) {
	    	// If menu is open, show close button
	    	$('#filter-img').hide();
	  		$('#filter-close').show();
	      $('.filter').css('transform', 'translate(400px, 0');
	      $('.container').css('transform', 'translate(400px, 0');  
	      menu = false;
	    } else {
	      $('.filter').css('transform', 'translate(0, 0');
	      $('.container').css('transform', 'translate(0, 0');
	      $('#filter-img').show();
	  		$('#filter-close').hide();	      
	      menu = true;
	    }
	  });	 
	}
	slidingMenu();
	getStreams();
});


