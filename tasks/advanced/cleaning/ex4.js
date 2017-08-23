function Widget(width, height) {
	this.width = width || 50;
	this.height = height || 50;
	this.$elem = null;
}

Widget.prototype.render = function ($where) {
	if (this.$elem) {
		console.log('rendering')
		this.$elem.css({
			width: this.width + "px",
			height: this.height + "px"
		}).appendTo($where);
	}
};

function Button(width, height, label) {
	Widget.call(this, width, height)
	this.label = label
	this.$elem = $('<button>').text(label)
	this.$elem.click(e => {
		console.log(`Button ${this.label} clicked!`)
	})
	this.$elem.innerText = this.label
	this.prototype = new Widget(width, height)

	this.render = function (parent) {
		Widget.prototype.render.call(this, parent)
	}
}

$(document).ready(function () {
	var $body = $(document.body);
	var btn1 = new Button(100, 20, 'First button')
	var btn2 = new Button(150, 20, 'Second button')

	btn1.render($body);
	btn2.render($body);
});