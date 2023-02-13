
import AgenciaMaritimaDAO from "../DAO/AgenciaMaritimaDAO.js"
import AgenciaMaritima from "../Models/AgenciaMaritima.js"
import BuqueDAO from '../DAO/BuqueDAO.js'
import Buque from "../Models/Buque.js"
import PedidoDAO from "../DAO/PedidoDAO.js"
import Order from "../Models/Order.js"

/// Objetos para controlar informacion--

const amDAO = new AgenciaMaritimaDAO()
const buqueDAO = new BuqueDAO()
const pedidoDAO =new PedidoDAO()

///inicio-----------------------------------------------------------------------------

crearSpanNuevosPedidos()

/// ELEMENTOS HTML--
let btningresarPedido = document.getElementById("ingresarPedido")
/// EVENTOS DE INICIO
btningresarPedido.addEventListener("click" , ()=>vistaPedido())


////funciones -------------------------------------------------------------------------

//////// FUNCIONES PARA VISUALIZACION DEL SPAN 

function crearSpanNuevosPedidos (){
    let btnVistaPedidos = document.getElementById("vistaPedidos")
    let span = document.createElement("span")
    span.classList.add("badge","badge-light","bg-danger","mx-2")
    span.setAttribute("id","spanNuevopedido")
    btnVistaPedidos.appendChild(span) 
}

function nuevoPedido (){   
    let span = document.getElementById("spanNuevopedido")
    span.innerText = `${buscarNumeroDeNuevosPedidos()}`
}

function buscarNumeroDeNuevosPedidos (){
    let nroPedidos = 1
    for (let index =0 ; index < sessionStorage.length ; index++){
        let clave = sessionStorage.key(index)
            console.log(clave)
            if ((clave.indexOf("pedidos" ,0) )!=-1){
                nroPedidos+=1
            } 
    }
    return nroPedidos
}

/////////////////////////////////////////
function resetearInputs (){
    let inputs = document.querySelectorAll(".form-control")
    let selects = document.querySelectorAll(".form-select")

    inputs.forEach(nodo=>{
    nodo.value=""
    nodo.classList.remove("is-invalid")
    nodo.classList.remove("is-valid")
                        })
    selects.forEach(nodo=>{
        nodo.value="" 
        nodo.classList.remove("is-invalid")
        nodo.classList.remove("is-valid")
    })
}

//// FUNCIONES PARA TRAER INFORMACION A LOS INPUTS 

function cargarBuques (){
    buqueDAO.arrayBuques=[]
    let arrayBuques = buqueDAO.traerTodo()
    let optBuques = document.getElementById("optBuques")

    arrayBuques.forEach(objet=>{
        let option = document.createElement("option")
        option.value=objet.nombreBuque
        option.text=objet.nombreBuque
        optBuques.appendChild(option)
    })
}

function cargarAgencias (){
    amDAO.arrayAgencias=[]
    let arrayAgencias = amDAO.extraerDatos()
    let optAgencias = document.getElementById("optAgencias")

    arrayAgencias.forEach(objet=>{
        let option = document.createElement("option")
        option.value=objet.nombre
        option.text=objet.nombre
        optAgencias.appendChild(option)
    })
}


///// FUNCIONES PARA AGREGAR DATOS DESDE LOS INPUTS

function agregarBuque (){
    
    let nombreBuque = document.getElementById("nuevoBuque").value
    let matricula = document.getElementById("matriculaB").value
    let agenciaMaritima =amDAO.buscarAgencia(document.getElementById("optAgencias").value) 
    let buque = new Buque (nombreBuque,matricula,agenciaMaritima)
    let flag =validarCampos("val-2")
    
    if(flag ===false){
        
        buqueDAO.agregarbuque(buque)
        vistaPedido()
    }
}

function agregarAgencia (){
    let nombre = document.getElementById("amNombre")
    let contacto = document.getElementById("amContacto")
    let direccion = document.getElementById("amDireccion") 
    let agencia = new AgenciaMaritima(nombre.value,contacto.value,direccion.value)
    
    let flag = validarCampos("val-3")
    if(flag ===false){
        amDAO.agregarAgencia(agencia)
        vistaAgregarBuque()
    }
    
} 


