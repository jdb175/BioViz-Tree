function process(d) {
	var nodeCounter = 0;
	var distances = [];
	var root = null;

	//add numeric values
	for( var i = 0; i < d.length; ++i ) {
		var element = { dist: numericValue(d[i]), name : d[i].name};
		var res = binaryFind.call(distances, element);
		distances.splice(res, 0, element);
	}

	while(distances.length > 1) {
		//find closest
		var closestA = distances[0];
		var closestB = distances[1];
		var avgDist =  (closestA.dist + closestB.dist)/2;
		closestA["parent"] = "Node"+nodeCounter;
		closestB["parent"] = "Node"+nodeCounter;
		var newNode = {dist: avgDist, name: "Node"+nodeCounter, children: [closestA, closestB], parent:"null"};
		nodeCounter++;

		//insert into array
		var res = binaryFind.call(distances, newNode);
		distances = distances.splice(2);
		distances.splice(res, 0, newNode);

		//save as root
		root = newNode;
	}
	return root;
}

function numericValue(item) {
	var sum = 0;
	for(var i = 0; i < item.data.length; ++i){
		sum += item.data[i];
	}
	return sum;
}

function binaryFind(searchElement) {
	'use strict';

	var minIndex = 0;
	var maxIndex = this.length - 1;
	var currentIndex;
	var currentElement;

	if(this.length == 0) {
		return 0;
	}

	while (minIndex <= maxIndex) {
		currentIndex = (minIndex + maxIndex) / 2 | 0;
		currentElement = this[currentIndex];

		if (currentElement.dist < searchElement.dist) {
			minIndex = currentIndex + 1;
		}
		else if (currentElement.dist > searchElement.dist) {
			maxIndex = currentIndex - 1;
		}
		else {
			return currentIndex
		}
	}      
	return currentElement.dist < searchElement.dist ? currentIndex + 1 : currentIndex
}

function testOrder(d) {
	var last = 0;
	for(var i = 0; i < d.length; ++i ) {
		var cur = d[i].dist;
		if(cur < last)
			return false;
		last = cur;
	}
	return true;
}