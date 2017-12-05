var colorDefault="#000000";
var bgDefault="#FFFFFF";
var tool = false;
var canvas,context;
var canvaso,contexto;
var started = false;
var tools = {};
var propiedades={};
var bgColor="#3399FF";
propiedades.grosor=2;
propiedades.grosoremoji=15;
propiedades.color="#000000";
propiedades.emoji='feliz';
propiedades.isemoji=false;
propiedades.herramienta='pencil';
var idsimg=['rect','line','pencil','circle'];
var idsemojis=['santa','frosty','aguacate','pina','dona','futbol','cohete','bus','f1','lapiz','corazon','leon','feliz','spock','ok','telefono'];
var mapemojis={'santa':'🎅','frosty':'⛄️','aguacate':'🥑','pina':'🍍','dona':'🍩','futbol':'⚽️','cohete':'🚀','bus':'🚌','f1':'🏎','lapiz':'✏️','corazon':'❤️','telefono':'📱','leon':'🦁','feliz':'😀'
	,'spock':'🖖','ok':'👍'}
var idscolores=['red','blue','yellow','green','black','white','pink','chartreuse','orange','navy','salmon','brown','crimson','grey','magenta','dodgerblue'];

function init(){
	canvaso=document.getElementById('myCanvas');
	contexto = canvaso.getContext('2d');

	
	
	if (tools[propiedades.herramienta]) {
		tool = new tools[propiedades.herramienta]();
	}
	
	var container = canvaso.parentNode;
	canvas = document.createElement('canvas');
	canvas.id = 'imageTemp';
	canvas.width = canvaso.width;
	canvas.height = canvaso.height;
	container.appendChild(canvas);
	context = canvas.getContext('2d');
	procesaBoton('plus');
	procesaBoton('black');
	procesaBoton(propiedades.herramienta);
	// Attach the mousedown, mousemove and mouseup event listeners
	canvas.addEventListener('mousedown', ev_canvas, false);
	canvas.addEventListener('mousemove', ev_canvas, false);
	canvas.addEventListener('mouseup',	 ev_canvas, false);
}
//pone el context en el contexto
function img_update () {
	contexto.drawImage(canvas, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
}
//se encarga de hacer el pencil
tools.pencil = function () {
	var tool = this;
	this.started = false;

	// This is called when you start holding down the mouse button.
	// This starts the pencil drawing.
	this.mousedown = function (ev) {
		context.beginPath();
		context.moveTo(ev._x, ev._y);
		tool.started = true;
	};

	// This function is called every time you move the mouse. Obviously, it only 
	// draws if the tool.started state is set to true (when you are holding down 
	// the mouse button).
	this.mousemove = function (ev) {
	  if (tool.started) {
		  
		  if(propiedades.isemoji){
			  var x=ev._x-(propiedades.grosoremoji/2);
			  var y=ev._y+(propiedades.grosoremoji/2);
			context.font = "bold "+propiedades.grosoremoji+"px Arial";
			context.fillText(mapemojis[propiedades.emoji], x, y);
		}
		else{
			context.lineTo(ev._x, ev._y);
			context.stroke();
		}
		
	  }
	};

	// This is called when you release the mouse button.
	this.mouseup = function (ev) {
	  if (tool.started) {
		tool.mousemove(ev);
		tool.started = false;
		img_update();
	  }
	};
};
//se encarga de hacer la linea
tools.line = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
		
	context.clearRect(0, 0, canvas.width, canvas.height);
	  context.beginPath();
	  context.moveTo(tool.x0, tool.y0);
	  context.lineTo(ev._x,   ev._y);
	  context.stroke();
	  context.closePath();

      
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update();
      }
    };
};
//se encarga de hacer el rectangulo
tools.rect = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }

      var x = Math.min(ev._x,  tool.x0),
          y = Math.min(ev._y,  tool.y0),
          w = Math.abs(ev._x - tool.x0),
          h = Math.abs(ev._y - tool.y0);

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!w || !h) {
        return;
      }

      context.strokeRect(x, y, w, h);
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
		img_update();
      }
    };
 };
 //se encarga de hacer el circulo
