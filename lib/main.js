'use strict';

const { 
	app
} = require('electron');

const electronWindow = require('electron-window');
const menu           = require('./menu');
const path           = require('path');

app.commandLine.appendSwitch('enable-transparent-visuals');

app.on('ready', () => {
	menu.init();
	
	const bounds = [
		{ width: 1024, height: 1024, x: 0, y: 23 },
		{ width: 512, height: 512, x: 960, y: 23 },
		{ width: 256, height: 256, x: 1002, y: 532 },
		{ width: 128, height: 128, x: 938, y: 762 },
		{ width: 64, height: 64, x: 877, y: 867 },
		{ width: 32, height: 32, x: 832, y: 919 },
		{ width: 16, height: 16, x: 802, y: 945 }
	];
	
	for (const bound of bounds) {
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
