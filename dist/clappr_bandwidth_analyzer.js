(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var UiCorePlugin = Clappr.UICorePlugin;
var UiContainerPlugin = Clappr.UIContainerPlugin;
var template = Clappr.template;
var Events = Clappr.Events;
var Styler = Clappr.Styler;
var Player = Clappr.Player;
var ejs = require("ejs");

var pluginHtml = "<div class=\"clappr-bandwidth-analyzer container border\"><p><div class=\"text bandwidth\">" + "<span class=\"icon mif-film\" style=\"color:#00aba9\"> </span> <span class=\"text\"></span>" + "</div><div class=\"text totalPlayTime\"><span class=\"icon mif-film\" style=\"color:#00aba9\">" + "</span> <span class=\"text\"></span></div><div class=\"text totalDownload\">" + "<span class=\"icon mif-film\" style=\"color:#00aba9\"> </span> <span class=\"text\"></span>" + "</div><div class=\"text totalFrames\"><span class=\"icon mif-film\" style=\"color:#00aba9\">" + "</span> <span class=\"text\"></span></div><div class=\"text dropFrames\"><span class=\"icon mif-film\" style=\"color:#00aba9\">" + "</span> <span class=\"text\"></span></div></p><div class=\"clappr-bandwidth-analyzer-bandwidthChart chart\"></div></div>";

var btn_style = "width: 180px;margin-left: 60px;font-size: 10px;background: transparent;color: #fff;";
var plugin_stover_b_Html = "<button clappr-bandwidth-analyzer class=\"media-control-button media-control-icon\" clappr_bandwidth_analyzer style=\"" + btn_style + "\"><span>Graph Analyzer</span></button>";

var ClapprBandwidthAnalyzer = (function (_UiCorePlugin) {
    function ClapprBandwidthAnalyzer() {
        _classCallCheck(this, ClapprBandwidthAnalyzer);

        if (_UiCorePlugin != null) {
            _UiCorePlugin.apply(this, arguments);
        }
    }

    _inherits(ClapprBandwidthAnalyzer, _UiCorePlugin);

    _createClass(ClapprBandwidthAnalyzer, {
        name: {
            get: function () {
                return "clappr_bandwidth_analyzer";
            }
        },
        attributes: {

            //get template() { return template(plugin_stover_b_Html) }

            get: function () {
                return { "class": "" };
            }
        },
        events: {
            get: function () {
                return { "click [clappr-bandwidth-analyzer]": "toggleAnalyzer" };
            }
        },
        bindEvents: {
            value: function bindEvents() {
                this.listenTo(this.core, Events.CORE_READY, this.pluginInit);
                this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render);
            }
        },
        pluginInit: {
            value: function pluginInit() {
                this.init();
            }
        },
        show: {
            value: function show() {
                this.$el.addClass("show");
            }
        },
        hide: {
            value: function hide() {
                this.$el.removeClass("show");
            }
        },
        toggleAnalyzer: {
            value: function toggleAnalyzer() {
                this.$el.toggleClass("show");
            }
        },
        reload: {
            value: function reload() {
                this.unBindEvents();
                this.bindEvents();
            }
        },
        render: {
            value: function render() {
                var options = this.core.options.bandwidthAnalyzer;

                if (!options) {
                    options = {};
                }
                if (!options.bandwidth) {
                    options.bandwidth = {};
                }
                if (!options.averageBandwidth) {
                    options.averageBandwidth = {};
                }

                this.options = {
                    width: options.width || "50%",
                    height: options.height || "50%",
                    border: options.border || "2px solid #00aba9!important",
                    background: options.background || "rgba(60,63,65,.7)",
                    y_max: options.y_max || 10000,
                    y_min: options.y_min || 0,
                    x_timeDuration: options.x_timeDuration || 30,
                    bandwidth: {
                        lineWidth: options.bandwidth.lineWidth || 1,
                        color: options.bandwidth.color || "#0f0"
                    },
                    averageBandwidth: {
                        lineWidth: options.averageBandwidth.lineWidth || 1,
                        color: options.averageBandwidth.color || "#f00"
                    }
                };

                if (this.shouldRender()) {

                    var that = this;
                    this.core.mediaControl.$(".media-control-left-panel").append(plugin_stover_b_Html);
                    $("button[clappr-bandwidth-analyzer]").on("click", function (e) {
                        that.toggleAnalyzer();
                    });

                    var pluginStyle = ".clappr-bandwidth-analyzer{top:2%;right:2%;height:" + this.options.height + ";width:" + this.options.width + ";" + "position:absolute;background-color:" + this.options.background + ";z-index:9000;}.clappr-bandwidth-analyzer{" + "color:#fff!important;visibility:hidden}.clappr-bandwidth-analyzer-bandwidthChart{width:100%;height:calc(100% - 40px);" + "font-size:14px;line-height:1.2em}.clappr-bandwidth-analyzer .flot-text{color:#fff!important;}" + ".clappr-bandwidth-analyzer div.text{display:inline;padding-left:10px;font-size:12px;display:table-cell;}.clappr-bandwidth-analyzer.show{visibility:" + "visible;z-index:1}.border{border:" + this.options.border + "}";

                    if (!this.isInit) {
                        this.$el = $(pluginHtml);
                        $(this.core.$el).append(this.$el);

                        var style = Styler.getStyleFor(pluginStyle, {
                            baseUrl: this.core.options.baseUrl });
                        this.$el.append(style);
                        this.isInit = true;
                    }
                }

                //this.$analyzer = $(pluginHtml)
                //$(this.core.$el).append(this.$analyzer)
                //var style = Styler.getStyleFor(pluginStyle, {baseUrl: this.core.options.baseUrl});
                //this.$analyzer.append(style);
                //this.show()
                return this;
            }
        },
        shouldRender: {
            value: function shouldRender() {
                try {
                    var playback = this.core.getCurrentPlayback();
                    var video_tag = playback.$el[0];

                    if (!this.core.getCurrentContainer() || !$.plot || video_tag.webkitVideoDecodedByteCount == null || video_tag.webkitDroppedFrameCount == null || video_tag.webkitDecodedFrameCount == null) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }

                return true;
            }
        },
        getTitle: {
            value: function getTitle() {
                return "Graph Analyzer";
            }
        },
        humanizeDuration: {
            value: function humanizeDuration(input) {
                var days = Math.floor(input / (60 * 60 * 24));
                var hours = Math.floor((input - days * (60 * 60 * 24)) / (60 * 60));
                var minutes = Math.floor((input - (days * (60 * 60 * 24) + hours * (60 * 60))) / 60);
                var seconds = input - (days * (60 * 60 * 24) + hours * (60 * 60) + minutes * 60);
                var result = (days > 0 ? days + " days " : "") + (hours > 0 ? hours + " hours " : "") + (minutes > 0 ? minutes + " minutes " : "") + seconds + " seconds";
                return result;
            }
        },
        dom_update: {
            value: function dom_update() {
                $("." + this.container_class + " div.bandwidth span.text").text(this.lastByteRate * 8 / 1000 + " k/bits");
                $("." + this.container_class + " div.totalPlayTime span.text").text(this.humanizeDuration(this.totalPlayTime));
                $("." + this.container_class + " div.totalDownload span.text").text(parseFloat(this.totalLastByteRate / (1024 * 1024)).toFixed(2) + " MB");
                $("." + this.container_class + " div.totalFrames span.text").text(this.totalFrameCounts + " Decoded frames");
                $("." + this.container_class + " div.dropFrames span.text").text(this.droppedFrameCount + this.totalDroppedFrameCount + " Dropped frames");
            }
        },
        update: {
            value: function update(totalByteRate, droppedFrameCount, totalFrameCounts) {
                this.totalPlayTime++;

                if (totalByteRate < this.tmpTotalLastByteRate) {
                    this.tmpTotalLastByteRate = 0;
                }
                this.lastByteRate = totalByteRate - this.tmpTotalLastByteRate;
                this.tmpTotalLastByteRate = this.tmpTotalLastByteRate + this.lastByteRate;
                this.totalLastByteRate = this.totalLastByteRate + this.lastByteRate;

                if (totalFrameCounts < this.tmpTotalFrameCounts) {
                    this.tmpTotalFrameCounts = 0;
                }
                this.lastFrameCounts = totalFrameCounts - this.tmpTotalFrameCounts;
                this.tmpTotalFrameCounts = this.tmpTotalFrameCounts + this.lastFrameCounts;
                this.totalFrameCounts = this.totalFrameCounts + this.lastFrameCounts;

                if (droppedFrameCount < this.droppedFrameCount) {
                    this.totalDroppedFrameCount = this.totalDroppedFrameCount + this.droppedFrameCount;
                }
                this.droppedFrameCount = droppedFrameCount;

                //this.bandwidth.reverse();
                this.bandwidth.push([this.totalPlayTime, this.lastByteRate * 8 / 1000]);
                this.bandwidth.shift();
                this.av_bandwidth.push([this.totalPlayTime, this.totalLastByteRate * 8 / 1000 / this.totalPlayTime]);
                this.av_bandwidth.shift();

                //this.bandwidth.reverse();
                this.dom_update();
            }
        },
        init: {
            value: function init() {

                var that = this;

                this.chart_class = "clappr-bandwidth-analyzer-bandwidthChart";
                this.container_class = "clappr-bandwidth-analyzer";

                this.totalPlayTime = 0;

                this.lastByteRate = 0;
                this.tmpTotalLastByteRate = 0;
                this.totalLastByteRate = 0;

                this.lastFrameCounts = 0;
                this.tmpTotalFrameCounts = 0;
                this.totalFrameCounts = 0;

                this.droppedFrameCount = 0;
                this.totalDroppedFrameCount = 0;

                this.bandwidth = [];
                this.av_bandwidth = [];

                this.currentTime = Math.floor(new Date().getTime() / 1000);

                this.chart = {
                    updateInterval: 30,
                    plot: null
                };

                for (var i = 0; i < this.options.x_timeDuration; i++) {
                    this.bandwidth.push([i, null]);
                    this.av_bandwidth.push([i, null]);
                }

                try {
                    this.chart.plot = $.plot("." + this.chart_class, [{ data: this.bandwidth, label: "Bandwidth" }, { data: this.av_bandwidth, label: "Average Bandwidth" }], {
                        //this.chart.plot = $.plot('#'+this.dom_id, [ this.bandwidth ], {
                        grid: {
                            color: "#ffffff", // => primary color used for outline and labels
                            backgroundColor: null, // => null for transparent, else color
                            tickColor: "#ffffff", // => color used for the ticks
                            labelMargin: 3, // => margin in pixels
                            verticalLines: true, // => whether to show gridlines in vertical direction
                            horizontalLines: true, // => whether to show gridlines in horizontal direction
                            outlineWidth: 2 // => width of the grid outline/border in pixels
                        },
                        series: {
                            shadowSize: 0,
                            lines: { show: true, fill: false },
                            points: { show: false, fill: false }
                        },
                        yaxis: {
                            min: this.options.y_min,
                            max: this.options.y_max },
                        xaxis: {
                            show: true },
                        colors: [this.options.bandwidth.color, this.options.averageBandwidth.color],
                        lineWidth: [this.options.bandwidth.lineWidth, this.options.averageBandwidth.lineWidth]
                    });
                } catch (e) {}

                function appendContent($div, content) {
                    $div.append(content).trigger($.Event("resize"));
                }

                this.listenTo(this.core.getCurrentPlayback(), Events.PLAYBACK_TIMEUPDATE, this.analyzer_update);
            }
        },
        analyzer_update: {
            value: function analyzer_update() {
                var now = Math.floor(new Date().getTime() / 1000);
                if (this.currentTime != now) {
                    this.currentTime = now;
                    try {
                        var playback = this.core.getCurrentPlayback();
                        var video_tag = playback.$el[0];
                        this.update(video_tag.webkitVideoDecodedByteCount, video_tag.webkitDroppedFrameCount, video_tag.webkitDecodedFrameCount);
                        this.chart_update();
                    } catch (e) {
                        this.update(0, 0, 0);
                    }
                }
            }
        },
        chart_update: {
            value: function chart_update() {
                this.bandwidth.forEach(function (obj, index) {
                    obj[0] = index;
                });
                this.av_bandwidth.forEach(function (obj, index) {
                    obj[0] = index;
                });
                this.chart.plot.setData([this.bandwidth, this.av_bandwidth]);
                this.chart.plot.draw();
            }
        }
    });

    return ClapprBandwidthAnalyzer;
})(UiCorePlugin);

