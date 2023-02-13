
import PedidoDAO from "../DAO/PedidoDAO.js"
import UnidadesDAO from "../DAO/UnidadesDAO.js"
import Order from "../Models/Order.js"


/// variables Globales / Objetos globales(control de informacion)
const pedidoDAO =new PedidoDAO()
const unidadesDAO = new UnidadesDAO()



///inicio-----------------------------------------------------------------------------


//// funciones de inicio

mostrarPrecio()
inicioTanque()


/// ELEMENTOS HTML--------------------------------------------------------

let btnVistaPedidos = document.getElementById("vistaPedidos")
let filtroPedidos = document.getElementById("btnPedidosDiarios")
let btnModificarPrecio = document.getElementById("btnCambioPrecio")
let btncargar = document.getElementById("btnCargar")

/// EVENTOS  DE INICIO ----------------------------------------------------------------
btnVistaPedidos.addEventListener("click" , ()=>crearModalAsignarChoferes())
btnVistaPedidos.addEventListener("click" ,()=>crearModalModificar())
btnVistaPedidos.addEventListener("click",()=>MostrarPedidos())
btnVistaPedidos.addEventListener("click" , ()=> eliminarSpanPedidosNuevos())
filtroPedidos.addEventListener("click" , ()=>filtroxFecha())
btnModificarPrecio.addEventListener("click" , ()=>cambiarPrecio())
btncargar.addEventListener("click" ,()=>cargarTanque())



//// FUNCIONES DE INICIO------------------------------------------------------------------------------

function eliminarSpanPedidosNuevos (){
    sessionStorage.clear()
    let span = document.getElementById("spanNuevopedido")
    span.innerText=""

}

function inicioTanque (){
    let pixeles = localStorage.getItem("pixelesTanque")
    let pixelesInt = parseInt(pixeles)
    let tanque = document.getElementById("tanqueBar")
    tanque.style.width=`${pixelesInt}px`
    tanque.innerHTML=
    `<p class=" h5 text-white"><strong>${localStorage.getItem("litrosStock")} lts</strong></p>`

}
function cargarTanque (){
    localStorage.setItem("litrosStock" , "100000")
    localStorage.setItem("pixelesTanque" ,"368")
    let tanque = document.getElementById("tanqueBar")
    tanque.style.width=`368px`
    tanque.innerHTML=
    `<p class=" h5 text-white"><strong>100.000 Lts</strong></p>`

    
}

function eliminarPedido (id){
    pedidoDAO.eliminarPedido(id)
    borrarDespacho(id)
    MostrarPedidos()
}


////////////////// Funciones  para cambio de precios 

function cambiarPrecio (){
    let inputValor =document.getElementById("valorPrecio")
    let contedorPrecio = document.getElementById("precioRancho")
    let btncambio = document.getElementById("btnNuevoPrecio")
    btncambio.addEventListener("click" , ()=>{
        localStorage.setItem ("precioGo" ,inputValor.value )
        contedorPrecio.textContent=(localStorage.getItem("precioGo"))

    })
     
}

function mostrarPrecio (){
    let contedorPrecio = document.getElementById("precioRancho") 
    contedorPrecio.textContent=(localStorage.getItem("precioGo"))
}

 ///// Carga todos los choferes al modal de asignacion

