const { response, request} = require('express')
const Hospital = require('../models/hospital')


const getHospitales = async(req= request, res = response) =>{

    const  hospitales = await Hospital.find()
                                      .populate('usuario', 'nombre img')

    try {
        
        res.json({
            ok:true,
            hospitales
        })
    } catch (error) {
        
    }

}


const crearHospital = async(req= request, res = response) =>{

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body });
    try {


        
        const hospitalDB = await hospital.save()

        res.json({
            ok:true,
            hospital: hospitalDB
        })

    } catch (error) {
        
        return res.status(500).json({
            ok:false,
            msg: ' error inesperado F bro'
        })

    }

}

const actualizarHospital = async (req= request, res = response) =>{

    try {

        const idHospital = req.params.id
        const hospitalBD = await Hospital.findById(idHospital)

        if(!hospitalBD){
            return res.status(404).json({
                 ok:false,
                msg:'el hospital no fue encontrado'
            })
        }

        const cambiosHospital ={
            nombre: req.body.nombre,
            usuario: req.uid,
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( idHospital, cambiosHospital, {new:true})

        res.json({
            ok:true,
            msg:'actualizarHospital',
            hospitalActualizado
        })
        
    } catch (error) {
        res.status(500).json({
            msg:'error con el servidor'
        })
    }

}


const borrarHospital = async(req= request, res = response) =>{

    try {

        const idHospital = req.params.id

        const hospitalBD = await Hospital.findById(idHospital)

        if(!hospitalBD){
            return res.status(404).json({
                ok:false,
               msg:'el hospital no fue encontrado'
           })
        }


        await Hospital.findByIdAndDelete(idHospital)
        
        res.json({
            ok:true,
            msg:'Hospital Eliminado'
        })
    } catch (error) {
        
    }

}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}