module.exports = window.ClapprBandwidthAnalyzer = ClapprBandwidthAnalyzer;

},{"ejs":5}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

'use strict';

/**
 * @file Embedded JavaScript templating engine.
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = require('fs')
  , utils = require('./utils')
  , scopeOptionWarned = false
  , _VERSION_STRING = require('../package.json').version
  , _DEFAULT_DELIMITER = '%'
  , _DEFAULT_LOCALS_NAME = 'locals'
  , _REGEX_STRING = '(<%%|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)'
  , _OPTS = [ 'cache', 'filename', 'delimiter', 'scope', 'context'
            , 'debug', 'compileDebug', 'client', '_with', 'rmWhitespace'
            , 'strict', 'localsName'
            ]
  , _TRAILING_SEMCOL = /;\s*$/
  , _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Name of the object containing the locals.
 *
 * This variable is overriden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String} name     specified path
 * @param {String} filename parent file path
 * @return {String}
 */

exports.resolveInclude = function(name, filename) {
  var path = require('path')
    , dirname = path.dirname
    , extname = path.extname
    , resolve = path.resolve
    , includePath = resolve(dirname(filename), name)
    , ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var fn
    , path = options.filename
    , hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!path) {
      throw new Error('cache option requires a filename');
    }
    fn = exports.cache.get(path);
    if (fn) {
      return fn;
    }
    if (!hasTemplate) {
      template = fs.readFileSync(path).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!path) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fs.readFileSync(path).toString().replace(_BOM, '');
  }
  fn = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(path, fn);
  }
  return fn;
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  if (!opts.filename) {
    throw new Error('`include` requires the \'filename\' option.');
  }
  opts.filename = exports.resolveInclude(path, opts.filename);
  return handleCache(opts);
}

