function process(d) {
	var nodeCounter = 0;
	var distances = [];
	var root = null;

	//add numeric values
	for( var i = 0; i < d.length; ++i ) {
		var element = { dist: numericValue(d[i]), name : d[i].name, parent : "null"};
		distances.push(element);
	}
	var p = 0;
	while(distances.length > 1 && p < 15) {
		var minDist = Number.MAX_VALUE;
		var min_i;
		var min_j;
		for( var i = 0; i < distances.length; ++i ) {
			for (var j = i+1; j < distances.length; ++j) {
				dist = Math.abs(distances[j].dist - distances[i].dist);
				if(dist == 0 && distances[j].children != null) {
					distances[i].parent = distances[j].name;
					distances[j].children.push(distances[i]);
					distances.splice(i, 1);
				} else if(dist == 0 && distances[i].children != null) {
					distances[j].parent = distances[i].name;
					distances[i].children.push(distances[j]);
					distances.splice(j, 1);
				} else if(dist < minDist) {
					minDist = dist;
					min_i = i;
					min_j = j; 
				}
			}
		}
		//find closest
		minA = distances[min_i];
		minB = distances[min_j];
		distances.splice(min_i, 1);
		distances.splice(min_j-1, 1);

		var avgDist =  (minA.dist + minB.dist)/2;
		minA["parent"] = "Node"+nodeCounter;
		minB["parent"] = "Node"+nodeCounter;
		var newNode = {dist: avgDist, name: "Node"+nodeCounter, children: [minA, minB], parent:"null"};
		nodeCounter++;

		//insert into array
		distances.push(newNode);

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