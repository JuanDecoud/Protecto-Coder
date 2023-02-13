
/// Clase para manejar la informacion referente a las Agencias Maritimas

export default class AgenciaMaritimaDAO {
    arrayAgencias = []
    tipo ="agencia"

    constructor(){
    }

    agregarAgencia (agencia){
        agencia.setId(this.buscarID()) 
        this.arrayAgencias.push(agencia)
        this.guardarDatos()
    }

    extraerDatos (){
        this.traerDatos()
        return this.arrayAgencias
    }


    buscarAgencia (nombreAgencia){
        this.extraerDatos
        let agencia = this.arrayAgencias.find(objeto=>objeto.nombre == nombreAgencia)
        return agencia ;  
    }


    buscarID (){
        let ID = 1 ;
        let array = this.extraerDatos()
        for (let index = 0 ; index<array.length ; index++){
                let objet = array[index]
                ID = ID <= objet.id ? ++ID : ID  
        }
        return ID ;
    }

    traerDatos (){
        for (let index = 0; index < localStorage.length; index++) {
            let clave = localStorage.key(index)
            
            if ((clave.indexOf(this.tipo ,0) )!=-1){
                let agencia = JSON.parse(localStorage.getItem(clave))
                
                this.arrayAgencias.push(agencia)
            } 
        }
    }

    guardarDatos (){
        this.arrayAgencias.forEach(objet=>{
            localStorage.setItem(`${this.tipo}+${objet.id}`,JSON.stringify(objet))
            
        })
    }


}