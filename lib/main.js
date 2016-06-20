'use strict';

const { 
	app
} = require('electron');

const electronWindow = require('electron-window');
const menu           = require('./menu');
const path           = require('path');

const ORIGIN = { x: 4, y: 23 };
const BOUNDS = [
	{ x: ORIGIN.x,        y: ORIGIN.y,        width: 1024, height: 1024 }, // ic10       -          512x512@2x
	{ x: ORIGIN.x + 1024, y: ORIGIN.y,        width: 512,  height: 512 },  // ic09, ic14 - 512×512, 256x256@2x
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 512,  width: 256,  height: 256 },  // ic08, ic13 - 256×256, 128x128@2x
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 768,  width: 128,  height: 128 },  // ic07       - 128x128
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 896,  width: 64,   height: 64 },   // icp6, ic12 -   64x64, 32x32@2x
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 960,  width: 48,   height: 48 },   // ico
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 1008, width: 32,   height: 32 },   // icp5, ic11 -   32x32, 16x16@2x
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 1040, width: 24,   height: 24 },   // ico
	{ x: ORIGIN.x + 1024, y: ORIGIN.y + 1064, width: 16,   height: 16 }    // icp4       -   16x16
];

app.commandLine.appendSwitch('enable-transparent-visuals');

app.on('ready', () => {
	menu.init();
	
	for (const bound of BOUNDS) {
		const _window = electronWindow.createWindow({
			width: bound.width,
			height: bound.height, 
			hasShadow: false,
			frame: false,
			transparent: true,
			resizable: false,
			x: bound.x,
			y: bound.y
		});
		
		_window.showUrl(path.resolve(__dirname, '../view/index.html'));
	}
});
