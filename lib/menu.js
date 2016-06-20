'use strict';

const {
	app,
	BrowserWindow, 
	Menu
} = require('electron');

const util = require('./util');

module.exports = {
	init() {
		this.createMenu();
	},
	
	createMenu() {
		this.template = [
			{
				label: 'Electron Icon',
				submenu: [
					{ label: 'Quit Electron Icon', accelerator: 'Command+Q', click: () => app.quit() }
				]
			},
			{
				label: 'File',
				submenu: [
					{ label: 'Close Window', accelerator: 'Command+W', role: 'close' },
				]
			},
			{
				label: 'View',
				submenu: [
					{ label: 'Capture Icons', accelerator: 'Command+G', click: () => util.captureIcons() },
					{ label: 'Create Icons', accelerator: 'Command+I', click: () => util.createIcons() },
					{ label: 'Log Window Bounds', accelerator: 'Command+L', click: () => util.logWindowBounds() },
					{ type: 'separator' },
					{ label: 'Reload', accelerator: 'Command+R', click: () => util.reloadWindows() },
					{ label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: () => BrowserWindow.getFocusedWindow().toggleDevTools() }
				]
			},
			{
				label: 'Window',
				submenu: [
					{ label: 'Minimize', accelerator: 'Command+M', role: 'minimize' }
				]
			}
		];
		
		const menu = Menu.buildFromTemplate(this.template);
		Menu.setApplicationMenu(menu);
	}
};
