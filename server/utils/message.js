var moment = require('moment');

var generateMsg = (from, text) => {
    return {
        from,
        text,
        createdAt: moment.valueOf()
    };
};
var generateLocationMsg = (from, latitude, longtitude) =>{
    return {
        from,
        url: 'https//www.google.com/maps?q='+latitude+','+longtitude,
        createdAt: moment.valueOf()
    }
}
module.exports = {generateMsg,generateLocationMsg};
