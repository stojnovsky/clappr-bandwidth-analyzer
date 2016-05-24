var UiCorePlugin = Clappr.UICorePlugin
var UiContainerPlugin = Clappr.UIContainerPlugin
var template = Clappr.template;
var Events = Clappr.Events;
var Styler = Clappr.Styler;
var Player = Clappr.Player;
var ejs = require('ejs');




var pluginHtml = '<div class="clappr-bandwidth-analyzer container border"><p><div class="text bandwidth">'
    +'<span class="icon mif-film" style="color:#00aba9"> </span> <span class="text"></span>'
    +'</div><div class="text totalPlayTime"><span class="icon mif-film" style="color:#00aba9">'
    +'</span> <span class="text"></span></div><div class="text totalDownload">'
    +'<span class="icon mif-film" style="color:#00aba9"> </span> <span class="text"></span>'
    +'</div><div class="text totalFrames"><span class="icon mif-film" style="color:#00aba9">'
    +'</span> <span class="text"></span></div><div class="text dropFrames"><span class="icon mif-film" style="color:#00aba9">'
    +'</span> <span class="text"></span></div></p><div class="clappr-bandwidth-analyzer-bandwidthChart chart"></div></div>'








var btn_style = "width: 180px;margin-left: 60px;font-size: 10px;background: transparent;color: #fff;";
var plugin_stover_b_Html = "<button clappr-bandwidth-analyzer class=\"media-control-button media-control-icon\" clappr-bandwidth-analyzer style=\""+btn_style+"\"><span>Graph Analyzer</span></button>";



class ClapprBandwidthAnalyzer extends UiCorePlugin {

    get name() { return 'clappr-bandwidth-analyzer' }

    //get template() { return template(plugin_stover_b_Html) }

    get attributes() { return {'class': ''} }

    get events() { return { "click [clappr-bandwidth-analyzer]": "toggleAnalyzer" } }


