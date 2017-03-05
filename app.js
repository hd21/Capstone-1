$(document)
    .ready(function() {

        function retrieveDataFromApi(searchTerm, callback) {

            var settings = {

                url: 'https://www.googleapis.com/youtube/v3/search',
                data: {

                    part: 'snippet',
                    key: 'AIzaSyASovBdr9Ul8NmoI2nbudX1sv91kxupWhY',
                    q: searchTerm,
                    r: 'json',
                    maxResults: 15,
                    safeSearch: 'strict',
                    relevanceLanguage: 'en'

                },

                dataType: 'json',
                type: 'GET',
                success: callback
            };

            $.ajax(settings);
        }

        function showYoutubeSearchData(data) {

            var html = data
                .items
                .map(function(item) {

                    var vidID = item.id.videoId;
                    var title = item.snippet.title;
                    var thumbnail = item.snippet.thumbnails.high.url;

                    var $template = $('<article class="video"><figure><a class="video-id-img" data-lity><img class="img-responsive thumbnail"></a></figure></article>');

                    // <div class="play-vid"><i class="fa fa-youtube-play modify-font" aria-hidden="true"></i></div>

                    $template
                        .find('.video-id')
                        .attr('href', 'http://youtube.com/embed/' + vidID + '?rel=0')
                        .text(title);
                    $template
                        .find('.video-id-img')
                        .attr('href', 'http://youtube.com/embed/' + vidID + '?rel=0')
                    $template
                        .find('.thumbnail')
                        .attr('src', thumbnail);

                    return $template;

                });

            $('.js-yt-search-results').html(html);

        }

        $('#exercise-list')
            .change(function() {
                var selected = $(this).val() + " Exercises";
                retrieveDataFromApi(selected, showYoutubeSearchData);
            });

        $('#meetup-btn').click(function(event) {
            $('.js-yt-search-results').hide();
            $('#meetup-column').removeClass("hidden");

        });

    });

function getMeetUpData(search, location) {

    var meetUpSettings = {
        url: "https://api.meetup.com/find/groups",
        data: {
            key: '132e3c633e326e7c764c5536755d3c7b',
            text: search,
            location: location,
            maxResults: 3
        },
        dataType: 'jsonp',
        type: 'GET',
        success: function(meetupData) {
            console.log(meetupData);
            showMeetUpSearchData(meetupData.data);

        }
    };

    $.ajax(meetUpSettings);
}

function showMeetUpSearchData(data) {

    $("#events").empty();

    var eventInElement = '';
    console.log(data);

    if (!data.length) {
        eventInElement += '<p style="text-align:center">Oops! It looks like there are no Meetup events about this type of exercise near you.</p>';

    } else {

        for (var i = 0; i < 6; i++) {

            eventInElement += '<div class="section-style"><p><br><b>' + data[i].name + '</b></p><p><b>Location:</b><br><i>' + data[i].city + ', ' + data[i].state + '</p></i><p><a href ="' + data[i].link + '">Event Page</a></p><p><b>Description:</b>' + data[i].description + '</p></div>';

        }

    }

    $("#events").append(eventInElement);

}

$('#location-input')
    .submit(function(event) {
        event.preventDefault();

        var searchEvent = $("#exercise-list")
            .find(":selected")
            .text();
        var locationEvent = $(".address").val();

        if (searchEvent.length && locationEvent.length || event.key === 'Enter') {
            getMeetUpData(searchEvent, locationEvent, showMeetUpSearchData);
        } else {
            alert('Please select an exercise type and enter your current location.');
        }

    });

$('#yt-btn').on('click', function() {
    $('#meetup-column').addClass('hidden');
    $('.js-yt-search-results').show();
});