function agregarPedido (){

    let nombreBuque = document.getElementById("optBuques").value
    let buque = buqueDAO.buscarBuque(nombreBuque)
    let cantidad = document.getElementById("litros").value
    let horario = document.getElementById("horario").value
    let fecha = document.getElementById("fecha").value
    let pedido = new Order(cantidad,fecha,horario,buque)
    
    let flag=validarCampos("val-1")
    if(flag===false){
        nuevoPedido()
        pedidoDAO.agregarPedido(pedido)
        pedidoDAO.guardarDatosSession(pedido)
        resetearInputs()
    }

}

///////////// VALIDACIONES 

function validarCampos (clase){
    let nodos = document.querySelectorAll(`.${clase}`)
    let flag = false 
    nodos.forEach(element => {
        element.classList.remove("is-valid")
        element.classList.remove("is-invalid")
    });
 

    nodos.forEach(element => {
        if(element.value===""){
            element.classList.add("is-invalid")
            flag = true
        }
        else  {
            element.classList.add("is-valid")
        }
    });

    return flag
}




///----------------------------------------------------------------------------------------------------

//////////////////// VISTAS ---------------------------------------------------------------------------

function vistaAgregarBuque (){

    let menu = document.getElementById("pedido")
    
    
    menu.innerHTML = 
    `
    <img src="/Pictures/big-data.png" alt="" class ="mx-4 mt-2 mb-2">
    <div class="tab-pane mt-4 " id="buque" role="tabpanel" aria-labelledby="v-pills-profile-tab" >
        <div class ="d-flex flex-column col-10 border border-white border-3  rounded align-items-center mx-auto w-50 shadow-lg">
            <h5 class = "mt-2 font"><span><img class="mx-2" src="/Pictures/elbarco.png" alt=""></span>Ingreso de Buque</h5>
            <div class="input-group input-group-sm  mb-3 mt-2 w-50">
                <span class="input-group-text bg-secondary text-white font" id="basic-addon1">Buque</span>
                <input id ="nuevoBuque" type="text" class="form-control form-control-sm font val-2" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
            </div>
            <div class="input-group input-group-sm  mb-3 mt-2 w-50">
                <span class="input-group-text bg-secondary text-white font" id="basic-addon1">Matricula</span>
                <input id ="matriculaB" type="text" class="form-control form-control-sm font val-2  " placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
            </div>
            <div class="input-group  input-group-sm  mb-3 mt-2 w-50">
                <label class="input-group-text bg-secondary text-white font" >Agencia</label>
                <select class="form-select form-select-sm val-2 font" id="optAgencias">   
                </select>
                <button  id ="amBTN" class="btn btn-sm btn-outline-secondary font" type="button">Agregar</button>
            </div>
            <div class = "d-inline-flex mt-2 w-50 mb-2">
                <button id="btnCNbuque" class="btn btn-sm btn-secondary   mb-2  font p-1 border border-2 " type="button">Confirmar</button>
                <button id ="btnAtrasBuque"class="btn btn-sm btn-secondary   mb-2 mx-2 font p-1 border border-2" type="button">Atras</button>
            </div>
        </div>
   </div>

    `
    
    //FUNCIONES
    cargarAgencias()

    //NODOS HTML
    let btnconfirm = document.getElementById("btnCNbuque")
    let btn = document.getElementById("amBTN")
    let btnAtras = document.getElementById("btnAtrasBuque")
    //let btnpedido = document.getElementById("btnPedido")
    
    
    //EVENTOS
    btn.addEventListener("click",()=>vistaAgregarAgencia())
    btnAtras.addEventListener("click" , ()=>vistaPedido())
    btnconfirm.addEventListener("click" ,()=>agregarBuque())
   // btnconfirm.addEventListener("click" , ()=>vistaPedido())
   // btnpedido.addEventListener("click" , ()=>agregarPedido())
    //btnpedido.addEventListener("click" , ()=>resetearInputs())
    
}