    bindEvents() {
        this.listenTo(this.core, Events.CORE_READY, this.pluginInit);
        this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render);
    }



    pluginInit(){
        this.init()
    }




    show(){
        this.$el.addClass('show')
    }

    hide(){
        this.$el.removeClass('show')
    }

    toggleAnalyzer () {
        this.$el.toggleClass('show')
    }

    reload(){
        this.unBindEvents();
        this.bindEvents();
    }


    render() {
        var options = this.core.options.bandwidthAnalyzer

        if (!options){ options = {} }
        if (!options.bandwidth){ options.bandwidth = {} }
        if (!options.averageBandwidth){ options.averageBandwidth = {} }

        this.options = {
            'width': options.width || '50%',
            'height': options.height || '40%',
            'border' : options.border || '2px solid #00aba9!important',
            'background': options.background || 'rgba(60,63,65,.7)',
            'y_max':options.y_max || 5000,
            'y_min':options.y_min || 0,
            'x_timeDuration':options.x_timeDuration || 60,
            'bandwidth':{
                'lineWidth':options.bandwidth.lineWidth || 1,
                'color':options.bandwidth.color || '#0f0'
            },
            'averageBandwidth':{
                'lineWidth':options.averageBandwidth.lineWidth ||1,
                'color':options.averageBandwidth.color ||'#f00'
            }
        };


        if (this.shouldRender()) {

            var that = this;
            this.core.mediaControl.$(".media-control-left-panel").append(plugin_stover_b_Html);
            $('button[clappr-bandwidth-analyzer]').on('click',function(e){
                that.toggleAnalyzer()
            })

            var pluginStyle = '.clappr-bandwidth-analyzer{top:2%;right:2%;height:'+this.options.height+';width:'+this.options.width+';'
                +'position:absolute;background-color:'+this.options.background+';z-index:9000;}.clappr-bandwidth-analyzer{'
                +'color:#fff!important;visibility:hidden}.clappr-bandwidth-analyzer-bandwidthChart{width:100%;height:calc(100% - 40px);'
                +'font-size:14px;line-height:1.2em}.clappr-bandwidth-analyzer .flot-text{color:#fff!important;}'
                +'.clappr-bandwidth-analyzer div.text{display:inline;padding-left:10px;font-size:12px;display:table-cell;}.clappr-bandwidth-analyzer.show{visibility:'
                +'visible;z-index:1}.border{border:'+this.options.border+'}'

            if (!this.isInit){
                this.$el = $(pluginHtml);
                $(this.core.$el).append(this.$el)

                var style = Styler.getStyleFor(pluginStyle, {
                    baseUrl: this.core.options.baseUrl}
                );
                this.$el.append(style);
                this.isInit = true
            }
        }



        //this.$analyzer = $(pluginHtml)
        //$(this.core.$el).append(this.$analyzer)
        //var style = Styler.getStyleFor(pluginStyle, {baseUrl: this.core.options.baseUrl});
        //this.$analyzer.append(style);
        //this.show()
        return this;
    }





    shouldRender (){
        try{
            var playback = this.core.getCurrentPlayback()
            var video_tag = playback.$el[0]

            if (!this.core.getCurrentContainer() || !$.plot || (video_tag.webkitVideoDecodedByteCount == null) ||
                (video_tag.webkitDroppedFrameCount == null) || (video_tag.webkitDecodedFrameCount == null)) {
                return false
            }
        }catch(e){
            return false
        }

        return true
    }



    getTitle(){
        return "Graph Analyzer"
    }

    humanizeDuration ( input ) {
        var days = Math.floor(input/(60*60*24));
        var hours = Math.floor((input-(days*(60*60*24)))/(60*60));
        var minutes = Math.floor( (input - ((days*(60*60*24)) + (hours*(60*60))) ) /60);
        var seconds = (input - ( (days*(60*60*24)) + (hours*(60*60)) + (minutes*60)) );
        var result = (days>0?days+' days ':'') + (hours>0?hours+' hours ':'') + (minutes>0?minutes+' minutes ':'')  + seconds + ' seconds'
        return result;
    }

    dom_update (){
        $('.'+this.container_class+' div.bandwidth span.text').text( ((this.lastByteRate*8)/1000) + ' k/bits' );
        $('.'+this.container_class+' div.totalPlayTime span.text').text( this.humanizeDuration(this.totalPlayTime) )
        $('.'+this.container_class+' div.totalDownload span.text').text( parseFloat(this.totalLastByteRate/(1024*1024)).toFixed(2) + ' MB' )
        $('.'+this.container_class+' div.totalFrames span.text').text( this.totalFrameCounts + ' Decoded frames' )
        $('.'+this.container_class+' div.dropFrames span.text').text( (this.droppedFrameCount + this.totalDroppedFrameCount) + ' Dropped frames' )
    }



    update (totalByteRate, droppedFrameCount, totalFrameCounts) {
        this.totalPlayTime++

        if(totalByteRate < this.tmpTotalLastByteRate){
            this.tmpTotalLastByteRate = 0;
        }
        this.lastByteRate = totalByteRate - this.tmpTotalLastByteRate;
        this.tmpTotalLastByteRate = this.tmpTotalLastByteRate + this.lastByteRate
        this.totalLastByteRate = this.totalLastByteRate + this.lastByteRate

        if(totalFrameCounts < this.tmpTotalFrameCounts){
            this.tmpTotalFrameCounts = 0;
        }
        this.lastFrameCounts = totalFrameCounts - this.tmpTotalFrameCounts;
        this.tmpTotalFrameCounts = this.tmpTotalFrameCounts + this.lastFrameCounts;
        this.totalFrameCounts = this.totalFrameCounts + this.lastFrameCounts;

        if(droppedFrameCount < this.droppedFrameCount){
            this.totalDroppedFrameCount = this.totalDroppedFrameCount + this.droppedFrameCount
        }
        this.droppedFrameCount = droppedFrameCount;

        //this.bandwidth.reverse();
        this.bandwidth.push([this.totalPlayTime,(this.lastByteRate*8)/1000])
        this.bandwidth.shift();
        this.av_bandwidth.push([this.totalPlayTime,((this.totalLastByteRate*8)/1000)/this.totalPlayTime])
        this.av_bandwidth.shift();

        //this.bandwidth.reverse();
        this.dom_update()
    }


    init (){

        var that = this;

        this.chart_class = 'clappr-bandwidth-analyzer-bandwidthChart';
        this.container_class = 'clappr-bandwidth-analyzer';

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

        this.currentTime = Math.floor(new Date().getTime()/1000)

        this.chart = {
            updateInterval:30,
            plot:null
        }

        for (var i=0;i<this.options.x_timeDuration;i++){
            this.bandwidth.push([i,null]);
            this.av_bandwidth.push([i,null]);
        }



        try{
            this.chart.plot = $.plot('.'+this.chart_class, [{ data: this.bandwidth, label: "Bandwidth"}, { data: this.av_bandwidth, label: "Average Bandwidth"}], {
            //this.chart.plot = $.plot('#'+this.dom_id, [ this.bandwidth ], {
                grid: {
                   color: '#ffffff',      // => primary color used for outline and labels
                   backgroundColor: null, // => null for transparent, else color
                   tickColor: '#ffffff',  // => color used for the ticks
                   labelMargin: 3,        // => margin in pixels
                   verticalLines: true,   // => whether to show gridlines in vertical direction
                   horizontalLines: true, // => whether to show gridlines in horizontal direction
                   outlineWidth: 2        // => width of the grid outline/border in pixels
                 },
                 series: {
                    shadowSize: 0,
                    lines: { show: true, fill: false},
                    points: { show: false, fill: false }
                },
                yaxis: {
                    min: this.options.y_min,
                    max: this.options.y_max,
                },
                xaxis: {
                    show: true,
                },
                colors: [ this.options.bandwidth.color, this.options.averageBandwidth.color],
                lineWidth:[ this.options.bandwidth.lineWidth, this.options.averageBandwidth.lineWidth]
            });
        }catch(e){

        }

        function appendContent($div, content) {
           $div.append(content).trigger($.Event('resize'));
        }


        this.listenTo(this.core.getCurrentPlayback(), Events.PLAYBACK_TIMEUPDATE, this.analyzer_update)
    }



    analyzer_update(){
        var now = Math.floor(new Date().getTime()/1000);
        if (this.currentTime != now){
            this.currentTime = now;
            try{
                var playback = this.core.getCurrentPlayback()
                var video_tag = playback.$el[0]
                this.update(video_tag.webkitVideoDecodedByteCount, video_tag.webkitDroppedFrameCount, video_tag.webkitDecodedFrameCount)
                this.chart_update()
            }catch(e){
                this.update(0, 0, 0)
            }
        }
    }


    chart_update () {
        this.bandwidth.forEach(function(obj,index){
            obj[0] = index
        })
        this.av_bandwidth.forEach(function(obj,index){
            obj[0] = index
        })
        this.chart.plot.setData([this.bandwidth, this.av_bandwidth]);
        this.chart.plot.draw();
    }

}




module.exports = window.ClapprBandwidthAnalyzer = ClapprBandwidthAnalyzer;
