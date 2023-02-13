 export default class UnidadesDAO {

    tipo ="unidades"
    

    constructor(){

    }

    buscarUnidad (dni){
        let unidades = this.traerDatos()
        let unidad = null
        unidades.forEach(UNIDAD =>{
            if (UNIDAD.dni === dni){
                unidad = UNIDAD
            }
        })
        
        return unidad
    }

    traerDatos (){

        let Unidades = []
        for (let index = 0; index < localStorage.length; index++) {
            let clave = localStorage.key(index)
            
            if ((clave.indexOf(this.tipo ,0) )!=-1){
                let pedido = JSON.parse(localStorage.getItem(clave))
                Unidades.push(pedido)
            } 
            
        }
    
        return Unidades
        
    }


    guardarDatos (unidad){
        localStorage.setItem(`${this.tipo}+${unidad.dni}` ,JSON.stringify(unidad))
    }

}