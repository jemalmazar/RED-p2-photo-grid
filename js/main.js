$(function () {

  // variable declarations
  var $photoList = $('.photo-list');
  var $hashTag;
  var endpointURL;
  var $loadingGIF = $('.loading-gif').hide();
  var photoElements = '';

  // pagination variables
  var $buttons = $('.buttons').hide();
  var nextURL;

  // Grid Functions
  var buildPhotoGrid = function (value) {
    photoElements += '<li>';
    photoElements +=    '<div class="photo-box">';
    photoElements +=       '<a href="' + value.link + '"><img src="' + value.images.standard_resolution.url + '"/></a>';
    photoElements +=       '<div class="user-data-bar">';
    photoElements +=          '<div class="user-profile-pic"><img src="' + value.user.profile_picture + '"/></div>';
    photoElements +=          '<div class="user-info">';
    photoElements +=             '<p class="username">' + value.user.username + '</p>';
    photoElements +=             '<p><i class="fa fa-comments"></i>' + value.comments.count + '<i class="fa fa-heart"></i>' + value.likes.count + '</p>';
    photoElements +=          '</div>';
    photoElements +=       '</div>';
    photoElements +=    '</div>';
    photoElements += '</li>';
  };

  var buildFailed = function () {

    // error message when the user inputs nothing or if the endpoing URL is not retrieved
    photoElements += '<p class="error-message">Apologies! There was an error. Please try again.</p>';
    $photoList.hide().append(photoElements).fadeIn('slow');
    $buttons.hide();
  };

  // Click Event Function
  $('.search-button').on('click', function (event) {
    event.preventDefault();

    // adjust header height
    $('.site-header').addClass('header-transition');

    // empty the photo list
    $photoList.empty();

    // assign the HTML element variable
    photoElements = '';

    // show the loading gif
    $loadingGIF.show();

    // assign user input to variable & replace spaces
    $hashTag = $('.hashtag-input').val().replace(' ', '');

    // assign endpoint to variable
    endpointURL = 'https://api.instagram.com/v1/tags/' + $hashTag + '/media/recent?count=12&client_id=b8586475183a4ad89a5a0ebd4a36fbc2';

    $.ajax({
      dataType: 'jsonp',
      method: 'GET',
      url: endpointURL,
    })
    .done(function (apiData) {

      // check if the data object contains anything
      if (apiData.data.length) {

        // show the load more button
        $buttons.fadeIn('slow');
        photoElements += '<ul>';

        $.each(apiData.data, function (key, value) {
          buildPhotoGrid(value);
        });

        photoElements += '</ul>';
        $photoList.hide().append(photoElements).fadeIn('slow');

        // grab the pagination link from the initial search and save in variable for later use
        nextURL = apiData.pagination.next_url;

        // clear the photoElements variable in preparation of new images
        photoElements = '';

      }

      // should the data object contain nothing
      else {
        photoElements += '<p class="invalid-hashtag">There are no photos with that hashtag! Please try again.</p>';
        $photoList.hide().append(photoElements).fadeIn('slow');
        $buttons.hide();
      }

    })
    .fail(function () {
      buildFailed();
    })
    .always(function () {
      $loadingGIF.hide();
    });

  });

  // Load More Function
  $('.load-more-button').on('click', function (event) {
    event.preventDefault();

    // check if there is a pagination link
    if (nextURL) {
      $.ajax({
        dataType: 'jsonp',
        method: 'GET',
        url: nextURL,
      })
      .done(function (apiData) {

        // show the load more button
        $buttons.fadeIn('slow');
        photoElements += '<ul>';

        $.each(apiData.data, function (key, value) {
          buildPhotoGrid(value);
        });

        photoElements += '</ul>';
        $photoList.hide().append(photoElements).fadeIn('slow');

        // grabbing the next url for more pagination
        nextURL = apiData.pagination.next_url;

        // clear the photoElements variable in preparation of new images
        photoElements = '';

      })
      .fail(function () {
        buildFailed();
      })
      .always(function () {
        $loadingGIF.hide();
      });

    } else {

      // display error message when there is no pagination link
      $photoList.hide().append('<p class="error-message">Apologies! There are no more photos with that hashtag.</p>').fadeIn('slow');
      $buttons.hide();
    }

  });

  // Smooth Scroll
  $('a').click(function () {

    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top,
    }, 500);
    return false;
  });

});
