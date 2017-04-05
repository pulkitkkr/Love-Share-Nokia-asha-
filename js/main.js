/*
This template demonstrates how to make Video Browsing application accessing Youtube API. 
More info at
    https://developers.google.com/youtube/
*/
var maxVideos = 5;
var googleBaseUrl = "http://gdata.youtube.com/feeds/api/standardfeeds/on_the_web?v=2&alt=jsonc";
var isLandscape = window.innerWidth > 240;

function init() {
    loadTrendingVideos();
}

function mainView() {
    mwl.setGroupTarget('#content', '#main', 'show', 'hide');
    mwl.switchClass('#backToMainIcon', 'show', 'hide');
    $('#errDiv').html('');
}

function allVideos() {
    mwl.setGroupTarget('#content', '#searchResult', 'show', 'hide');
    mwl.switchClass('#backToMainIcon', 'hide', 'show');
    $('#resultList').html('');
    loadAllVideos();
}

function loadTrendingVideos() {
    $.ajax({
        url: googleBaseUrl,
        dataType: 'json',
        async: false,
        crossDomain: false,
        success: function(data, textStatus, jqXHR) {
            var items = [];
            var count = 0;
            $.each(data.data.items, function() {
            	if (!this.viewCount) return true; // filter rejected/deleted
                items.push({
                	imageUrl: this.thumbnail.sqDefault, 
                	width: '120', 
                	height: '90', 
                	link: this.player.mobile ? this.player.mobile : null,
        		    title: this.title,
	                duration: this.duration,
	                viewCount: this.viewCount
	            });
                count++;
                if (count >= 5) return false;
            });
            addToGallery(items);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#errDiv').html('<b>ERROR</b>: '+textStatus+errorThrown);
        }
    });
}

function loadAllVideos() {
    $.ajax({
        url: googleBaseUrl,
        dataType: 'json',
        async: false,
        crossDomain: false,
        success: function(data, textStatus, jqXHR) {
        	var count = 0;
            $.each(data.data.items, function() {
                if (!this.viewCount) return true; // filter rejected/deleted
                var item = {};
                var id = this.id;
                item.title = this.title;
                item.duration = this.duration;
                item.viewCount = this.viewCount;
                item.imageUrl = this.thumbnail.sqDefault;
                item.link = this.player.mobile ? this.player.mobile : null;
                addVideoItem(id, item);
                count++;
                if (count >= maxVideos) return false;
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#errDiv').html('<b>ERROR</b>: '+textStatus+errorThrown);
        }
    });
}

function addVideoItem(id, item) {
    var desc = '<div>'
        + '<div class="itemTitle">' + item.title + '</div>'
        + '<div class="itemDuration">' + formatTime(item.duration) + '</div>'
        + '<div class="itemViewCount">' + item.viewCount + ' views</div>'
        + '</div>';
    var link = item.link ? 'onclick="mwl.loadURL(\'' + item.link + '\');"' : '';
    $('#resultList').append('<tr class="itemRow">'
            + '<td class="videoItemImage" ' + link + '>'
            + '<img src="' + item.imageUrl + '" width="80" height="60"/>'
            + '<div class="listOverlay"><img src="s40-theme/images/video_play_overlay_33.png"/>"</div>'
            + '</td><td>' + desc + '</td>'
            + '</tr>');
}

function addToGallery(items) {
    var imgHtml = '<table id="galleryInner" class="im0" border="0" cellspacing="0" cellpadding="0"><tr>';
    var videoInfo = '';
    for (i in items) {
        var item = items[i];
        var last = (items.indexOf(item) == items.length - 1) ? " lastImg" : "";
        var dim = ''; 
        if (item.width && item.height) {
            dim = 'width="' + item.width + '" height="' + item.height + '" ';
        }
        var link = item.link ? 'onclick="mwl.loadURL(\'' + item.link + '\');"' : '';
        imgHtml += '<td class="imgHolder' + last + '" ' + link + '><div class="imgInner"><img src="' + item.imageUrl + '" ' + dim + '/></div><div class="overlay"><img src="s40-theme/images/video_play_overlay.png"/></div></td>';
        
        // video info
        videoInfo += '<div class="info">'
	        + '<div class="itemTitle">' + item.title.trunc(isLandscape?36:28, true) + '</div>'
	        + '<div class="itemDuration">' + formatTime(item.duration) + '</div>'
	        + '<div class="itemViewCount">' + item.viewCount + ' views</div>'
	        + '</div>';
    }
    imgHtml += '</tr></table>';
    $('#gallery').html(imgHtml);
    $('#videoInfo').html(videoInfo);
}

//Helper function for nodes names that include a prefix and a colon, such as "<media:thumbnail>"
function getElementByNodeName(parentNode, nodeName) {   
    var colonIndex = nodeName.indexOf(":");
    var tag = nodeName.substr(colonIndex + 1);
    var nodes = parentNode.getElementsByTagNameNS("*", tag);
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName == nodeName) return nodes[i];
    }
    return undefined;
}

function formatTime(time) {
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if (seconds < 10) seconds = "0" + seconds;
    if (hours > 0) {
        if (minutes < 10) minutes = "0" + minutes;
        return hours + ":" + minutes + ":" + seconds;
    } else if (minutes > 0) {
        return minutes + ":" + seconds + " mins";
    } else {
        return seconds + " secs";
    }
}

String.prototype.trunc = function(n,useWordBoundary){
	var toLong = this.length>n,
    s_ = toLong ? this.substr(0,n-1) : this;
    s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	return  toLong ? s_ + '&hellip;' : s_;
};