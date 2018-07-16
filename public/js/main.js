var socket = io();
var locationn = $('#location');


socket.on('connect', () => {
    console.log('connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join',params, function(err){
        if (err) {
            //TODO
            console.log(err);
        }else {
            console.log('No error');

        }
    });
});

socket.on('disconnect', () => {
    console.log('disconnected to server');

});

socket.on('updatedList', function (users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user){
        ol.append($('<li></li>').text(user));
    });

  $('#users').html(ol);
   
});

// listen for event from server
//to display the msg
socket.on('newMessage', function (message) {
    // console.log('new messega', message);
    // var li = $('<li></li>');
    // li.text(message.from +" "+ formatedTime+': ' + message.text);
    // $('#messages').append(li);
    var formatedTime = moment(message.createdAt).format('hh:mm a');

    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt:formatedTime
    });
    $('#messages').append(html);
    scrollToBottom();

});

socket.on('newLocationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('hh:mm a');
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    // li.text(message.from + " " +formatedTime );
    // a.attr('href',message.url);
    // li.append(a);
    // $('#messages').append(li);
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt:formatedTime
    });
    $('#messages').append(html);
    scrollToBottom();

});


// socket.emit('createMessage', {
//     from: 'Mitko',
//     text: 'text'
//     //event acknowledgements
// }, function (data) {
//     console.log('Got It');

// })
function scrollToBottom() {
    // selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }

}


$(document).ready(
    

    $('#message-form').on('submit', function (e) {
        e.preventDefault();

        socket.emit('createMessage', {
            text: $('[name=message]').val()
        }, function(){
            $('[name=message]').val('')
        });
    }),

    $('#location').on('click', function () {
        //if navigator not supported
        if (!navigator.geolocation) {
            return alert('Geolocation not supported!');
        }
        $(this).prop('disabled', true).text('Sending location...');
  
        //on success 
        navigator.geolocation.getCurrentPosition(function (position) {
            //console.log(position);
            $('#location').removeAttr('disabled').text('Sending location');
            console.log(this);
            
            socket.emit('createLocationMessage', {
                lattitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
           


        },// on fail
            function () {
                $('#location').removeAttr('disabled').text('Sending location');
                $(this).removeAttr('disabled');

            });
    })


);
