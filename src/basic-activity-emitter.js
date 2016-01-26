'use strict';

var inherits = require('inherits');
var forIn = require('mout/object/forIn');
var forOwn = require('mout/object/forOwn');
var merge = require('mout/object/merge');
var EventEmitter = require('event-emitter');

/**
 * Poor-man's Activity Emitter. This is a default implementations such that
 * events can still be emitted by the application even if there isn't a "real"
 * event emitter provided. The caveat is, though, that the messages are sent to
 * the "Post Message" bus so the thing who wants to listen to it will have to 
 * listen to it, filter through the messages (because there are probably other
 * messages being sent), and also parsing them/adapting them so that they work
 * for them.
 *
 * To listen to the events, attach an event listener to the window and listen for
 * the 'message' event. For more information, see
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
 *
 * @param  {Object} opts Options object.
 * @param {Object} targetWindow A target window object to post the message to. Default is
 * the current window.
 */
var BasicActivityEmitter = module.exports = function (opts) {
  EventEmitter.call(this);

  opts = opts || {};
  this._incorporate(opts);
};
inherits(BasicActivityEmitter, EventEmitter);

/**
 * Copies and applies the options passed in onto the BasicActivityEmitter
 * instance. These will be sent when the message is emitted under
 * "context".
 *
 * @param  {Object} opts
 */
BasicActivityEmitter.prototype._incorporate = function (opts) {
    opts = opts || {};
    var self = this;

    forIn(opts, function (val, key) {
        self[key] = val;
    });

    return this;
};

/**
 * Check to see if every portion of the object is serializable.. if not
 * remove it from the final object that will get serialized.
 *
 * Note, this is necessary because some objects (usually the "window")
 * gets included many times.. and so we get a cycle which JSON.stringify
 * (rightly) refuses to try and serialize.
 * 
 * @param  {Object} rawData Raw data to serialize
 * @return {Object} 
 */
BasicActivityEmitter.prototype._makeSerializable = function (rawData) {
    var data = {}
    forIn(rawData, function (val, key) {
        try {
            JSON.stringify(val);
            data[key] = val;
        }
        catch (e) {}
    });

    return data;
};

/**
 * Fulfils the contract of being able to register the application
 * with the dispatch (in this case, the window object). Because there
 * isn't a dispatch in the same sense, registering really means just
 * identifying where to send the messages to and then letting the
 * application know that it's done its job.
 *
 * @fires 'emitter:registered'
 */
BasicActivityEmitter.prototype.registerApp = function () {
    this.targetWindow = this.targetWindow || window;
    this.emit('emitter:registered');

    return this;
};

/**
 * Fulfils the contract of sending an event from the emitter. This will
 * package the data in a fairly no-frills object and send the event out
 * over the Post Message bus.
 * 
 * @param  {String} eventType Event type/name.
 * @param  {Object} rawData Raw data to serialize out. Expects it to be an
 * SDK Content model.
 */
BasicActivityEmitter.prototype.send = function (eventType, rawData) {
    var activity = {
        context: this,
        type: eventType,
        data: (rawData && rawData.content) ? this._makeSerializable(rawData.content) : null
    };

    if (this.debug) {
        console.log(JSON.stringify(activity, null, 4));
    }
    else if (!this.disabled) {
        this.targetWindow.postMessage(JSON.stringify(activity), '*');
    }
    
    return this;
};

/**
 * The method JSON.stringfy calls when it comes time to serialize out a
 * BasicActivityEmitter instance. This essentially plucks off all the data
 * values and returns them.
 */
BasicActivityEmitter.prototype.toJSON = function () {
    return this._makeSerializable(this);
};