/* ========================================================================
 * YouTube Embed: Version 0.1.0
 * @protomorph (http://protomorph.cf/)
 * ========================================================================
 * Copyright 2015
 * Licensed GNU General Public License, version 2 (GPL-2.0)
 * ======================================================================== */
;(function ($, window, document, undefined) {
	'use strict';

	// YOUTUBEEMBED CLASS DEFINITION
	// =============================

	var YoutubeEmbed = function (element) {
		this._element	= $(element);

		this.options	= defaults;

		this._name		= 'youtubeembed';
		this._version	= '0.1.0';

		this.init();
	};

	var defaults = {
		autoplay: 1
	};

	YoutubeEmbed.prototype.init = function () {
		var self			= this,
			videourl		= this._element.data('youtube-video'),
			youtuberegex	= /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/,
			playlistregex	= /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?((v=[^&\s]*&list=[^&\s]*)|(list=[^&\s]*&v=[^&\s]*))(&[^&\s]*)*$/,
			ytplaylistregex	= /^(?:https?:\/\/)?(?:www\.)?youtube.*playlist\?list=([a-zA-Z0-9\-_]+)/,
			videoframe,
			videoid,
			videoimage,
			videotitle;

		this._element.wrap('<div class="video-container"/>');

		if (videourl.match(playlistregex)) {
			videoid		= videourl.match(playlistregex);
			videoframe	= this.frame(this.playlist(videoid[1].split('list=')[1]));
			videoimage	= 'https://gdata.youtube.com/feeds/api/playlists/' +
						videoid[1].split('list=')[1] +
						'?v=2&alt=jsonc&max-results=1&format=5';

			this.loader(videoimage)
				.done(function (data) {
					self.image(data.data.thumbnail.hqDefault);
					self._element.append('<span class="video-title">' + data.data.title + '</span>');
				});
		} else if (videourl.match(ytplaylistregex)) {
			videoid		= videourl.match(ytplaylistregex);
			videoframe	= this.frame(this.playlist(videoid[1]));
			videoimage	= 'https://gdata.youtube.com/feeds/api/playlists/' + videoid[1] +
						'?v=2&alt=jsonc&max-results=1&format=5';

			this.loader(videoimage)
				.done(function (data) {
					self.image(data.data.thumbnail.hqDefault);
					self._element.append('<span class="video-title">' + data.data.title + '</span>');
				});
		} else if (videourl.match(youtuberegex)) {
			videoid		= videourl.match(youtuberegex);
			videoframe	= this.frame(this.src(videoid[1]));
			videoimage	= 'http://i.ytimg.com/vi/' + videoid[1] + '/hqdefault.jpg';
			videotitle	= 'https://gdata.youtube.com/feeds/api/videos/' + videoid[1] +
						'?v=2&alt=jsonc&format=5';

			this.loader(videotitle)
				.done(function (data) {
					self._element.append('<span class="video-title">' + data.data.title + '</span>');
				});

			this.image(videoimage);
		}

		this._element.on('click', function (e) {
			$(this).replaceWith(videoframe);

			e.preventDefault();
		});
	};

	YoutubeEmbed.prototype.loader = function (url) {
		return $.ajax({
			url: url,
			dataType: 'jsonp'
		});
	};

	YoutubeEmbed.prototype.frame = function (src) {
		return $('<iframe class="video-frame" src="' +src + '" webkitallowfullscreen mozallowfullscreen allowfullscreen />');
	};

	YoutubeEmbed.prototype.image = function (image) {
		this._element.css({
			'backgroundImage': 'url("' + image + '")',
			'backgroundSize': '100% 135%'
		}).append('<span class="play-icon"></span>');
	};

	YoutubeEmbed.prototype.playlist = function (id) {
		return 'http://www.youtube.com/embed/videoseries?list=' + id +
				'&rel=0&autoplay=' + this.options.autoplay +
				'&autohide=1&controls=2&showinfo=0&wmode=transparent';
	};

	YoutubeEmbed.prototype.src = function (id) {
		return 'http://www.youtube.com/embed/' + id +
				'?rel=0&autoplay=' + this.options.autoplay +
				'&autohide=1&controls=2&showinfo=0&wmode=transparent';
	};

	// PLUGIN DEFINITION
	// =================

	function Plugin() {
		return this.each(function () {
			var self	= $(this),
				data	= self.data('pr.youtubeembed');

			if (!data) self.data('pr.youtubeembed', (data = new YoutubeEmbed(this)));
		});
	}

	var old = $.fn.youtubeembed;

	$.fn.youtubeembed				= Plugin;
	$.fn.youtubeembed.Constructor	= YoutubeEmbed;

	// PLUGIN NO CONFLICT
	// ==================

	$.fn.youtubeembed.noConflict = function () {
		$.fn.youtubeembed = old;
		return this;
	};

})(jQuery, window, document);