/**
 * Get the JavaScript source of an included file.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {String}
 * @static
 */

function includeSource(path, options) {
  var opts = utils.shallowCopy({}, options)
    , includePath
    , template;
  if (!opts.filename) {
    throw new Error('`include` requires the \'filename\' option.');
  }
  includePath = exports.resolveInclude(path, opts.filename);
  template = fs.readFileSync(includePath).toString().replace(_BOM, '');

  opts.filename = includePath;
  var templ = new Template(template, opts);
  templ.generateSource();
  return templ.source;
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements RethrowCallback
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} filename file name of the EJS file
 * @param {String} lineno   line number of the error
 * @static
 */

function rethrow(err, str, filename, lineno){
  var lines = str.split('\n')
    , start = Math.max(lineno - 3, 0)
    , end = Math.min(lines.length, lineno + 3);

  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

/**
 * Copy properties in data object that are recognized as options to an
 * options object.
 *
 * This is used for compatibility with earlier versions of EJS and Express.js.
 *
 * @memberof module:ejs-internal
 * @param {Object}  data data object
 * @param {Options} opts options object
 * @static
 */

function cpOptsInData(data, opts) {
  _OPTS.forEach(function (p) {
    if (typeof data[p] != 'undefined') {
      opts[p] = data[p];
    }
  });
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} opts     compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {String}
 * @public
 */

exports.render = function (template, data, opts) {
  data = data || {};
  opts = opts || {};
  var fn;

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    cpOptsInData(data, opts);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var args = Array.prototype.slice.call(arguments)
    , path = args.shift()
    , cb = args.pop()
    , data = args.shift() || {}
    , opts = args.pop() || {}
    , result;

  // Don't pollute passed in opts obj with new vals
  opts = utils.shallowCopy({}, opts);

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 3) {
    // Express 4
    if (data.settings && data.settings['view options']) {
      cpOptsInData(data.settings['view options'], opts);
    }
    // Express 3 and lower
    else {
      cpOptsInData(data, opts);
    }
  }
  opts.filename = path;

  try {
    result = handleCache(opts)(data);
  }
  catch(err) {
    return cb(err);
  }
  return cb(null, result);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  this.dependencies = [];
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval'
, ESCAPED: 'escaped'
, RAW: 'raw'
, COMMENT: 'comment'
, LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING
      , delim = utils.escapeRegExpChars(this.opts.delimiter);
    str = str.replace(/%/g, delim);
    return new RegExp(str);
  }