function cargarOpcionesChoferes (){
    resetearOptChoferes()
    pedidoDAO.arrayPedidos=[]
    let unidades = unidadesDAO.traerDatos()
    let pedidos = pedidoDAO.traerTodo()
    
    pedidos.forEach(pedido =>{
        let select = document.getElementById(`optUnidades${pedido.Id}`)
        unidades.forEach(unidad => {
            
            let options = document.createElement("option")
            options.value = `${unidad.dni}`
            options.text = `${unidad.nombre} ${unidad.apellido}`
            select.appendChild(options)})
    })
 }

 /// VALIDACIONES-------------------------------------------------

 function validarDespacho (pedido){
    let flag = false 
    let listrosTanque = localStorage.getItem("litrosStock")
    let litrosInt = parseInt(listrosTanque)
   
    console.log(pedido.cantidad)
    if(pedido.cantidad > litrosInt ){
        Swal.fire({
            title: 'Error!',
            text: 'Cantidad Insuficiente',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        flag = true 
    }
    else if(pedido.cantidad < 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Cantidad Incorrecta',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        flag = true
    }
    else if (pedido.unidad === "S/A") {
        Swal.fire({
            title: 'Error!',
            text: 'Debes asignar una unidad antes de despachar',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        flag = true
    }
    return flag
 }


 ///------------ FUNCIONES PARA EL DESPACHO  -----------------------------------------------

 function despachar (Id){
    let pedidos =pedidoDAO.traerTodo();
    
    pedidos.forEach(pedido=>{
        if(pedido.Id === Id){
            let flag = validarDespacho(pedido)
            console.log(flag)
            if(flag===false){
                let pedidoNuevo = pedido
                pedidoNuevo.estado="Despachado"
                pedidoDAO.modificarPedido(pedidoNuevo)
            }

        }
    })
    pedidoDAO.arrayPedidos=[]

 }

 function traerDespachos (){
    let despachos = []
    for (let index = 0; index < localStorage.length; index++) {
        let clave = localStorage.key(index)
        if ((clave.indexOf("tanque",0) )!=-1){
            let id = JSON.parse(localStorage.getItem(clave))
            despachos.push(id)
        }
    }
    return despachos
 }

 function borrarDespacho (idDespacho){
    for (let index = 0; index < localStorage.length; index++) {
        let clave = localStorage.key(index)
        if ((clave.indexOf("tanque",0) )!=-1){
            let id = JSON.parse(localStorage.getItem(clave))
            if(idDespacho === id){
                localStorage.removeItem(clave)
            }
        }
    }
 }

 ///------------------------- FUNCIONES PARA ACTUALIZACION DEL TANQUE

 function litrosAdescontar (){
    pedidoDAO.arrayPedidos=[]
    let pedidos = pedidoDAO.traerTodo();
    let despachos =traerDespachos()
    let litros = 0 ;
    pedidos.forEach(pedido=>{
        if (pedido.estado ==="Despachado"  ){
            if(despachos.indexOf(pedido.Id)===-1){
                litros+=parseInt(pedido.cantidad)
                localStorage.setItem(`tanque${pedido.Id}` ,pedido.Id)
            }          
        }
    })

    actualizarTanque(litros)
 }

 function actualizarTanque (litros){

    /// Calculo de los litros en el tanque
    let litrosEnSistemastr = localStorage.getItem("litrosStock")
    let sistemaInt = parseInt(litrosEnSistemastr)
    let totalEnTanque = sistemaInt-litros
    localStorage.setItem("litrosStock",totalEnTanque)
    

    ///Calculo de los pixeles para el efecto de bajar el nivel
    let capacidadTanque =100000
    let pixelesTotales = 368
    let pixelesaRestar =Math.floor((litros*pixelesTotales)/capacidadTanque)


    let pixelesTanque = localStorage.getItem("pixelesTanque")
    let pixeles = parseInt(pixelesTanque)
    localStorage.setItem("pixelesTanque" , (pixeles-pixelesaRestar))
    
    
    /// Actualizar vista del tanque
    let tanque = document.getElementById("tanqueBar")
    let pixelesFinal = parseInt(pixelesTanque)-pixelesaRestar
    let final = Math.ceil(pixelesFinal)


    
    tanque.style.width=`${final}px`
    tanque.textContent=`${totalEnTanque}`
    tanque.innerHTML=
    `<p class=" h5 text-warning"><strong>${totalEnTanque} lts</strong></p>`
    MostrarPedidos()
 }

 ///------------------------ FUNCIONES PARA ASIGNACION DE UNIDADES 

 function asignarUnidades (idPedido){
    let pedido = pedidoDAO.buscarPedido(idPedido)
    let select = document.getElementById(`optUnidades${idPedido}`)
    asignarUnidad(pedido,select.value) 
 }

 function resetearOptChoferes (){
    let pedidos = pedidoDAO.traerTodo()
    pedidos.forEach(pedido => {
        let select = document.getElementById(`optUnidades${pedido.Id}`)  
        select.innerHTML=""
    });
 }

 function mostrarDatosUnidad (dni , tbody){

    let chofer = unidadesDAO.buscarUnidad (dni)
    let unidad = chofer.codigoUnidad
    let cisternado = unidad.cisterNado;
     tbody.innerHTML = 
    `   
        <tr>
            <th>${chofer.nombre}</th>
            <th>${chofer.apellido}</th>
            <th>${unidad.patenteTractor}</th>
            <th>${unidad.patenteSemi}</th>
            <th>${cisternado.toString()}</th>
        <tr>
    `
 }

 function asignarUnidad (pedido,dni){
    let chofer = unidadesDAO.buscarUnidad (dni)
    pedido.unidad = chofer
    pedidoDAO.modificarPedido(pedido)
    MostrarPedidos()

 }

 ///////// FUNCIONES PARA MODIFICACION 

//function asignarValores 

function cargarValoresaModificar (pedido){
    let inputFecha = document.getElementById(`modificarFecha${pedido.Id}`);
    inputFecha.value=pedido.fecha
    let inputHora = document.getElementById(`modificarHora${pedido.Id}`)
    inputHora.value = pedido.hora
    let inputDJ = document.getElementById(`modificarDJ${pedido.Id}`)
    inputDJ.value = pedido.dj
    let inputCantidad = document.getElementById(`modificarCantidad${pedido.Id}`)
    inputCantidad.value=pedido.cantidad
}

function modificarPedido(id ){

    let pedido = pedidoDAO.buscarPedido(id)
    let pedidoModificado = new Order(document.getElementById(`modificarCantidad${id}`).value,document.getElementById(`modificarFecha${id}`).value,document.getElementById(`modificarHora${id}`).value,pedido.buque)
    pedidoModificado.setDJ(document.getElementById(`modificarDJ${id}`).value)
    pedidoModificado.setID(id)
    pedidoDAO.modificarPedido(pedidoModificado);
    MostrarPedidos()
}


 /////////////////////////////////////////////// VISTAS -------------------------------------------------------------------

 function MostrarPedidos (){

    let tablaBody = document.getElementById("tablaDespachosBody")
    tablaBody.innerHTML=""
    pedidoDAO.arrayPedidos=[]
    let pedidos = pedidoDAO.traerTodo()
    let fechaDeldia= luxon.DateTime.now().toFormat('yyyy-MM-dd')

    pedidos.sort((x,y)=>(x.Id - y.Id))
    pedidos.forEach(pedido => {

     let {Id,cantidad,hora,dj,fecha,unidad,buque}=pedido

      if(fechaDeldia ===fecha){
       let date = luxon.DateTime.fromISO(fecha).toFormat("dd-MM-yyyy")
       let tr = document.createElement("tr")
       if(pedido.estado==="Despachado"){
            tr.classList.add("table-secondary")
            
       }
      
       let {nombreBuque}= buque
       let {nombre,apellido} = unidad
    
       tr.innerHTML =
        `
            <tr class ="p-0  ">
                <td class="font">${Id}</td>
                <td class= "font">${nombreBuque}</td>
                <td id ="chofer${Id}" class= "font">${nombre} ${apellido}</td>
                <td class= "font">${cantidad}</td>
                <td class= "font">${date}</td>
                <td class= "font">${hora}</td>
                <td class= "font">${dj}</td>
                <td >
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-secondary border border-2  border-white shadow-sm rounded " data-bs-toggle="dropdown" aria-expanded="false">
                    <img class="p-0" src="/Pictures/opcion-de-marcha.png" alt="" >
                    </button>
                        <ul class="dropdown-menu">
                            <li><button id="asignar${Id}"  type="button" class="dropdown-item " data-bs-toggle="modal" data-bs-target="#${Id}">
                            Asignar</button></li>
                            
                            <li><a id="despachar${Id}" class="dropdown-item font" ">Despachar</a></li>
                            <li><button id="modificar${Id}"  type="button" class="dropdown-item " data-bs-toggle="modal" data-bs-target="#modal${Id}">Modificar</button></li>
                            <li><a id="cancelar${Id}" class="dropdown-item font" >Eliminar</a></li>
                        </ul>
                    </div>
                </td>  
            <tr>
        `
        
        tablaBody.appendChild(tr)
        
        /// MODOS HTML
        let tbody = document.getElementById(`bodiUnidades${Id}`)
        let btnasignar =document.getElementById(`asignar${Id}`)
        let select =document.getElementById(`optUnidades${Id}`)
        let btnEliminar = document.getElementById(`cancelar${Id}`)
        let btnDespachar = document.getElementById(`despachar${Id}`)
        let btnModificar = document.getElementById(`modificar${Id}`)
        /// EVENTOS
        /// CARGA LOS DATOS DEL CHOFER EN EL MODAL DE ASIGNACION
        select.addEventListener("click" ,()=> mostrarDatosUnidad(select.value,tbody)) 
        /// CARGA LOS OPTION(CHOFERES EN EL SISTEMA) AL SELECT DE ASIGNACION 
        btnasignar.addEventListener("click" , ()=>cargarOpcionesChoferes())
        /// EVENTO PARA ELEMINAR UN PEDIDO SEGUN LA ID
        btnEliminar.addEventListener("click" , ()=>eliminarPedido(Id))
        btnDespachar.addEventListener("click" ,()=>despachar(Id))
        btnDespachar.addEventListener("click" ,()=>litrosAdescontar())
        btnModificar.addEventListener("click",()=>cargarValoresaModificar(pedido))

      }
            
    })
 }

 function filtroxFecha (){
    let valueFecha = document.getElementById("fechaDespacho").value
    let tablaBody = document.getElementById("tablaDespachosBody")
    tablaBody.innerHTML=""
    pedidoDAO.arrayPedidos=[]
    let pedidos = pedidoDAO.traerTodo()

    pedidos.sort((x,y)=>(x.Id - y.Id))

    pedidos.forEach(pedido => {
        let {fecha,buque,unidad ,hora,dj ,Id}=pedido
       let date = luxon.DateTime.fromISO(fecha).toFormat("dd-MM-yyyy")
       if (valueFecha === fecha){
        let tr = document.createElement("tr")
        let {nombreBuque} = buque
        let {nombre,apellido} = unidad
        if(pedido.estado==="Despachado"){
            tr.classList.add("table-warning")
            
       }

        tr.innerHTML =
         `
             <tr>
                 <td>${Id}</td>
                 <td>${nombreBuque}</td>
                 <td>${nombre} ${apellido}</td>
                 <td>${pedido.cantidad}</td>
                 <td>${date}</td>
                 <td>${hora}</td>
                 <td>${dj}</td>
                 <th >
                 <div class="btn-group">
                     <button type="button" class="btn btn-outline-secondary border border-2 shadow-sm rounded " data-bs-toggle="dropdown" aria-expanded="false">
                     <img src="/Pictures/opcion-de-marcha.png" alt="" >
                     </button>
                         <ul class="dropdown-menu">
                             <li><button id="asignar${Id}"  type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#${pedido.Id}">
                             Asignar</button></li>
                             <li><a id="despachar${Id}" class="dropdown-item" ">Despachar</a></li>
                             <li><a id="modificar${Id}" class="dropdown-item" ><span></span>Modificar</a></li>
                             <li><a id="cancelar${Id}" class="dropdown-item" >Eliminar</a></li>
                         </ul>
                     </div>
                 </th>  
             <tr>
         `
        
         tablaBody.appendChild(tr)

                 /// MODOS HTML
        let tbody = document.getElementById(`bodiUnidades${Id}`)
        let btnasignar =document.getElementById(`asignar${Id}`)
        let select =document.getElementById(`optUnidades${Id}`)
        let btnEliminar = document.getElementById(`cancelar${Id}`)
        let btnDespachar = document.getElementById(`despachar${Id}`)
        let btnModificar = document.getElementById(`modificar${Id}`)
        /// EVENTOS
        /// CARGA LOS DATOS DEL CHOFER EN EL MODAL DE ASIGNACION
        select.addEventListener("click" ,()=> mostrarDatosUnidad(select.value,tbody)) 
        /// CARGA LOS OPTION(CHOFERES EN EL SISTEMA) AL SELECT DE ASIGNACION 
        btnasignar.addEventListener("click" , ()=>cargarOpcionesChoferes())
        /// EVENTO PARA ELEMINAR UN PEDIDO SEGUN LA ID
        btnEliminar.addEventListener("click" , ()=>eliminarPedido(Id))
        btnDespachar.addEventListener("click" ,()=>despachar(Id))
        btnDespachar.addEventListener("click" ,()=>litrosAdescontar())
        btnModificar.addEventListener("click",()=>cargarValoresaModificar(pedido))

    
        
       }
 
    })
 }

  ////----------------------MODALS---------------------------------------------------------------


  function crearModalAsignarChoferes (){
    let pedidos =""
    pedidos = pedidoDAO.traerTodo()
    pedidos.forEach(pedido => {
        let {Id} = pedido
        let divModal = document.getElementById("modalsDespacho")
        let div = document.createElement("div")
        div.innerHTML = 
        `
            <div class="modal fade" id="${Id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 font" id="exampleModalLabel$">Asignar Unidad ${Id}</h1>
                        <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                        <label class="input-group-text input-group-sm bg-secondary text-white" >Choferes</label>
                        <select class="form-select form-select-sm font" id="optUnidades${Id}">   
                        </select>
                        </div>
                        <table id ="tablaUnidades" class="table table-sm table-bordered mt-4 text-center font">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Tractor</th>
                                <th>Semi</th>
                                <th>Cisternado</th>
                            </tr>
                        </thead>
                        <tbody id ="bodiUnidades${Id}">
    
                        </tbody>
                        </table>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="btnAsignarChofer+${Id}" type="button" data-bs-dismiss="modal" class="btn btn-sm btn-secondary">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        divModal.appendChild(div)
        let btnasigar = document.getElementById(`btnAsignarChofer+${Id}`)
        btnasigar.addEventListener("click", ()=>asignarUnidades(Id))
                    
    });
 
 }


 function crearModalModificar (){
    let pedidos =[]
    pedidoDAO.arrayPedidos=[]
    pedidos = pedidoDAO.traerTodo()
    let fecha = luxon.DateTime.now().toFormat('yyyy-MM-dd')
    pedidos.forEach(pedido => {
        let {Id,hora,cantidad,dj,fecha,buque} = pedido
        let divModal = document.getElementById("modalsDespacho")
        let div = document.createElement("div")
        console.log(pedido)
        div.innerHTML = 
        `
            <div class="modal fade" id="modal${Id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 font" id="exampleModalLabel$">Modificar Pedido ${Id}</h1>
                        <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body ">
                        <div class="input-group input-group-sm  mb-3 mt-2 w-50 mx-auto">
                            <span class="input-group-text bg-secondary text-white  font mx-auto " >Cantidad</span>
                            <input id="modificarCantidad${Id}" type="number"  class="form-control mx-auto form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                        </div>
                        <div class="input-group input-group-sm  mb-3 mt-2 w-50 mx-auto">
                            <span class="input-group-text bg-secondary text-white  font mx-auto " >Hora</span>
                            <input  id="modificarHora${Id}" type="time"  class="form-control mx-auto form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                        </div>
                        <div class="input-group input-group-sm  mb-3 mt-2 w-50 mx-auto">
                            <span class="input-group-text bg-secondary text-white  font mx-auto " >Dj</span>
                            <input  id="modificarDJ${Id}" type="number"  class="form-control mx-auto form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                        </div>
                        <div class="input-group input-group-sm  mb-3 mt-2 w-50 mx-auto">
                            <span class="input-group-text bg-secondary text-white  font mx-auto " >Fecha</span>
                            <input  id = "modificarFecha${Id}" min ="${fecha}"  type="date"  class="form-control mx-auto form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                        </div>
                        
                        <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button id="btnModificar${Id}" type="button" data-bs-dismiss="modal" class="btn btn-sm btn-secondary">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        divModal.appendChild(div) 
        let btnModificar = document.getElementById(`btnModificar${Id}`)
        btnModificar.addEventListener("click",()=>modificarPedido(Id))
    });
 }

 

