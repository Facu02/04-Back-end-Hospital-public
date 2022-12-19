
const fs = require('fs')


const actualizarImagen = async(cuentaAcambiar,tipo,nombreDelArchivo) =>{

    let CuentaActualizada =cuentaAcambiar;

    const pathViejo= `./uploads/${tipo}/${CuentaActualizada.img}`

    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo)
    }

    CuentaActualizada.img = nombreDelArchivo;
    await CuentaActualizada.save()
    return true
        
}

module.exports = {
    actualizarImagen
}