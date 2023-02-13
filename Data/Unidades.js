
import UnidadesDAO from "../DAO/UnidadesDAO.js";

 async function  cargarUnidades   (){
 let unidadDao = new UnidadesDAO()

    const  respuesta = await 
    fetch(`Data/unidades.json`)
    let data = []
    data = await respuesta.json()
    data.forEach(element => {
        unidadDao.guardarDatos(element)
    });
    
}

cargarUnidades()





