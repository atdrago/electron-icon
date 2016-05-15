'use strict';

const {
	app,
	BrowserWindow, 
	Menu
} = require('electron');

const objc           = require('nodobjc');
const electronWindow = require('electron-window');

const MENU_SEPARATOR = { type: 'separator' };

module.exports = {
	init() {
		objc.framework('Cocoa');
		this.createMenu();
	},
	
	createMenu() {
		function reloadWindows() {
			for (const key in electronWindow.windows) {
				electronWindow.windows[key].reload();
			}
		}
		
		function captureIcons() {
			const pool     = objc.NSAutoreleasePool('alloc')('init');
			for (const key in electronWindow.windows) {
				const _window = electronWindow.windows[key];
				
				if (_window) {
					_window.focus();
					
					const bounds = _window.getBounds();
					
					/* eslint-disable new-cap */
					const rect     = objc.NSMakeRect(bounds.x, bounds.y, bounds.width, bounds.height);
					const windowId = objc.NSApplication('sharedApplication')('keyWindow')('windowNumber');
					const cgImage  = objc.CGWindowListCreateImage(rect, objc.kCGWindowListOptionIncludingWindow, windowId, objc.kCGWindowImageDefault);
					const newRep   = objc.NSBitmapImageRep('alloc')('initWithCGImage', cgImage);
					/* eslint-enable new-cap */

					newRep('setSize', rect.size);

					const pngData = newRep('representationUsingType', objc.NSPNGFileType, 'properties', null);
					const error = objc.alloc(objc.NSError).ref();
					
					if (bounds.width < 1024) {
						pngData('writeToFile', 
							objc(`negative.iconset/icon_${bounds.width * 2}x${bounds.height * 2}.png`), 
							'options', 
							objc.NSDataWritingAtomic, 
							'error', 
							error
						);
					}
					
					if (bounds.width >= 16) {
						pngData('writeToFile', 
							objc(`negative.iconset/icon_${bounds.width}x${bounds.height}@2x.png`), 
							'options', 
							objc.NSDataWritingAtomic, 
							'error', 
							error
						);
					}
					
				}
			}
			pool('drain');
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
					{ label: 'Capture', accelerator: 'Command+G', click: captureIcons },
					MENU_SEPARATOR,
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