tools.circle = function () {
    var tool = this;
    this.started = false;

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
	  var x,y,x2,y2;
	  if(ev._x>tool.x0){
		  x=ev._x-tool.x0;
	  }
	  else{
		  x=tool.x0-ev._x;
	  }
	  if(ev._y>tool.y0){
		  y=ev._y-tool.y0;
	  }
	  else{
		  y=tool.y0-ev._y;
	  }
	  x2=Math.min(tool.x0,ev._x)+(Math.abs(tool.x0-ev._x)/2);
	  y2=Math.min(tool.y0,ev._y)+(Math.abs(tool.y0-ev._y)/2);
	var rad=(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)))/2;

      context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.arc(x2,y2,rad,0,2*Math.PI);
		context.stroke();
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
		img_update();
      }
    };
 };
 

//cuando hay movimiento en el canvas
function ev_canvas (ev) {
	// Firefox
	if (ev.layerX || ev.layerX == 0) {
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	// Opera
	} else if (ev.offsetX || ev.offsetX == 0) {
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}

	// Call the event handler of the tool
	var func = tool[ev.type];
	if (func) {
		func(ev);
	}
}
function arreglaImgHerramienta(opcion){
	var prefijo="img-";
	for (var i=0;i<idsimg.length;i++){
		document.getElementById(prefijo+idsimg[i]).style.backgroundColor = bgColor;
	}
	document.getElementById(prefijo+opcion).style.backgroundColor = "chartreuse";
	
}
function parpadeaBoton(opcion){
	var prefijo="img-";
	document.getElementById(prefijo+opcion).style.backgroundColor = "chartreuse";
	setTimeout(function () {
		document.getElementById(prefijo+opcion).style.backgroundColor = bgColor;
	  }, 60);
	
}
function arreglaImgColor(opcion){
	var prefijo="img-";
	for (var i=0;i<idscolores.length;i++){
		document.getElementById(prefijo+idscolores[i]).style.backgroundColor = bgColor;
	}
	for (var i=0;i<idsemojis.length;i++){
		document.getElementById(prefijo+idsemojis[i]).style.backgroundColor = bgColor;
	}
	document.getElementById(prefijo+opcion).style.backgroundColor = "chartreuse";
}

function procesaBoton(opcion){
	var prefijo="img-";
	if (opcion=='plus'){
		propiedades.grosor+=1;
		propiedades.grosoremoji+=3;
		context.lineWidth=propiedades.grosor;
		parpadeaBoton(opcion);
		
		
	}
	else if (opcion=='minus'){
		if(propiedades.grosor>0){
			propiedades.grosor-=1;
			context.lineWidth=propiedades.grosor;
		}
		if(propiedades.grosoremoji>3){
			
			propiedades.grosoremoji-=3;
		}
		parpadeaBoton(opcion);
		
	}
	else if (idsimg.indexOf(opcion) >= 0){
		tool = new tools[opcion](); 
		arreglaImgHerramienta(opcion);
	}
	else if (idsemojis.indexOf(opcion) >= 0){
		propiedades.emoji=opcion;
		propiedades.isemoji=true;
		context.strokeStyle=opcion;
		arreglaImgColor(opcion);
	}
	else if (idscolores.indexOf(opcion) >= 0){
		propiedades.color=opcion;
		context.strokeStyle=opcion;
		propiedades.isemoji=false;
		arreglaImgColor(opcion);
	}
	else if (opcion=='clear'){
		contexto.clearRect(0,0,canvaso.width,canvaso.height);
		parpadeaBoton(opcion);
	}


}
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'myCanvas', 'paint.png');
}, false);


if(window.addEventListener) { 
	window.addEventListener('load', function () {
		init();
		document.getElementById("imageTemp").style.cursor = "crosshair";
	
}, false); }