var loopback = require('loopback');
module.exports = function(Track) {

  Track.addTrack = function(track, req, res, cb) {

    //track.meta = req.cookies;
    //track.headers = req.headers;
    //delete track.headers.cookie;  // redundant
    //track.timestamp = (new Date).getTime();
    //
    //Track.create(track, function(error, response) {
    //  if (error) {
    //    cb(error);
    //  }
    //  Track.app.io.emit( "newTrack", { track: response } );
    //  cb(null, JSON.stringify(response));
    //});

  };
  Track.remoteMethod(
    'addTrack',
    {
      returns: {arg: 'ack', type: 'string'},
      http: {path: '/addtrack', verb: 'post'},
      accepts: [
        {arg: 'track', type: 'object'},
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ]
    }
  );
  Track.addErrorTrack = function(track, req, res, cb) {

    track.meta = req.cookies;
    track.headers = req.headers;
    delete track.headers.cookie;  // redundant
    track.timestamp = (new Date).getTime();
// Create Error record here
    cb(null, JSON.stringify(track));
  };

  Track.remoteMethod(
    'addErrorTrack',
    {
      returns: {arg: 'ack', type: 'string'},
      http: {path: '/adderrortrack', verb: 'post'},
      accepts: [
        {arg: 'track', type: 'object'},
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ]
    }
  );

};




