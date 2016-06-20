'use strict';

const electronWindow  = require('electron-window');
const fs              = require('fs');
const icongen         = require('icon-gen');
const { nativeImage } = require('electron');

// @TODO Make this an env var
const ICON_DIR = 'app.iconset';

module.exports = {
	captureIcons() {
		// @TODO report err
		fs.mkdir(ICON_DIR, () => {
			for (const key in electronWindow.windows) {
				if (electronWindow.windows.hasOwnProperty(key)) {
					const _window = electronWindow.windows[key];
					
					this.captureIcon(_window);
				}
			}
		});
	},
	
	captureIcon(_window) {
		const bounds = _window.getBounds();
		
		_window.capturePage((image) => {
			const size = image.getSize();
			let buffer;
			
			// On high-pixel-density displays, window's bounds will be smaller
			// than the image's size.
			if (bounds.width < size.width) {
				let scaleFactor = bounds.width / size.width;
				// resize the image down to 1x dimensions
				buffer = nativeImage.createFromBuffer(image.toPng(), scaleFactor).toPng();
			} else {
				buffer = image.toPng();
			}
			
			// @TODO report err
			fs.writeFile(`${ICON_DIR}/${bounds.width}.png`, buffer);
		});
	},
	
	createIcons() {
		icongen(`${ICON_DIR}`, './', { type: 'png', report: true, modes: ['ico', 'icns'] })
			.then((results) => {
				console.log(results);
			})
			.catch((err) => {
				console.error(err);
			});
	},
	
	logWindowBounds() {
		for (const key in electronWindow.windows) {
			if (electronWindow.windows.hasOwnProperty(key)) {
				console.log(electronWindow.windows[key].getBounds());
			}
		}
	},
	
	reloadWindows() {
		for (const key in electronWindow.windows) {
			if (electronWindow.windows.hasOwnProperty(key)) {
				electronWindow.windows[key].reload();
			}
		}
	}
};