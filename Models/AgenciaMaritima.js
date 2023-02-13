export default class AgenciaMaritima {
    id = undefined
    constructor (nombre,contacto,direccion){
        this.nombre = nombre 
        this.contacto = contacto
        this.direccion = direccion
    }

    setId (id){
        this.id = id
    }

    
}