const { response, request} = require('express')
const Medico = require('../models/medico.models')


const getMedico = async (req= request, res = response) =>{

    const  medicos = await Medico.find()
                            .populate('usuario', 'nombre img')
                            .populate('hospital' , 'nombre');

        try {

        res.json({
        ok:true,
        medicos,
        img: medicos.img
        })
        } catch (error) {

        }
}


const crearMedico = async(req= request, res = response) =>{

    const uid = req.uid;
    const {idHospital, nombre } = req.body

  
    const medico = new Medico({
        nombre,
        usuario:uid,
        hospital:idHospital,
        ...req.body
    })



    try {
        const MedicoBD = await medico.save()
        
        res.json({
            ok:true,
            Medico: MedicoBD
        })
    } catch (error) {
        console.log(error),
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        }) 
    }

}

const actualizarMedico = async(req= request, res = response) =>{

    try {
        // se tiene que poder actualizar el nombre, usuario y hospital
        const idMedico   = req.params.id
        const idUser     = req.uid
        const newNombre  = req.body.nombre
        const idHospital = req.body.hospital
    
    
        const medicoBD = await Medico.findById(idMedico)
    
        if(!medicoBD){
            return res.status(404).json({
                ok:false,
                msg:'medico no encontrado'
            })
        }
    
        const cambiosDelMedico = {
            nombre : newNombre,
            usuario : idUser,
            hospital:idHospital
        }
    
        const  medicoActualizado =await Medico.findByIdAndUpdate(idMedico, cambiosDelMedico,{new:true})
    
        
        res.json({
            ok:true,
            msg:'actualizarMedico',
            medicoActualizado
        })        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'error comunicarse con el admin'
        })    
    }
}


const borrarMedico = async (req= request, res = response) =>{

    try {

        const idMedico = req.params.id
        console.log(idMedico, idMedico.length)

        const medicoDB = await Medico.findById(idMedico)

        if(!medicoDB){
            return res.status(404).json({
                ok:false,
               msg:'el Medico no fue encontrado'
           })
        }


        await Medico.findByIdAndDelete(idMedico)
        
        res.json({
            ok:true,
            msg:'Hospital Eliminado'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'error comunicarse con el admin'
        }) 
    }
}



module.exports = {
getMedico,
crearMedico,
actualizarMedico,
borrarMedico,
}