function vistaPedido (){
    let menuPedido = document.getElementById("pedido")
    let fecha = luxon.DateTime.now().toFormat('yyyy-MM-dd')

   

    menuPedido.innerHTML = 
    `
        <img src="/Pictures/big-data.png" alt="" class ="mx-4 mt-2 mb-2">
        <div class="tab-pane mt-4 " id="pedido" role="tabpanel" aria-labelledby="v-pills-profile-tab" >
            <div class ="d-flex flex-column col-10 border border-white border-3  rounded align-items-center mx-auto w-50 shadow-lg">
                <h5 class = "mt-4  font mx-2"> <span><img class="mx-2" src="/Pictures/caja.png" alt=""></span>Ingreso de Pedido</h5>
                <div class="input-group input-group-sm  w-50  mx-2 mt-4">
                    <label class="input-group-text  bg-secondary text-white font" >Buque</label>
                    <select id="optBuques" class="form-select form-select-sm val-1 font col-6 ">
                    </select>
                    <button  id ="ipBTN" class="btn btn-sm btn-outline-secondary font" type="button">Agregar</button>
                </div>
                <div class="input-group input-group-sm  mt-4 w-50  mx-2"">
                    <span class="input-group-text bg-secondary text-white font " id="basic-addon1">Litros</span>
                    <input min="4000" id = "litros" type="number" class="form-control form-control-sm val-1 font " placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                </div>
                <div class="input-group input-group-sm mt-4 w-50  mx-2"">
                    <span class="input-group-text bg-secondary text-white font " id="basic-addon1">Horario</span>
                    <input id="horario" type="time" class="form-control form-control-sm val-1 font" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                </div>
                <div class="input-group input-group-sm mt-4 w-50  mx-2"">
                    <span class="input-group-text bg-secondary text-white font " id="basic-addon1">Fecha</span>
                    <input min ="${fecha}" id="fecha" type="date" class="form-control form-control-sm font val-1" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
                </div>
                
                    <button id="btnPedido" class ="btn btn-sm btn-secondary mt-4  mb-2  font p-1 border border-2" >Confirmar</button>
                
            </div>   
        </div>
    `
    cargarBuques()
    let btnAgregar = document.getElementById("ipBTN")
    btnAgregar.addEventListener("click" , ()=>vistaAgregarBuque())
    let btnpedido = document.getElementById("btnPedido")
    btnpedido.addEventListener("click" , ()=>agregarPedido())
    

    

}



function vistaAgregarAgencia (){

    let menuPrincipal = document.getElementById("pedido")
    menuPrincipal.innerHTML=
    
    `
    <img src="/Pictures/big-data.png" alt="" class ="mx-4 mt-2 mb-2">
    <div class="tab-pane fade show mt-4 " id="pedido" role="tabpanel" aria-labelledby="v-pills-home-tab">
        <div class ="d-flex flex-column col-10 border border-white border-3  rounded align-items-center mx-auto w-50 shadow-lg">
            <h5 class = "mt-2 font">Ingreso de Agencia Maritima</h5>
            <div class="input-group input-group-sm  mb-3 mt-2 w-50">
                <span class="input-group-text bg-secondary text-white  font " id="basic-addon1">Nombre</span>
                <input id = "amNombre" type="text" class="form-control form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
            </div>
            <div class="input-group input-group-sm  mb-3 mt-2 w-50">
                <span class="input-group-text bg-secondary text-white font " id="basic-addon1">Contacto</span>
                <input placeholder="(Código de área) Número" id = "amContacto" type="tel" class="form-control form-control-sm font val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
            </div>
            <div class="input-group input-group-sm  mb-3 mt-2 w-50">
                <span class="input-group-text bg-secondary text-white font" id="basic-addon1">Direccion</span>
                <input id="amDireccion" type="text" class="form-control form-control-sm font  val-3" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required>
            </div>
            <div class = "d-inline-flex w-50 ">
                <button id="amAgregarBTN" class ="btn btn-sm btn-secondary  mb-2  font p-1 border border-2" >Confirmar</button>
                <button id ="btnAtrasAgencia" class="btn btn-sm btn-secondary  mb-2 mx-2 font p-1 border border-2" type="button">Atras</button>
            </div>
        </div>    
    </div>`

    
    // NODOS HTML
    let btnAgregar = document.getElementById("amAgregarBTN")
    let btnatrasAgencia=document.getElementById("btnAtrasAgencia")

    /// EVENTOS 
    btnAgregar.addEventListener("click",()=>agregarAgencia())
   // btnAgregar.addEventListener("click" , ()=>vistaAgregarBuque())
    btnatrasAgencia.addEventListener("click" , ()=>vistaAgregarBuque())

}

//////////////////////--------------------------------------------------------------------------------




    


