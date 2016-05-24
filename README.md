# Clappr Bandwidth Analyzer Plugin

<img src="https://mediahub-bg.github.io/clappr-bandwidth-analyzer/demo.png"><br><br>

### Demo

[Click here to see a demo](https://mediahub-bg.github.io/clappr_bandwidth_analyzer_demo.html)

## Usage

Plugin require jQuery and jQuery Flot http://www.flotcharts.org/

```html
<script type="text/javascript" charset="utf-8" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-rc1/jquery.min.js"></script>
<script type="text/javascript" charset="utf-8" src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.js"></script>
<script type="text/javascript" charset="utf-8" src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.resize.js"></script>
<script type="text/javascript" charset="utf-8" src="/dist/clappr.min.js"></script>
<script type="text/javascript" charset="utf-8" src="/dist/clappr-bandwidth-analyzer.js"></script>
```

Add `ClapprBandwidthAnalyzer` as core plugin.

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [ClapprBandwidthAnalyzer]
  }
});
```

How to customiz and defalt settings:

```javascript
var player = new Clappr.Player({
    'sources': ['http://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4'],
    'parentId': '#player-wrapper',
    'plugins': {
        'core': [ClapprBandwidthAnalyzer]
    },
    'bandwidthAnalyzer':{
        'width': '50%', //width of chart container
        'height': '40%', //height of chart container
        'border' : '2px solid #00aba9!important', //border css of chart container
        'background': 'rgba(60,63,65,.7)', //background css of chart container
        'y_max': 5000, //chart yaxis max value
        'y_min': 0, //chart yaxis min value
        'x_timeDuration': 60, //chart xaxis is duration in seconds
        'bandwidth':{
            'lineWidth': 1,
            'color': '#0f0' //bandwidth line color
        },
        'averageBandwidth':{
            'lineWidth':1,
            'color':'#f00' //Average bandwidth line color
        }
    }
});
```
