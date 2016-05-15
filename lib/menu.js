'use strict';

const {
	app,
	BrowserWindow, 
	Menu
} = require('electron');

let electronWindow;

const MENU_SEPARATOR = { type: 'separator' };

module.exports = {
	init() {
		this.createMenu();
	},
	
	createMenu() {
		function reloadWindows() {
			electronWindow = require('electron-window');
			
			// console.log(electronWindow.windows);
			
			for (const key in electronWindow.windows) {
				electronWindow.windows[key].reload();
			}
		}
		
		this.template = [
			{
				label: 'Negative Icon',
				submenu: [
					{ label: 'Quit Negative Icon', accelerator: 'Command+Q', click: () => app.quit() }
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
					{ label: 'Reload', accelerator: 'Command+R', click: reloadWindows },
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
