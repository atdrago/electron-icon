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
	
	const sizes = [
		{ width: 512, height: 512 },
		{ width: 256, height: 256 },
		{ width: 128, height: 128 },
		{ width: 64, height: 64 },
		{ width: 32, height: 32 },
		{ width: 16, height: 16 },
		{ width: 8, height: 8 }
	];
	
	for (const size of sizes) {
		const _window = electronWindow.createWindow({
			width: size.width, 
			height: size.height, 
			hasShadow: false,
			frame: false,
			transparent: true,
			resizable: false
		});
		
		_window.showUrl(path.resolve(__dirname, '../view/index.html'));
	}
});