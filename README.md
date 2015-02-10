# BioViz-Tree
Biovisualization Assignment 2: Tree of Life


* Updated algorithm to allow nodes to have more than two children where appropriate
* ability to select a leaf and see the path from root
* ability to select two leaves and see closest path between them
* ability to select a branch node and only see its children
* ability to highlight all children of a branch node and see their shared characteristics
* leaf distance is scaled by similarity
	-not perfect

* Got basic radial dendrogram from http://bl.ocks.org/mbostock/4339607
	* Updated to change style of root & branches vs leaves, remove text from non-leaves, and add interactive elements
	* Added transitions
	* Added custom clustering distance