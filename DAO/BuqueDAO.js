

/// Clase para manipular la informacion referente a los buques


export default class BuqueDAO {
    arrayBuques = []
    tipo ="buque"

    constructor(){

    }

    buscarBuque (nombreBuque){
        let busqueda = null 
        this.traerDatos()
        this.arrayBuques.forEach(buque=>{
            if (buque.nombreBuque == nombreBuque){
                busqueda = buque 
            }
        })
        return busqueda
    }

    agregarbuque (buque){
        this.traerDatos()
        this.arrayBuques.push(buque)
        this.guardarDatos()
    }

    traerTodo (){
        this.traerDatos()
        return this.arrayBuques
    }


    traerDatos (){
        for (let index = 0; index < localStorage.length; index++) {
            let clave = localStorage.key(index)
            
            if ((clave.indexOf(this.tipo ,0) )!=-1){
                let agencia = JSON.parse(localStorage.getItem(clave))
                
                this.arrayBuques.push(agencia)
            } 
            
        }
    }

    guardarDatos (){
        this.arrayBuques.forEach(objet=>{
            localStorage.setItem(`${this.tipo}+${objet.matricula}`,JSON.stringify(objet))
        })
    }



}