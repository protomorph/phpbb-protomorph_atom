/* ========================================================================
 * ProtoMorph Atom: Version 1.0.0
 * @protomorph (http://protomorph.cf/)
 * ========================================================================
 * Copyright 2015
 * Licensed GNU General Public License, version 2 (GPL-2.0)
 * ======================================================================== */
;(function ($, window, document, undefined) {
	'use strict';

	var ProtomorphAtom = function (element) {
		this.element	= $(element);
		this.options	= defaults;

		this._name		= 'protomorphatom';
		this._version	= '1.0.0';

		this.init();
	};

	// default options
	var defaults = {
		duration: 400,			// Drop down menu slide & Scroll top button fade durations.
		ease: 'easeInOutCirc',	// Ease type, more can be found here: http://easings.net/
		external: true,			// Set to false if you don't want external links to open in a new tab/window.
		fade: 200,				// Tool tips fade in duration.
		offset: 250,			// Offset from to before to top button shows.
		totoptime: 800,			// Scroll to top duration.
		share: true				// Enable share post buttons.
	};

	ProtomorphAtom.prototype.init = function () {
		var self = this;

		this.offcanvasmenu();
		this.scrolltotop();

		if (this.options.share) this.sharepost();

		// CUSTOM CHECKBOXES & RADIO INPUTS
		$('[type="checkbox"]').wrap('<label class="checkbox-custom"></label>')
			.after('<i class="checkbox-icon"></i>');

		$('[type="radio"]').wrap('<label class="radio-custom"></label>')
			.after('<i class="radio-icon"></i>');
		// ================================

		// EXTERNAL LINKS
		if (this.options.external) $('a').filter(function () {
				return this.hostname && this.hostname !== location.hostname;
			}).addClass('external').prop({
				target: '_blank',
				rel: 'nofollow'
			});
		// ==============

		// HIGHLIGHT.JS
		hljs.configure({
			tabReplace: '	',
			useBR: true
		});

		$('.codebox code, pre').each(function (i, block) {
			hljs.highlightBlock(block);
		});
		// ============

		// REMOVE UN-NEEDED ATTRIBUTES
		$('.icon_topic_latest').parent().removeAttr('title');

		$('.dropdown .small-icon > a').removeAttr('title');

		$('.modtools-icon').text('');

		$('#qr_postform #message-box textarea').removeAttr('style');
		// ===========================

		// STICKY SEPERATOR
		$('.forumbg:not(.recent-topics) .topiclist.topics').each(function () {
			$(this).find('.global-announce')
				.last().addClass('last').end()
				.find('.announce')
				.last().addClass('last').end()
				.find('.sticky')
				.last().addClass('last');
		});
		// ================

		// TOOLTIP
		$('[title]').tooltip({
			container: 'body',
			delay: {
				show: self.options.fade,
				hide: self.options.fade / 2
			}
		});
		// =======

		// AUTO ADD YOUTUBE
		$('.postbody a').filter(function () {
			if (this.href.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/)/)) {
				var youtuberegex	= /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/,
					playlistregex	= /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?((v=[^&\s]*&list=[^&\s]*)|(list=[^&\s]*&v=[^&\s]*))(&[^&\s]*)*$/,
					ytplaylistregex	= /^(?:https?:\/\/)?(?:www\.)?youtube.*playlist\?list=([a-zA-Z0-9\-_]+)/,
					videourl		= $(this).attr('href');

				if (videourl.match(playlistregex) ||
					videourl.match(ytplaylistregex) ||
					videourl.match(youtuberegex)) {
					$(this).attr({
						'data-youtube-video': $(this).attr('href')
					});

					$(this).removeClass('external').text('').youtubeembed();

					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		});
		// ================
	};

	ProtomorphAtom.prototype.offcanvasmenu = function () {
		var self		= this,
			offcanvas	= '[data-toggle="off-canvas"]',
			button		= this.element.find(offcanvas),
			menu		= button.parents('.main-page'),
			toggle		= $('[data-toggle="dropdown"]'),
			dropdown	= toggle.parent('.dropdown'),
			ddmenu		= toggle.next('.dropdown-menu');

		function hideMenu (e) {
			menu.removeClass('in').trigger(e = $.Event('hide.pr.menu'));
		}

		function showMenu (e) {
			menu.addClass('in').trigger(e = $.Event('show.pr.menu'));
		}

		function hiddenMenu () {
			menu.trigger('hidden.pr.menu');
		}

		function showingMenu () {
			menu.trigger('showing.pr.menu');
		}

		function hideDropdown (e) {
			dropdown.removeClass('open')
				.trigger(e = $.Event('hide.pr.dropdown'));

			ddmenu.stop(true, false)
				.slideUp(self.options.duration, self.options.ease);
		}

		function showDropdown (e) {
			dropdown.addClass('open')
				.trigger(e = $.Event('show.pr.dropdown'));

			ddmenu.stop(true, false)
				.slideDown(self.options.duration, self.options.ease);
		}

		function hiddenDropdown () {
			dropdown.trigger('hidden.pr.dropdown');
		}

		function showingDropdown () {
			dropdown.trigger('showing.pr.dropdown');
		}

		button.on('click touchstart', function (e) {
			if (e) e.preventDefault();

			if (menu.hasClass('in')) {
				hideMenu(e);

				menu.one($.transition, hiddenMenu);
			} else {
				showMenu(e);

				menu.one($.transition, showingMenu);
			}
		});

		toggle.on('click touchstart', function (e) {
			if (e) e.preventDefault();

			if (dropdown.hasClass('open')) {
				hideDropdown(e);

				dropdown.one($.transition, hiddenDropdown);
			} else {
				showDropdown(e);

				dropdown.one($.transition, showingDropdown);
			}
		});

		$('body').on('click touchstart', function (e) {
			if (!$(e.target).is(offcanvas) &&
				!$(e.target).is('.navbar-off-canvas') &&
				!$(e.target).parents().is('.navbar-off-canvas')) {
				hideMenu(e);

				menu.one($.transition, hiddenMenu);
			}

			if (!$(e.target).is('.dropdown-menu') && !$(e.target).parents().is('.dropdown')) {
				hideDropdown(e);

				dropdown.one($.transition, hiddenDropdown);
			}
		});
	};

	ProtomorphAtom.prototype.scrolltotop = function () {
		var self	= this,
			totop	= this.element.find('.scroll-to-top'),
			hidden	= true,
			offset	= this.options.offset;

		function scrollHide (e) {
			totop.stop(true, false)
				.fadeOut(self.options.duration, self.options.ease)
				.trigger(e= $.Event('hidden.pr.scolling'));
		}

		function scrollShow (e) {
			totop.stop(true, false)
				.fadeIn(self.options.duration, self.options.ease)
				.trigger(e = $.Event('showing.pr.scolling'));
		}

		$(window).on('scroll load', function (e) {
			var wintop = $(this).scrollTop();

			if (wintop > offset && hidden) {
				scrollShow(e);
				hidden = false;
			} else if (wintop <= offset && !hidden) {
				scrollHide(e);
				hidden = true;
			}
		});

		totop.on('click touchstart', function (e) {
			if (e) e.preventDefault();

			$('html, body').animate({scrollTop: 0}, self.options.totoptime, self.options.ease);

			totop.trigger(e = $.Event('backtotop.pr.scrolling'));
		});
	};

	ProtomorphAtom.prototype.sharepost = function () {
		$('.post .postbody').find('.post-buttons')
			.after('<ul class="post-buttons share-buttons"/>');

		var lang			= $('[http-equiv="content-language"]').attr('content').split('-'),
			sharebuttons	= $('.post .postbody').find('.post-buttons.share-buttons');

		function buttons () {
			return '<li><a class="button share-button facebook-button" href="#" data-share="facebook">' +
				'<i class="fa fa-facebook"></i></a></li>' +
				'<li><a class="button share-button google-plus-button" href="#" data-share="googleplus">' +
				'<i class="fa fa-google-plus"></i></a></li>' +
				'<li><a class="button share-button twitter-button" href="#" data-share="twitter">' +
				'<i class="fa fa-twitter"></i></a></li>';
		}

		if (!$('.post').parent().is('#topicreview')) sharebuttons.append(buttons());

		var sharelink = $('[data-share]');

		sharelink.each(function () {
			var share	= $(this),
				site	= share.data('share'),
				anchor	= (share.parents('.postbody').find('h3:first > a').attr('href') !== undefined) ?
							share.parents('.postbody').find('h3:first > a').attr('href') : '',
				network	= {
					facebook: function () {
						window.open('http://www.facebook.com/sharer/sharer.php?u=' +
							encodeURIComponent(document.location.href + anchor) +
							'&t=' + encodeURIComponent(document.title),'facebook',
							'toolbar=no,status=0,width=750,height=500');
					},
					googleplus: function () {
						window.open('https://plus.google.com/share?hl=' + encodeURIComponent(lang[0]) +
						'&url=' + encodeURIComponent(document.location.href + anchor),'google',
						'toolbar=no,status=0,width=500,height=500');
					},
					twitter: function () {
						window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) +
						'&url=' + encodeURIComponent(document.location.href + anchor),'twitter',
						'toolbar=no,status=0,width=650,height=360');
					}
				};

			share.on('click touchstart', function (e) {
				if (e) e.preventDefault();

				network[site]();
			});
		});
	};

	// TRANSITION END : Shoutout: http://getbootstrap.com/

	function transitionEndEvent () {
		var el = document.createElement('protomorph');

		var transitionEndNames = {
			'WebkitTransition'	: 'webkitTransitionEnd',
			'MozTransition'		: 'transitionend',
			'msTransition'		: 'MSTransitionEnd',
			'OTransition'		: 'oTransitionEnd',
			'transition'		: 'transitionend'
		};

		for (var name in transitionEndNames) {
			if (el.style[name] !== undefined) return transitionEndNames[name];
		}

		return false;
	}

	$.transition = transitionEndEvent();

	// PLUGIN DEFINITION
	// =================

	function Plugin() {
		return this.each(function () {
			var self	= $(this),
				data	= self.data('pr.protomorphatom');

			if (!data) self.data('pr.protomorphatom', (data = new ProtomorphAtom(this)));
		});
	}

	var old = $.fn.protomorphatom;

	$.fn.protomorphatom				= Plugin;
	$.fn.protomorphatom.Constructor	= ProtomorphAtom;

	// PLUGIN NO CONFLICT
	// ==================

	$.fn.protomorphatom.noConflict = function () {
		$.fn.protomorphatom = old;
		return this;
	};

	$(document).protomorphatom();

})(jQuery, window, document);
