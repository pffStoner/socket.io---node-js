var socket = io();
var locationn = $('#location');


socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('disconnect', () => {
    console.log('disconnected to server');

});

// listen for event from server
//to display the msg
socket.on('newMessage', function (message) {
    var formatedTime = moment(message.createdAt).format('hh:mm a');
    console.log('new messega', message);
    var li = $('<li></li>');
    li.text(message.from +" "+ formatedTime+': ' + message.text);
    $('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('hh:mm a');
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    li.text(message.from + " " +formatedTime );
    a.attr('href',message.url);
    li.append(a);
    $('#messages').append(li);

});


socket.emit('createMessage', {
    from: 'Mitko',
    text: 'text'
    //event acknowledgements
}, function (data) {
    console.log('Got It');

})



$(document).ready(
    $('#message-form').on('submit', function (e) {
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
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
