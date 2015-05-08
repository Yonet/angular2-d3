import {Component, Template} from 'angular2/angular2';
import {NgElement} from 'angular2/angular2';

@Component({
	selector: 'graph',
	bind: {
		'data': 'data',
		'width': 'width',
		'height': 'height'
	}
})
@Template({
	inline: '<svg></svg>'//?
})
export class Graph {
	constructor(el: NgElement) {
		this._data = null;
		console.log('in constructor ', this._data);
		this.width = null;

		this.diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });

		var parentWidth = el.domElement.parentElement.clientWidth;
		var parentHeight = el.domElement.parentElement.clientHeight;
		var width = 900;
		var height = 2000;


		this.cluster = d3.layout.cluster()
				.size([height, width - 160]);

		this.svg = d3.select(el.domElement)
				.attr({
					'width': width, 
					'height': height
				})
				.append('g')
				.attr('transform', 'translate(40, 0)');

		
		// this.buildD3(this._data);
	}

	get data() {
		return this._data;
	}
	set data(value) {
		this._data = value;
		console.log('in the setter ', this._data)
		this.render(this._data);
		return this._data;
	}

	render(data) {
	  this._renderD3(data, this.cluster, this.svg, this.diagonal);
	}

	_renderD3(state, cluster, svg, diagonal) {
	// 
	if(!state) return;
	var data = state;

	var nodes = cluster.nodes(data);
	var links = cluster.links(nodes);

	var link = svg.selectAll('.link')
		.data(links)
		.enter().append('path')
		.attr({
			'class': 'link',
			'd': diagonal
		});

		var node = svg.selectAll('.node')
				.data(nodes)
				.enter().append('g')
				.attr({
					'class': 'node',
					'transform': function(d) { return "translate(" + d.y + "," + d.x + ")"; }
				});

		node.append('cicle')
					.attr({
						'r': 4.5
					});

				node.append('text')
					.attr({
						'dx': function(d) { return d.children ? -8 : 8; },
						'dy': 3,    
						'tex-anchor': function(d) { return d.children ? "end" : "start"; }
					})
					.text(function(d) { return d.name; });
  }
}


/// Render

//App
@Component({
	selector: 'app'
})
@Template({
	inline: `
		<graph [data]="stateData"></graph>
	`,
	directives: [
		Graph
	]
})
export class App {
	name: string;
	constructor(){
		this.stateData = getState();
	}
}

///App

//getState
function getState() {
	return {
		name: "aysegul",
		"children": [
		  {
		   "name": "analytics",
		   "children": [
			{
				"name": "cluster",
				"children": [
					{"name": "AgglomerativeCluster", "size": 3938},
					{"name": "CommunityStructure", "size": 3812},
					{"name": "HierarchicalCluster", "size": 6714},
					{"name": "MergeEdge", "size": 743}
				]
			}]
		}]
	}
};
///getState


