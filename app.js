$(document).ready(function(){

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
		
        var html = data.items.map(function(item) {

            var $template = $('<div class="left-div"><img class="img-responsive thumbnail"><div class="info-group"><h4 class="space"><a class="video-id"></a></h4><small>By<span class="channel-title"></span> </small><p><a class="channel-id"><button type="button">View Channel</button></a></p><p class="description"></p></div></div>');

            var vidID = item.id.videoId;
            var title = item.snippet.title;
            var description = item.snippet.description;
            var thumbnail = item.snippet.thumbnails.high.url;
            var channelTitle = item.snippet.channelTitle;
            var channelID = item.snippet.channelId;

            $template.find('.video-id').attr('href', 'http://youtube.com/embed/' + vidID + '?rel=0').text(title);
            $template.find('.thumbnail').attr('src', thumbnail);
            $template.find('.channel-id').attr('href', 'https://www.youtube.com/channel/' + channelID);
            $template.find('.description').text(description);
            $template.find('.channel-title').text(channelTitle);

            return $template;

        });

        $('#meetup-column').removeClass("hidden");
        $('.js-yt-search-results').html(html);

}

    $('#exercise-list').change(function() {
        var selected = $(this).val() + " Exercises";
        retrieveDataFromApi(selected, showYoutubeSearchData);
    });

});

// Request data from MeetUp
function getMeetUpData(search, location){

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
        success: function(data){
            console.log(data);
            showMeetUpSearchData(data);
        }
    };

    $.ajax(meetUpSettings);
}


function showMeetUpSearchData(data) {
    
    var eventInElement = '';

    if(!data){
        eventInElement += '<p> No results </p>';
    } 
    
    else {

        for (var i = 0; i < data.length; i++) {

        eventInElement += "<li>";
        eventInElement += "<p>" + data.data[i].name + "</p>";
        eventInElement += "<p class = 'meetup-description'>" + data.data[i].description + "</p>";
	    eventInElement += "<p class = 'meetup-state'>" + "State:" + " " + data.data[i].state + "</p>";
	    eventInElement += "<p class = 'meetup-state'>" + "City:" + " " + data.data[i].city + "</p>";
	    eventInElement += "<a class = 'meetup-link' href = " + "'" + data.data[i].link + "'" + ">" + "Event Page" + "</a><br>";
        eventInElement += "</li>";
    
    }

      $("#event-list").html(eventInElement);
 }
// Data is filtered according to city entered in input, but results are not showing
//    showMeetUpSearchData(data);
}


$('#btn-location-input').on("click", function(event){
    event.preventDefault();
    var searchEvent = $("#exercise-list").find(":selected").text();
    var locationEvent = $(".address").val();
    getMeetUpData(searchEvent, locationEvent, showMeetUpSearchData);
    
});

