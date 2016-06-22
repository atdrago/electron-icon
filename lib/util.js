'use strict';

const electronWindow  = require('electron-window');
const fs              = require('fs');
const icongen         = require('icon-gen');
const jimp            = require('jimp');
const { nativeImage } = require('electron');

// @TODO Make this an env var
const ICON_DIR = 'png';

module.exports = {
	captureAndCreateIcons() {
		return this.captureIcons()
			.then(() => {
				return this.createIcons();
			})
			.catch((err) => {
				throw err;
			});
	},
	
	captureIcon(_window) {
		const bounds = _window.getBounds();
		
		return new Promise((resolve, reject) => {
			_window.capturePage((image) => {
				const size = image.getSize();
				let buffer = image.toPng();
				
				// On high-pixel-density displays, window's bounds will be smaller
				// than the image's size.
				if (bounds.width < size.width) {
					const scaleFactor = bounds.width / size.width;
					// resize the image down to 1x dimensions
					// buffer = nativeImage.createFromBuffer(buffer, scaleFactor).toPng();
					
					jimp.read(buffer, (err, img) => {
						if (err) {
							reject(err);
						}
						
						img.scale(scaleFactor, (err, img) => {
							if (err) {
								reject(err);
							}
							
							img.write(`${ICON_DIR}/${bounds.width}.png`, (err) => {
								if (err) {
									reject(err);
								}
								
								console.log(`${ICON_DIR}/${bounds.width}.png captured.`);
								resolve();
							});
						});
					});
				} else {
					fs.writeFile(`${ICON_DIR}/${bounds.width}.png`, buffer, (err) => {
						if (err) {
							reject(err);
						}
						
						console.log(`${ICON_DIR}/${bounds.width}.png captured.`);
						resolve();
					});
				}
			});
		});
	},
	
	captureIcons() {
		return new Promise((resolve, reject) => {
			fs.mkdir(ICON_DIR, (err) => {
				if (err && err.code !== 'EEXIST') {
					reject(err);
				}
				
				const promises = [];
				
				for (const key in electronWindow.windows) {
					if (electronWindow.windows.hasOwnProperty(key)) {
						const _window = electronWindow.windows[key];
						
						promises.push(this.captureIcon(_window));
					}
				}
				
				Promise.all(promises)
					.then(() => resolve())
					.catch((err) => reject(err));
			});
		});
	},
	
	createIcons() {
		return icongen(`${ICON_DIR}`, './', { type: 'png', report: true, modes: ['ico', 'icns'] });
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