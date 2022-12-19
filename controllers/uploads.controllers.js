const path = require('path')
const fs = require('fs')

const { response, request} = require('express')
const { v4: uuidv4 } = require('uuid');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico.models');
const Usuario = require('../models/usuario');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUploads = async (req= request, res= response)=>{

    try {
        const  tipo = req.params.tipo
    const  id = req.params.id

    validarTipos(tipo, res)

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg: 'No files were uploaded.'
        });
      }

    // procesar imagen

    const file = req.files.imagen

    const nombreCortado = file.name.split('.')
    const extensionDelArchivo = nombreCortado[nombreCortado.length -1]

    const extensionesValidas = ['jpg','png', 'jpeg' , 'gif']

    if(!extensionesValidas.includes(extensionDelArchivo)){
        return res.status(400).json({
            ok:false,
            msg: 'el tipo de archivo no es aceptado'
        })
    }

    // Generar nombre unico del archivo
    const nombreDelArchivo = `${uuidv4()}.${extensionDelArchivo}`

    // Path : donde se va a guardar
    const path = `./uploads/${tipo}/${nombreDelArchivo}`

    const cuentaAcambiar = await existeCuenta(id, tipo)

    if(!cuentaAcambiar){
        return res.json({
            ok:false,
            msg:'no hay un Usuario con ese ID'
        })
    }

    // Guardar Archivo
    file.mv(path, async (err) =>{
        if (err){
            return res.status(500).send(err);
        }

        if(!await actualizarImagen(cuentaAcambiar,tipo, nombreDelArchivo)){
            return res.json({
                ok:false,
                msg:'No se puedo actualizar la imagen ver consola'
            })
        };
    
        return res.json({
            ok:true,
            msg:'la imagen fue actualizada con exito',
            nombreImg : nombreDelArchivo
        })
    });

        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok:false,
            msg: 'error importante revisar consola'
        })
    }
}


const retornoImagen=( req= request, res= response )=> {

    const  tipo = req.params.tipo
    const  foto = req.params.foto

    const pathOfImg = path.join( __dirname, `../uploads/${tipo}/${foto}`)

    
    if(!fs.existsSync(pathOfImg)){
        const ErrorImg = path.join( __dirname, `../uploads/no-img.jpg`)
        return res.sendFile(ErrorImg)
    }
    res.sendFile(pathOfImg)
}

const existeCuenta= async(id,tipo) => {

    let CuentaActualizada= {}
    switch(tipo){
        case'medicos':
        CuentaActualizada = await Medico.findById(id)     
        break;
        case'hospitales':
        CuentaActualizada = await Hospital.findById(id)
        break;
        case'usuarios':
        CuentaActualizada = await Usuario.findById(id)            
        break;
    }

    return CuentaActualizada

}

const validarTipos = (tipo, res= response)=>{  
    const tipoValidos = ['hospitales', 'medicos', 'usuarios'] 
    if(!tipoValidos.includes(tipo)){
        return res.status(400)
        // .json({
        //     ok:false,
        //     msg:"El tipo no es valido, este tiene que ser 'hospitales', 'medicos', 'usuarios' "
        //     })
    }
}


module.exports = {
    fileUploads,
    retornoImagen
}