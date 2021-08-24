//"use strict"
const selectunidades  = document.getElementById('selectunidades'); 
const selectusb = document.getElementById('selectusb'); 
const dContenidoUnidad = document.getElementById('dContenidoUnidad'); 
const retroceder = document.getElementById('retroceder'); 
const dContenidoAcopiar = document.getElementById('dContenidoAcopiar'); 
const copiarausb = document.getElementById('copiarausb'); 
const divAlerta = document.getElementById('divAlerta'); 
const imagen = document.getElementById('imagen'); 

selectunidades.setAttribute('size', 10); 
selectusb.setAttribute('size', 10);

let ruta = ""; 
let conacopia = 0; //enumerar para div acopia(dinamicamente) 
listacopia = new Array();

//cargar unidades al cargar 
window.addEventListener('load', function()
{
	$.post("/", {}, function(data) 
	{
		for (let i = 0; i < data.length; i+=1) 
		{
			if(i%2 == 0)
			{
				selectunidades.insertAdjacentHTML('beforeend', '<option value='+data[i]+'>' + data[i] + '</option>');
			}
			else 
			{
				if(data[i] == 2) // 2 es unidad removible 
				{
					selectusb.insertAdjacentHTML('beforeend', '<option value='+data[i-1]+'>' + data[i-1] + '</option>');
				}
			}
		}
	});
});

//agregar contenido a select desde unidad 
selectunidades.addEventListener('click', function()
{
	ruta = this.value; 
	$.post('/', {ruta: ruta}, function(data)
	{
		dContenidoUnidad.innerHTML = ""; 
		
		for (let i = 0; i < data.length; i++) 
		{
			let lon = data[i].length; 
			if(data[i].substring(lon - 1) == '\\') //si tiene \ es directorio sino es archivo 
			{
				//quito caracter \ que puse si es directorio 
				let aux = data[i].substring(0, lon - 1);
				dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '" onclick="agregar(this)">=></button>&nbsp;<div class="pinta" id="div-'+i+'" onclick="ver(this)" >' + aux + '</div>');
			}
			else 
			{
				dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '" onclick="agregar(this)">=></button>&nbsp;<div id="div-'+i+'" onclick="ver(this)">'+data[i]+'</div>');
			}
		}
	}); 
});

//agregar contenido a select desde select 
function ver(e)
{
	ruta = e.innerText; 
	console.log(ruta);
	$.post('/', {ruta: ruta}, function(data)
	{ 
		if(data != "Falso") 
		{
			dContenidoUnidad.innerHTML = ""; 
			for (let i = 0; i < data.length; i++) 
			{
				let lon = data[i].length; 
				if(data[i].substring(lon - 1) == '\\') //si tiene \ es directorio sino es archivo 
				{
					//quito caracter \ que puse si es directorio 
					let aux = data[i].substring(0, lon - 1);
					dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '" onclick="agregar(this)">=></button>&nbsp;<div class="pinta" id="div-'+i+'" onclick="ver(this)" >' + aux + '</div>');
				}
				else 
				{
					dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '"  onclick="agregar(this)">=></button>&nbsp;<div id="div-'+i+'" onclick="ver(this)">'+data[i]+'</div>');
				}
			}
		}
	}); 
}

//retroceder
retroceder.addEventListener('click', function()
{
	ruta = "";
	if (document.getElementById('div-0') !== null) 
	{
		let aux = document.getElementById('div-0').innerText;
		let indice = aux.lastIndexOf('\\'); 
		aux = aux.substring(0, indice); 
		indice = aux.lastIndexOf('\\');
		ruta = aux.substring(0, indice); 
		
		console.log(ruta); 

		if (indice != -1)
		{
			$.post('/', {ruta: ruta}, function(data)
			{
				dContenidoUnidad.innerHTML = ""; 
				for (let i = 0; i < data.length; i++) 
				{
					let lon = data[i].length; 
					if(data[i].substring(lon - 1) == '\\') //si tiene \ es directorio sino es archivo 
					{
						//quito caracter \ que puse si es directorio 
						let aux2 = data[i].substring(0, lon - 1);
						dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '" onclick="agregar(this)">=></button>&nbsp;<div class="pinta" id="div-'+i+'"  onclick="ver(this)">' + aux2 + '</div>');
					}
					else 
					{
						dContenidoUnidad.insertAdjacentHTML('beforeend', '<button id="agrega-' + i + '" onclick="agregar(this)">=></button>&nbsp;<div id="div-'+i+'"  onclick="ver(this)">'+data[i]+'</div>');
					}
				}
			}); 
		}
	}
});

function agregar(e) 
{
	sw = true;
	let indice = parseInt(e.id.split('-')[1]); 
	let texto = document.getElementById('div-' + indice).innerText; 
	
	for (let i = 0; i < conacopia; i++) //numero de hijos es el doble    
	{
	 	if (document.getElementById('acopia-'+i).innerText == texto)
		{
			sw = false;
			break;
		}
	}

	if (sw)
	{
		dContenidoAcopiar.insertAdjacentHTML('beforeend', '<button id="quita-' + conacopia + '" onclick="quitar(this)"><=</button><div id="acopia-'+ conacopia +'">'+texto+'</div>');
		conacopia++;
	}
	else 
		alert("directorio/archivo ya fue ingresado");
}

//quitar de la lista a copiar 
function quitar(e) 
{
	let r = confirm("QUITAR  Elemento ?? "); 
	if (r) 
	{
		let indice = parseInt(e.id.split('-')[1]); 
		let b = document.getElementById('quita-'+indice);
		let d = document.getElementById('acopia-'+indice);
		
		dContenidoAcopiar.removeChild(d);
		dContenidoAcopiar.removeChild(b);
		
		// conacopia--; 
	}
}

copiarausb.addEventListener('click', function()
{
	listacopia = []; 
	for (let i = 0; i < conacopia; i++) //numero de hijos es el doble    
	{
	 	if (document.getElementById('acopia-'+i) != null)
		{
			listacopia.push(document.getElementById('acopia-'+i).innerText); 
		}
	}

	if(listacopia.length > 0)
	{
		if(selectusb.value != "")
		{
			ruta = "listaParaCopiar"; 
			let unid = selectusb.value; 
			let nuevalista = JSON.stringify(listacopia); 
			divAlertaMuestra(); 
			$.post('/', {ruta: ruta, lista:nuevalista, und: unid}, function(data)
			{ 
				console.log(data);
				if(data == 'ok')
				{
				 	divAlertaMensaje(); 
				}
			}); 
		}
		else 
		{
			alert("Seleccione USB !!");
		}
	}
});


//div mientras copia 
function divAlertaMuestra()
{
	divAlerta.style.width = '1095px';
	divAlerta.style.height = '775px'; 
	divAlerta.style.backgroundColor = '#28658baf';
	document.getElementById('imagen').src = 'static/images/stop.png'; 
}

//mensaje de divAlerta al terminar copia 
function divAlertaMensaje()
{
	document.getElementById('imagen').src = 'static/images/ok.png';
}

//ocultar divAlerta
imagen.addEventListener('click', function()
{
	let a = imagen.src.split('/');
	let n = a.length;
 
	if(a[n-1] == "ok.png")
	{
		divAlerta.style.width  = '0px';
		divAlerta.style.height = '0px'; 
		divAlerta.style.backgroundColor = 'transparent'; 
		document.getElementById('imagen').src = 'static/images/trans.png'; 
	}
});

