/* ========================================================================
 * ProtoMorph Midnite: Version 1.0.0
 * @protomorph (http://protomorph.cf/)
 * ========================================================================
 * Copyright 2015
 * Licensed GNU General Public License, version 2 (GPL-2.0)
 * ======================================================================== */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement('style');

	msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
	document.querySelector('head').appendChild(msViewportStyle);
}

var supportMediaQuery = Modernizr.mq('only all');

if (!supportMediaQuery) {
	Modernizr.load([
		'//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js',
		'//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js'
	]);
}
