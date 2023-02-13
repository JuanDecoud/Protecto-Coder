import PedidoDAO from "../DAO/PedidoDAO.js"

let pedidodao = new PedidoDAO()





//////// BOTONES -------------------------------------

let btnBusqueda = document.getElementById("btnBusqueda")
btnBusqueda.addEventListener("click" , ()=>limpiarTabla())

let btnfiltroxFecha = document.getElementById("btnFiltrarxFecha")
btnfiltroxFecha.addEventListener("click" , ()=>buscarxRango())


let btnBuscarxNombre = document.getElementById("btnFiltrarxBuque")
btnBuscarxNombre.addEventListener("click" , ()=>buscarxNombreBuque())

//////// FUNCIONES -----------------------------------------------

function buscarxRango (){
    let fdesde = document.getElementById("fdesde")
    let fhasta = document.getElementById("fhasta")
    pedidodao.arrayPedidos=[]

    let pedidos = pedidodao.traerTodo();
    let tablaBody = document.getElementById("tablaBodyFiltros")
    tablaBody.innerHTML=""

    pedidos.forEach(pedido => {

        let {Id,dj,cantidad,fecha,hora,buque,estado,unidad}=pedido

        if(fecha>= fdesde.value && fecha <= fhasta.value){

            let tr = document.createElement("tr")
            if(estado==="Despachado"){
                 tr.classList.add("table-warning")    
            }
           
            let {nombreBuque} = buque
            let {nombre,apellido}= unidad
     
            tr.innerHTML =
             `
                 <tr class ="p-0">
                     <td>${Id}</td>
                     <td class= "">${nombreBuque}</td>
                     <td id ="chofer${Id}">${nombre} ${apellido}</td>
                     <td>${cantidad}</td>
                     <td>${fecha}</td>
                     <td>${hora}</td>
                     <td>${dj}</td>
                 <tr>
             `
             tablaBody.appendChild(tr)
            
        }
        
    });
}

function limpiarTabla (){
    let tablaBody = document.getElementById("tablaBodyFiltros")
    tablaBody.innerHTML=""
}


function buscarxNombreBuque (){
    let nombreBuque = document.getElementById("buqueFiltro").value
   
    pedidodao.arrayPedidos=[]

    let pedidos = pedidodao.traerTodo();
    let tablaBody = document.getElementById("tablaBodyFiltros")
    tablaBody.innerHTML=""

    pedidos.forEach(pedido => {
        let buque = pedido.buque

        if(buque.nombreBuque === nombreBuque){

            let tr = document.createElement("tr")
            if(pedido.estado==="Despachado"){
                 tr.classList.add("table-warning")
                 
            }
           
            let buque = pedido.buque
            let unidad = pedido.unidad
     
            tr.innerHTML =
             `
                 <tr class ="p-0 ">
                     <td>${pedido.Id}</td>
                     <td class= "">${buque.nombreBuque}</td>
                     <td id ="chofer${pedido.Id}">${unidad.nombre} ${unidad.apellido}</td>
                     <td>${pedido.cantidad}</td>
                     <td>${pedido.fecha}</td>
                     <td>${pedido.hora}</td>
                     <td>${pedido.dj}</td>
                 <tr>
             `
             tablaBody.appendChild(tr)
            
        }
        
    });
}