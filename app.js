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
                    maxResults: 3

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

                    var $template = $('<div class="left-div"><img class="img-responsive thumbnail"><div class="info-gro' +
                        'up"><h4 class="space"><a class="video-id"></a></h4><small>By<span class="channel' +
                        '-title"></span> </small><p><a class="channel-id"><button type="button">View Chan' +
                        'nel</button></a></p><p class="description"></p></div></div>');

                    var vidID = item.id.videoId;
                    var title = item.snippet.title;
                    var description = item.snippet.description;
                    var thumbnail = item.snippet.thumbnails.high.url;
                    var channelTitle = item.snippet.channelTitle;
                    var channelID = item.snippet.channelId;

                    $template
                        .find('.video-id')
                        .attr('href', 'http://youtube.com/embed/' + vidID + '?rel=0')
                        .text(title);
                    $template
                        .find('.thumbnail')
                        .attr('src', thumbnail);
                    $template
                        .find('.channel-id')
                        .attr('href', 'https://www.youtube.com/channel/' + channelID);
                    $template
                        .find('.description')
                        .text(description);
                    $template
                        .find('.channel-title')
                        .text(channelTitle);

                    return $template;

                });

            $('#meetup-column').removeClass("hidden");
            $('.js-yt-search-results').html(html);

        }

        $('#exercise-list')
            .change(function() {
                var selected = $(this).val() + " Exercises";
                retrieveDataFromApi(selected, showYoutubeSearchData);
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

    if (!data) {
        eventInElement += '<p> No results </p>';
    } else {

        for (var i = 0; i < 3; i++) {

            eventInElement += '<div class="right-div"><p>Event:<br>' + data[i].name + '</p><p>Location:<br>' + data[i].city + ', ' + data[i].state + '</p><p>Description:<br>' + data[i].description + '</p><a href ="' + data[i].link + '">Event Page</a><br></div>';

        }

        $("#events").append(eventInElement);
    }
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