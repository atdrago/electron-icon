'use strict';

const {
	app,
	BrowserWindow, 
	Menu
} = require('electron');

const util = require('./util');

const MENU_SEPARATOR = { type: 'separator' };

module.exports = {
	init() {
		this.createMenu();
	},
	
	createMenu() {
		this.template = [
			{
				label: 'Electron Icon',
				submenu: [
					{ label: 'Quit Electron Icon', accelerator: 'CommandOrControl+Q', click: () => app.quit() }
				]
			},
			{
				label: 'File',
				submenu: [
					{ label: 'Close Window', accelerator: 'CommandOrControl+W', role: 'close' },
					MENU_SEPARATOR,
					{
						label: 'Export',
						submenu: [
							{ label: 'As PNGs', accelerator: 'CommandOrControl+P', click: () => util.exportPngs() },
							{ label: 'As ICNS', accelerator: 'CommandOrControl+I', click: () => util.exportIcns() },
							{ label: 'As ICO', accelerator: 'CommandOrControl+U', click: () => util.exportIco() }
						]
					}
				]
			},
			{
				label: 'View',
				submenu: [
					{ label: 'Reload', accelerator: 'CommandOrControl+R', click: () => BrowserWindow.getFocusedWindow().reload() },
					{ label: 'Reload All', accelerator: 'Shift+CommandOrControl+R', click: () => util.reloadWindows() }
				]
			},
			{
				label: 'Window',
				submenu: [
					{ label: 'Arrange Windows', accelerator: 'CommandOrControl+A', click: () => util.arrangeWindows() },
					MENU_SEPARATOR,
					{ label: 'Minimize', accelerator: 'CommandOrControl+M', role: 'minimize' }
				]
			},
			{
				label: 'Debug',
				submenu: [
					{ label: 'Log Window Bounds', accelerator: 'CommandOrControl+L', click: () => util.logWindowBounds() },
					{ label: 'Toggle DevTools', accelerator: 'Alt+CommandOrControl+I', click: () => BrowserWindow.getFocusedWindow().toggleDevTools() }
				]
			}
		];
		
		const menu = Menu.buildFromTemplate(this.template);
		Menu.setApplicationMenu(menu);
	}
};
