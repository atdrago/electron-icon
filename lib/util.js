'use strict';

const electronWindow  = require('electron-window');
const fs              = require('fs');
const icongen         = require('icon-gen');
const jimp            = require('jimp');
const LayoutBound     = require('./layout-bound');
const {
	app,
	dialog,
	nativeImage 
} = require('electron');

// @TODO Make this an env var
const ICON_DIR = 'png';

module.exports = {
	arrangeWindows() {
		const bounds = [];
		
		for (const key in electronWindow.windows) {
			if (electronWindow.windows.hasOwnProperty(key)) {
				bounds.push(electronWindow.windows[key].getBounds());
			}
		}
		
		let currentLayoutBound;
		
		bounds.sort((a, b) => b.width - a.width).forEach((bound) => {
			if (!currentLayoutBound) {
				return currentLayoutBound = new LayoutBound(bound);
			}
			
			if (!currentLayoutBound.nextNeighborPosition()) {
				bound.x = currentLayoutBound.middleNeighborBounds.x + currentLayoutBound.middleNeighborBounds.width;
				bound.y = currentLayoutBound.middleNeighborBounds.y;
				
				currentLayoutBound = new LayoutBound(currentLayoutBound.middleNeighborBounds);
			} else {
				let nextNeighborPosition = currentLayoutBound.nextNeighborPosition();
				
				bound.x = nextNeighborPosition.x;
				bound.y = nextNeighborPosition.y;
			}
			
			currentLayoutBound.addNeighbor(bound);
		});
		
		for (const key in electronWindow.windows) {
			if (electronWindow.windows.hasOwnProperty(key)) {
				const _window = electronWindow.windows[key];
				const bound = bounds.find((bound) => bound.width === _window.getSize()[0]);
				
				_window.setBounds(bound, true);
			}
		}
	},
	
	captureAndCreateIcons() {
		return this.captureIcons()
			.then(() => this.createIcons())
			.catch((err) => {
				throw err
			});
	},
	
	captureIcon(_window, dir) {
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
							
							img.write(`${dir}/${bounds.width}.png`, (err) => {
								if (err) {
									reject(err);
								}
								
								console.log(`${dir}/${bounds.width}.png captured.`);
								resolve();
							});
						});
					});
				} else {
					fs.writeFile(`${dir}/${bounds.width}.png`, buffer, (err) => {
						if (err) {
							reject(err);
						}
						
						console.log(`${dir}/${bounds.width}.png captured.`);
						resolve();
					});
				}
			});
		});
	},
	
	captureIcons(dir) {
		return new Promise((resolve, reject) => {
			fs.mkdir(dir || ICON_DIR, (err) => {
				if (err && err.code !== 'EEXIST') {
					reject(err);
				}
				
				const promises = [];
				
				for (const key in electronWindow.windows) {
					if (electronWindow.windows.hasOwnProperty(key)) {
						const _window = electronWindow.windows[key];
						
						promises.push(this.captureIcon(_window, dir || ICON_DIR));
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
	
	exportPngs() {
		const dirs = dialog.showOpenDialog({
			title: 'Choose Folder to Save PNGs',
			defaultPath: app.getPath('documents'),
			buttonLabel: 'Export',
			properties: [ 'createDirectory', 'openDirectory' ]
		});
		
		if (dirs) {
			const dir = dirs[0];
		}
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