'use strict';

// Ensure we have bind capabilities
// Source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

var IMGPreloader = function(options) {
  this._unprocessedImagesByHost = {};
  this._processingImagesByHost = {};
  this._concurrentConnectionsPerHost = 6;   //TODO: Choose best option based on browser
};

IMGPreloader.prototype.processQueue = function processQueue() {
  var host,
      i = 0,
      queueItem;

  for (host in this._unprocessedImagesByHost) {
    if (!this._unprocessedImagesByHost.hasOwnProperty(host)) {
      continue;
    }

    if (this._processingImagesByHost[host] === undefined) {
      this._processingImagesByHost[host] = [];
    }

    if (this._processingImagesByHost[host].length < this._concurrentConnectionsPerHost) {
      for (; i < this._concurrentConnectionsPerHost - this._processingImagesByHost[host].length; i++) {
        queueItem = this._unprocessedImagesByHost[host].shift();
        
        if (queueItem !== undefined) {
          this._processingImagesByHost[host].push(queueItem);
          
          var imgElement = new Image();          
          imgElement.src = queueItem;

          if (imgElement.complete === true) {
            this.removeProcessedItem(queueItem);
            this.processQueue();
          } else {
            imgElement.addEventListener('load', function(e) {
              this.removeProcessedItem(e.target.src);
              this.processQueue();
            }.bind(this));

            imgElement.addEventListener('error', function(e) {
              this.removeProcessedItem(e.target.src, true);
              this.processQueue();
            }.bind(this));
          }
        }
      }
    }
  }
};

IMGPreloader.prototype.removeProcessedItem = function removeProcessedItem(item, shouldReprocess) {
  var i = 0,
      uri = new Uri(item),
      host = uri.host(),
      hostQueue = this._processingImagesByHost[host],
      hostQueueLength = hostQueue.length;
  
  for (; i < hostQueueLength; i++) {
    if (hostQueue[i] === item) {
      hostQueue.splice(i, 1);
    }
  }
};

IMGPreloader.prototype.cleanQueue = function cleanQueue() {
  var host;
  
  for (host in this._unprocessedImagesByHost) {
    if (this._unprocessedImagesByHost.hasOwnProperty(host) && this._unprocessedImagesByHost[host].length === 0) {
      delete(this._unprocessedImagesByHost[host]);
    }
  }
};

IMGPreloader.prototype.push = function push(src) {
  var uri = new Uri(src);

  if (this._unprocessedImagesByHost[uri.host()] === undefined) {
    this._unprocessedImagesByHost[uri.host()] = [];
  }

  this._unprocessedImagesByHost[uri.host()].push(src);
  this.cleanQueue();
  this.processQueue();
};

IMGPreloader.prototype.push_many = function push_many(arrayOfSrc) {
  var length = arrayOfSrc.length,
      i = 0;
  
  if (length > 0) {
    for(; i < length; i++) {
      this.push(arrayOfSrc[i]);
    }
  }
}