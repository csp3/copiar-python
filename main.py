#COPIAR ARCHIVOS
from genericpath import isfile
from flask import Flask, render_template, jsonify, request, redirect, Response
import  win32api, win32file, os, sys  
import shutil, json 

app = Flask(__name__) 

unidades = [] 
archivodirectorio = ""

@app.route("/")
def inicio():
	return render_template("listarh.html")

@app.route("/", methods= ["POST"])
def listar():
	texto = "" 
	data = request.values
	
	if str(len(data)) == "0": 
		return obtenerUnidades()  
	else:
		if data['ruta'] == "listaParaCopiar":
			usb = data['und'] + '\\'
			# print("usb", usb)
			# print("lista", json.loads(data['lista']))
			for ruta in json.loads(data['lista']):
				if os.path.isfile(ruta):
					try:
						shutil.copy(ruta, usb)
					except:
						return "Error de copia, Rebise permisos y conexión de usb"
				else:
					try:
						shutil.copytree(ruta, usb)
					except: 
						return "Error de copia, Rebise permisos y conexión de usb"
			return "ok" 
		else:
			archivodirectorio = data['ruta'] + '\\' 
			print(archivodirectorio)
			if os.path.isdir(archivodirectorio): 
				texto = os.listdir(archivodirectorio) 
				texto = list(map(lambda x: archivodirectorio + x, texto)) 
				texto2 = list(map( esdirectorio , texto))
				return jsonify(texto2) 
			else:
				return "Falso"

def esdirectorio(lis):
	if os.path.isdir(lis):
		lis = archivodirectorio + lis + '\\' 
	else:
		lis = archivodirectorio + lis 
	return lis

def obtenerUnidades():
	unidades = [] 
	drives = win32api.GetLogicalDriveStrings().split('\\\000')[:-1]
	for devi in drives:
		unidades.append(devi)  
		unidades.append(win32file.GetDriveType(devi))
	return jsonify(unidades)   


if __name__ == "__main__":
	app.run(debug= True, port= 8089)
