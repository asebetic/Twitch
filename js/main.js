
$(document).ready(function() {

  var gameMenu = $('<ul>').appendTo('.menu');

  var games = [];

  var currentGame = null;

  var currentCheck = null;

  var broadLang = null;

  function empty(element) {
    $(element).empty();
  };

  function hide(element) {
    $(element).hide();
  };

  function show(element) {
    $(element).show();
  };

  var getStreams = function(params, limit) {

    var limit = {limit: 9};

    $.ajax( {
    url: 'https://api.twitch.tv/kraken/streams',
    data: $.extend(limit, params),
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
   
        var videoBanner = 'url('+ element.channel.video_banner +')';

        if (element.channel.video_banner !== null) {
          profileDiv.css({
            'box-shadow': 'inset 0 0 0 100px rgba(0, 79, 145, .8)',
            'background-image': videoBanner
          });
        };

        // Append new DOM elements
        profileDiv.appendTo(divCol);
        logo.appendTo(profileDiv);
        nameSpan.appendTo(profileDiv);
        previewImg.appendTo(divCol);
        gameName.appendTo(divCol);
        viewers.appendTo(divCol);
        createdSpan.appendTo(divCol);
        $('.rows').append(divCol);

        // Hide Load more button when 
        // all the streams have been loaded
        if ($('.col:visible').length < 9) {
          hide('#load-more');
        } else {
        show('#load-more');
        }

        // Open and hide modal window on click
        $('#stream-' + element.channel._id).click(function() {
          show('#modal');      
          $('#modal').append(srcVideo, gameName, logo, nameSpan, viewers, createdSpan, closeBtn);
          $('#close-btn').click(function() { 
            empty('#modal');
            show('.content');
            $('#filter-btn').css('visibility', 'visible');
            $('#menu-btn').css('visibility', 'visible'); 
          });
          
          // Hide content and menu buttons
          hide('.content');
          $('#filter-btn').css('visibility', 'hidden');
          $('#menu-btn').css('visibility', 'hidden');
        });
          

        // List game names in menu
        if ($.inArray(element.channel.game, games) === -1) {
          games.push(element.channel.game);
          $('<li>', {
            'id': element.channel.game,
            'html': '<a href="#">' + element.channel.game + '</a>'
          }).click(function() {
            // Define parameter in new var
            var gm = {
              game: element.channel.game
            }

            if (currentCheck !== null) {
              $.extend(gm, currentCheck);
            }

            if (broadLang !== null) {
              $.extend(gm, broadLang);
            }

            // Remove other games and show 
            // only the one that is selected in menu
            $('#menu-btn').click();
            empty('.rows');
            getStreams(gm);
            currentGame = element.channel.game;
            offsetValue = 9;
          }).appendTo(gameMenu);
        }

      });

    }

  });
  } // end of function getStreams

  var offsetValue = 9;

  // Load 9 more streams with parameters offset and game
  $('#load-more').click(function() {

    var offset = {offset: offsetValue};

    if (currentGame !== null) {
      $.extend(offset, {game: currentGame})
    } 

    if (currentCheck !== null) {
      $.extend(offset, currentCheck);
    }

    if (broadLang !== null) {
      $.extend(offset, broadLang);
    }

    getStreams(offset);
    offsetValue += 9;
    if($('.col:visible').length < offsetValue) {
      hide('#load-more');
    }

  });

  $('#stream_lang').click(function() {
      
      if ($(this).is(":checked")) {
        $('#filter-btn').click();
        currentCheck = {language: 'en'};
        empty('.rows');

        if (currentGame !== null) {
          $.extend(currentCheck, {game: currentGame})
        }

        if ($('#broad_lang').is(":checked")) {

          broadLang = {broadcaster_language: 'en'};

          $.extend(currentCheck, broadLang);
          getStreams(currentCheck, broadLang);
          return;
        }

        offsetValue = 9;
        getStreams(currentCheck);

      } else {

        currentCheck = null;
        empty('.rows');

        if ($('#broad_lang').is(":checked") && currentGame === null) {          
          broadLang = {broadcaster_language: 'en'};
          getStreams(broadLang);
          return;
        }
        else if ($('#broad_lang').is(":checked") && currentGame !== null) {
          $.extend(broadLang, {game: currentGame});
          getStreams(broadLang);
          return;
        }

        if (currentGame !== null) {
          getStreams({game: currentGame});
          return;
        }

        offsetValue = 9;
        getStreams();
      }   
  });

  $('#broad_lang').click(function() {

    if ($(this).is(":checked")) {

      broadLang = {broadcaster_language: 'en'};
      $('#filter-btn').click();
      empty('.rows');

      if (currentGame !== null) {
        $.extend(broadLang, {game: currentGame});
      }

      if ($('#stream_lang').is(":checked")) {
        currentCheck = {language: 'en'};

        $.extend(broadLang, currentCheck);
        getStreams(broadLang, currentCheck);
        return;
      }

      offsetValue = 9;
      getStreams(broadLang);

    } else {

      broadLang = null;
      empty('.rows');

      if ($('#stream_lang').is(":checked") && currentGame === null) {
        currentCheck = {language: 'en'};
        getStreams(currentCheck);
        return;
      } else if ($('#stream_lang').is(":checked") && currentGame !== null) {
        $.extend(currentCheck, {game: currentGame});
        getStreams(currentCheck);
        return;
      }

      if (currentGame !== null) {
        getStreams({game: currentGame});
        return;
      }

      offsetValue = 9;
      getStreams();

    }
  });

  // Slide in menu on click and push container
  var slidingMenu = function() {

      var menu = true;

    $('#menu-btn').click(function() {
      if(menu) {
        hide('#menu-img');
        show('#menu-close');
        $('.menu').css('transform', 'translate(-400px, 0');
        $('.container').css('transform', 'translate(-400px, 0');
        menu = false;
      } else {
        $('.menu').css('transform', 'translate(0, 0');
        $('.container').css('transform', 'translate(0, 0');
        show('#menu-img');
        hide('#menu-close');
        menu = true;
      }
    });   

    // Slide in filter menu on click and push container
    $('#filter-btn').click(function() {
      if(menu) {
        // If menu is open, show close button
        hide('#filter-img');
        show('#filter-close');
        $('.filter').css('transform', 'translate(400px, 0');
        $('.container').css('transform', 'translate(400px, 0');  
        menu = false;
      } else {
        $('.filter').css('transform', 'translate(0, 0');
        $('.container').css('transform', 'translate(0, 0');
        show('#filter-img');
        hide('#filter-close');        
        menu = true;
      }
    });    
  }
  slidingMenu();
  getStreams();

});

