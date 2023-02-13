export default class Buque {

    declaracionJurada

    constructor (nombreBuque,matricula,agenciaMaritima ){
        this.nombreBuque = nombreBuque
        this.matricula = matricula
        this.agenciaMaritima = agenciaMaritima
        
    }


    setDeclaracionJurada(djNumero){
        this.declaracionJurada = djNumero
    }
} 