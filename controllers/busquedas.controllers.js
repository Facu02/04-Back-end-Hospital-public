const { response, request} = require('express')
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico.models');


const getBusquedas= async(req = request, res = response)=>{
    try {
        
        let wordSeach  = req.params.busqueda
        const regex    = new RegExp( wordSeach , 'i')

        const [usuarios, hospital, medico] = await Promise.all([
            Usuario.find(   {nombre:regex} ),
            Hospital.find(  {nombre:regex} ),
            Medico.find(    {nombre:regex} ),
        
            ])
        

        res.status(200).json({
            ok:true,
            msg:'funciona broooo',
            usuarios,
            hospital,
            medico
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'algo malio sal bro'
        })
    }
}


const getDocumentos = async(req = request, res = response)=>{
    try {
        
        let tabla       = req.params.tabla
        let wordSeach  = req.params.busqueda
        const regex    = new RegExp( wordSeach , 'i')

        let data= [];

        switch (tabla) {
            case 'medicos':

               data = await Medico.find({nombre:regex});
                
            break;
            case 'hospitales':
               data = await Hospital.find(  {nombre:regex} );
                
            break;
            case 'usuarios':
                data = await Usuario.find(   {nombre:regex} )
                
            break;
        
            default:
                return res.status(400).json({
                    ok:false,
                    msg:'Coleccion no encontrada'
                })
            break;
        }
        res.status(200).json({
            ok:true,
            msg:'funciona broooo',
            resultado: data
        })
        
    } catch (error) {
       
        res.status(500).json({
            ok:false,
            msg:'algo malio sal bro'
        })
    }
}




module.exports ={
    getBusquedas,
    getDocumentos
}