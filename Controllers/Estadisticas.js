import PedidoDAO from "../DAO/PedidoDAO.js";

let pedidoDAO = new PedidoDAO


estadisticas()

let btnEstadisticas = document.getElementById("btnGENERAL")
btnEstadisticas.addEventListener("click" , ()=>estadisticas())


function estadisticas(){
    pedidoDAO.arrayPedidos=[]
    let pedidos = pedidoDAO.traerTodo()
    
    let ventas = document.getElementById("ventasTotales")
    let litros =parseInt( calcularLitros(pedidos))
    ventas.innerText=`${litros} LTS`

    let promedio = document.getElementById("promedioVentas")
    promedio.innerText=`${cancularPromedio(pedidos ,litros)} LTS`
    let ingresos = document.getElementById("Ingresos")
    ingresos.innerText=`$ ${calcularIngresos(calcularLitros(pedidos),localStorage.getItem("precioGo"))}`

    let despachos = document.getElementById("nroDespachos")
    despachos.innerText = `${calcularDespachos(pedidos)}`

}



function calcularLitros (pedidos){
   
    let litros = 0
    
    pedidos.forEach(pedido => {
        let sumar = parseInt(pedido.cantidad)
        litros += sumar
    });
    return litros
}

function cancularPromedio (pedidos , litros){
    let promedio = 0 ;

    promedio = litros/pedidos.length
    return promedio.toFixed(2)

}

function calcularIngresos (litros , precioGo){
    let ingresos = litros*precioGo
    return ingresos.toFixed(2)
}


function calcularDespachos (pedidos){
    let nroDespachos = 0 
    pedidos.forEach(pedido => {
        if (pedido.estado ==="Despachado"){
            ++nroDespachos
        }
    })
    return nroDespachos
}