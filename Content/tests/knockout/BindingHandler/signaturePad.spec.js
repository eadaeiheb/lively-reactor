require("../testbase");
require("../../../../Plugins/Main/Content/js/system/jquery.signaturepad.min");
require("../../../../Plugins/Main/Content/ts/knockout.custom.signaturePad");

function mockCanvas (window) {
	window.HTMLCanvasElement.prototype.getContext = function () {
		return {
			fillRect: function() {},
			clearRect: function(){},
			getImageData: function(x, y, w, h) {
				return  {
					data: new Array(w*h*4)
				};
			},
			putImageData: function() {},
			createImageData: function(){ return [];},
			setTransform: function(){},
			drawImage: function(){},
			save: function(){},
			fillText: function(){},
			restore: function(){},
			beginPath: function(){},
			moveTo: function(){},
			lineTo: function(){},
			closePath: function(){},
			stroke: function(){},
			translate: function(){},
			scale: function(){},
			rotate: function(){},
			arc: function(){},
			fill: function(){},
			measureText: function(){
				return { width: 0 };
			},
			transform: function(){},
			rect: function(){},
			clip: function(){},
		};
	};

	window.HTMLCanvasElement.prototype.toDataURL = function () {
		return "";
	};
}


describe("knockout signaturePad custom binding", () => {
	test("Data binding handler creates canvas", () => {
		$.ready();
		mockCanvas(window);
		const observable = ko.observable(null);
		ko.test("input", {signaturePad: observable}, input => expect($("canvas", $(input).parent())).toHaveLength(1));
	});

});
