'use strict';

const electronWindow = require('electron-window');
const fs             = require('fs');

const ICON_DIR = 'app.iconset';

module.exports = {
	captureIcons() {
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
			const png = image.toPng();
			
			if (bounds.width < 512) {
				fs.writeFile(`${ICON_DIR}/icon_${bounds.width * 2}x${bounds.height * 2}.png`, png);
			}
			
			if (bounds.width >= 16) {
				fs.writeFile(`${ICON_DIR}/icon_${bounds.width}x${bounds.height}@2x.png`, png);
			}
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