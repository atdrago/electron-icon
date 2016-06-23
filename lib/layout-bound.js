'use strict';

class LayoutBound {
	get lastNeighborBounds() {
		return this.neighbors[this.neighbors.length - 1]
	}
	
	get middleNeighborBounds() {
		return this.neighbors[this.neighbors.length - 2]
	}
	
	constructor(bounds) {
		this.bounds = bounds;
		this.neighbors = [];
	}
	
	addNeighbor(bound) {
		this.neighbors.push(bound);
	}
	
	nextNeighborPosition() {
		let y;
		
		if (this.neighbors.length === 0) {
			return {
				x: this.bounds.x + this.bounds.width,
				y: this.bounds.y
			};
		} else if (this.neighbors.length < 3) {
			const lastNeighborBounds = this.lastNeighborBounds;
			
			return {
				x: this.bounds.x + this.bounds.width,
				y: lastNeighborBounds.y + lastNeighborBounds.height
			};
		}
	}
};

module.exports = LayoutBound;