
import Order from '../Models/Order.js'

/// Clase  para manipular la informacion referente a las ordenes 

export default class PedidoDAO {
    arrayPedidos = []
    tipo ="pedidos"

    constructor(){

    }


    eliminarPedido (id){
        let busqueda= this.buscarPedido(id)
        localStorage.removeItem(`${this.tipo}+${id}`)
        this.arrayPedidos=[]
    }

    agregarPedido (pedido){
        this.arrayPedidos=[]
        let Buque = pedido.buque
        this.traerDatos()
        pedido.setID(this.buscarID())
        pedido.setDJ(this.buscarDjxBuque(Buque.nombreBuque))
        this.arrayPedidos.push(pedido)
        this.guardarDatos()
    }


    buscarPedido (id){
        let pedido = null 
        this.traerDatos()
        this.arrayPedidos.forEach(pedidos=>{
            if (pedidos.Id === id){
                pedido = pedidos
            }
        })
       
        return pedido
    }


    /// funcion para encontrar el numero de declaracion jurada(es una declaracion que se debe presentar cada vez que se realiza un pedido,ley impuesta por la afip) correspondiente a cada buque, estas son correlativas , por lo que, la funcion es igual a la del id, con la diferencia que se individualiza por buque.

    buscarDjxBuque (nombreBuque){
        let nuevoNumeroDJ = 1 ;
        this.arrayPedidos.sort((x,y)=>x.Id - y.Id)
        this.arrayPedidos.forEach(pedido => {
            let buque = pedido.buque
            if(nombreBuque === buque.nombreBuque ){
                nuevoNumeroDJ = nuevoNumeroDJ<= pedido.dj ? ++nuevoNumeroDJ : nuevoNumeroDJ
            }
        });
        return nuevoNumeroDJ
        
    }


    buscarID (){
        let ID = 1 ;
        this.traerDatos()
        this.arrayPedidos.sort((x,y)=>x.Id -y.Id)
        for (let index = 0 ; index < this.arrayPedidos.length ; index++){
                let objet = this.arrayPedidos[index]
                ID = ID <= objet.Id ? ++ID : ID  
        }
        return ID ;
    }

    traerTodo (){
        this.traerDatos()
        return this.arrayPedidos
    }


    traerDatos (){
        for (let index = 0; index < localStorage.length; index++) {
            let clave = localStorage.key(index)
            
            if ((clave.indexOf(this.tipo ,0) )!=-1){
                let pedido = JSON.parse(localStorage.getItem(clave))
                
                this.arrayPedidos.push(pedido)
            } 
            
        }
    }

    guardarDatos (){
        this.arrayPedidos.forEach(objet=>{
            localStorage.setItem(`${this.tipo}+${objet.Id}`,JSON.stringify(objet))
        })
    }

    modificarPedido (objet){
        localStorage.setItem(`${this.tipo}+${objet.Id}`,JSON.stringify(objet))
    }

    guardarDatosSession (pedido){
        
        sessionStorage.setItem(`${this.tipo}Storage${(sessionStorage.length+1)}` ,JSON.stringify(pedido))
    }





}