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
		{ x: 4, y: 23, width: 512, height: 512 },
		{ x: 457, y: 23, width: 256, height: 256 },
		{ x: 490, y: 261, width: 128, height: 128 },
		{ x: 495, y: 382, width: 64, height: 64 },
		{ x: 495, y: 450, width: 32, height: 32 },
		{ x: 482, y: 486, width: 16, height: 16 },
		{ x: 466, y: 500, width: 8, height: 8 }
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