, compile: function () {
    var src
      , fn
      , opts = this.opts
      , prepended = ''
      , appended = ''
      , escape = opts.escapeFunction;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r`.
      this.templateText =
        this.templateText.replace(/\r/g, '').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    if (!this.source) {
      this.generateSource();
      prepended += '  var __output = [], __append = __output.push.bind(__output);' + '\n';
      if (opts._with !== false) {
        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output.join("");' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
          + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
          + '  , __filename = ' + (opts.filename ?
                JSON.stringify(opts.filename) : 'undefined') + ';' + '\n'
          + 'try {' + '\n'
          + this.source
          + '} catch (e) {' + '\n'
          + '  rethrow(e, __lines, __filename, __line);' + '\n'
          + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.debug) {
      console.log(src);
    }

    if (opts.client) {
      src = 'escape = escape || ' + escape.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }

    try {
      fn = new Function(opts.localsName + ', escape, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs';
      }
      throw e;
    }

    if (opts.client) {
      fn.dependencies = this.dependencies;
      return fn;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = function (data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escape, include, rethrow]);
    };
    returnedFn.dependencies = this.dependencies;
    return returnedFn;
  }

, generateSource: function () {
    var self = this
      , matches = this.parseTemplateText()
      , d = this.opts.delimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var opening
          , closing
          , include
          , includeOpts
          , includeSrc;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with '<' + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf('<' + d) === 0        // If it is a tag
          && line.indexOf('<' + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + '>' || closing == '-' + d + '>' || closing == '_' + d + '>')) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        // HACK: backward-compat `include` preprocessor directives
        if ((include = line.match(/^\s*include\s+(\S+)/))) {
          opening = matches[index - 1];
          // Must be in EVAL or RAW mode
          if (opening && (opening == '<' + d || opening == '<' + d + '-' || opening == '<' + d + '_')) {
            includeOpts = utils.shallowCopy({}, self.opts);
            includeSrc = includeSource(include[1], includeOpts);
            includeSrc = '    ; (function(){' + '\n' + includeSrc +
                '    ; })()' + '\n';
            self.source += includeSrc;
            self.dependencies.push(exports.resolveInclude(include[1],
                includeOpts.filename));
            return;
          }
        }
        self.scanLine(line);
      });
    }

  }

, parseTemplateText: function () {
    var str = this.templateText
      , pat = this.regex
      , result = pat.exec(str)
      , arr = []
      , firstPos
      , lastPos;

    while (result) {
      firstPos = result.index;
      lastPos = pat.lastIndex;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  }

, scanLine: function (line) {
    var self = this
      , d = this.opts.delimiter
      , newLineCount = 0;

    function _addOutput() {
      if (self.truncate) {
        // Only replace single leading linebreak in the line after
        // -%> tag -- this is the single, trailing linebreak
        // after the tag that the truncation mode replaces
        // Handle Win / Unix / old Mac linebreaks -- do the \r\n
        // combo first in the regex-or
        line = line.replace(/^(?:\r\n|\r|\n)/, '')
        self.truncate = false;
      }
      else if (self.opts.rmWhitespace) {
        // Gotta be more careful here.
        // .replace(/^(\s*)\n/, '$1') might be more appropriate here but as
        // rmWhitespace already removes trailing spaces anyway so meh.
        line = line.replace(/^\n/, '');
      }
      if (!line) {
        return;
      }

      // Preserve literal slashes
      line = line.replace(/\\/g, '\\\\');

      // Convert linebreaks
      line = line.replace(/\n/g, '\\n');
      line = line.replace(/\r/g, '\\r');

      // Escape double-quotes
      // - this will be the delimiter during execution
      line = line.replace(/"/g, '\\"');
      self.source += '    ; __append("' + line + '")' + '\n';
    }

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
      case '<' + d:
      case '<' + d + '_':
        this.mode = Template.modes.EVAL;
        break;
      case '<' + d + '=':
        this.mode = Template.modes.ESCAPED;
        break;
      case '<' + d + '-':
        this.mode = Template.modes.RAW;
        break;
      case '<' + d + '#':
        this.mode = Template.modes.COMMENT;
        break;
      case '<' + d + d:
        this.mode = Template.modes.LITERAL;
        this.source += '    ; __append("' + line.replace('<' + d + d, '<' + d) + '")' + '\n';
        break;
      case d + '>':
      case '-' + d + '>':
      case '_' + d + '>':
        if (this.mode == Template.modes.LITERAL) {
          _addOutput();
        }

        this.mode = null;
        this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
        break;
      default:
        // In script mode, depends on type of tag
        if (this.mode) {
          // If '//' is found without a line break, add a line break.
          switch (this.mode) {
            case Template.modes.EVAL:
            case Template.modes.ESCAPED:
            case Template.modes.RAW:
              if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
                line += '\n';
              }
          }
          switch (this.mode) {
            // Just executing code
            case Template.modes.EVAL:
              this.source += '    ; ' + line + '\n';
              break;
            // Exec, esc, and output
            case Template.modes.ESCAPED:
              this.source += '    ; __append(escape(' +
                line.replace(_TRAILING_SEMCOL, '').trim() + '))' + '\n';
              break;
            // Exec and output
            case Template.modes.RAW:
              this.source += '    ; __append(' +
                line.replace(_TRAILING_SEMCOL, '').trim() + ')' + '\n';
              break;
            case Template.modes.COMMENT:
              // Do nothing
              break;
            // Literal <%% mode, append as raw output
            case Template.modes.LITERAL:
              _addOutput();
              break;
          }
        }
        // In string mode, just add the output
        else {
          _addOutput();
        }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

// Add require support
/* istanbul ignore else */
if (require.extensions) {
  require.extensions['.ejs'] = function (module, filename) {
    filename = filename || /* istanbul ignore next */ module.filename;
    var options = {
          filename: filename
        , client: true
        }
      , template = fs.readFileSync(filename).toString()
      , fn = exports.compile(template, options);
    module._compile('module.exports = ' + fn.toString() + ';', filename);
  };
}

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}

},{"../package.json":7,"./utils":6,"fs":2,"path":3}],6:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */

'use strict';

var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
      '&': '&amp;'
    , '<': '&lt;'
    , '>': '&gt;'
    , '"': '&#34;'
    , "'": '&#39;'
    }
  , _MATCH_HTML = /[&<>\'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
        .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr
};

/**
 * Copy all properties from one object to another, in a shallow fashion.
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements Cache
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};


},{}],7:[function(require,module,exports){
module.exports={
  "name": "ejs",
  "description": "Embedded JavaScript templates",
  "keywords": [
    "template",
    "engine",
    "ejs"
  ],
  "version": "2.4.1",
  "author": {
    "name": "Matthew Eernisse",
    "email": "mde@fleegix.org",
    "url": "http://fleegix.org"
  },
  "contributors": [
    {
      "name": "Timothy Gu",
      "email": "timothygu99@gmail.com",
      "url": "https://timothygu.github.io"
    }
  ],
  "license": "Apache-2.0",
  "main": "./lib/ejs.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/mde/ejs.git"
  },
  "bugs": {
    "url": "https://github.com/mde/ejs/issues"
  },
  "homepage": "https://github.com/mde/ejs",
  "dependencies": {},
  "devDependencies": {
    "browserify": "^8.0.3",
    "istanbul": "~0.3.5",
    "jake": "^8.0.0",
    "jsdoc": "^3.3.0-beta1",
    "lru-cache": "^2.5.0",
    "mocha": "^2.1.0",
    "rimraf": "^2.2.8",
    "uglify-js": "^2.4.16"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "scripts": {
    "test": "mocha",
    "coverage": "istanbul cover node_modules/mocha/bin/_mocha",
    "doc": "rimraf out && jsdoc -c jsdoc.json lib/* docs/jsdoc/*",
    "devdoc": "rimraf out && jsdoc -p -c jsdoc.json lib/* docs/jsdoc/*"
  },
  "_id": "ejs@2.4.1",
  "_shasum": "82e15b1b2a1f948b18097476ba2bd7c66f4d1566",
  "_resolved": "https://registry.npmjs.org/ejs/-/ejs-2.4.1.tgz",
  "_from": "ejs@latest",
  "_npmVersion": "2.10.1",
  "_nodeVersion": "0.12.4",
  "_npmUser": {
    "name": "mde",
    "email": "mde@fleegix.org"
  },
  "maintainers": [
    {
      "name": "tjholowaychuk",
      "email": "tj@vision-media.ca"
    },
    {
      "name": "mde",
      "email": "mde@fleegix.org"
    }
  ],
  "dist": {
    "shasum": "82e15b1b2a1f948b18097476ba2bd7c66f4d1566",
    "tarball": "https://registry.npmjs.org/ejs/-/ejs-2.4.1.tgz"
  },
  "directories": {}
}

},{}]},{},[1]);
