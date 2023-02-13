import Driver from '../Models/Driver.js'


export default class Order 
{
   
   Id 
   dj
   estado


    constructor (cantidad , fecha , hora , buque ){
        
        this.cantidad=cantidad 
        this.fecha=fecha 
        this.hora = hora 
        this.buque = buque 
        this.estado ="Pendiente"
        this.unidad="S/A"
       
    }

    setUnidad (unidad){
       this.unidad = unidad
    }

    setEstado(estado){
        this.estado=estado
    }

    setID(id){
        this.Id =id
    }

    setDJ(dj){
        this.dj = dj
    }

     mostrarOrden (){
        alert (` Id : ${this.Id} Buque: ${this.nombreBuque}  Cantidad: ${this.cantidad} Fecha: ${this.fecha} Horario: ${this.hora}`)
    }

   




}

