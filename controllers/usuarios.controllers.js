const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const { request,response } = require('express');
const usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');

const getUsuarios = async (req = request, res) => {

    const desde = Number(req.query.desde) || 0
    // const usuarios = await Usuario
    //                         .find()
    //                         .skip(desde)
    //                         .limit(5);

    // const total = await Usuario.count()

    const  [usuarios, total ]= await Promise.all([
        Usuario
            .find()
            .skip(desde)
            .limit(5),
        Usuario.countDocuments()
    ])
    
    res.json({
        ok:true,
        usuarios : usuarios,
        uid: req.uid,
        total
    });


} 

const crearUsuario = async(req, res = response) => {

   const {email , password} = req.body

  
    try{
       const existeEmail = await Usuario.findOne({email : email})

        if (existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'correo ya existe'
            })
        }

        const usuario =  new Usuario( req.body )

        // encriptar contraseña
        const salt = bcryptjs.genSaltSync();

        usuario.password = bcryptjs.hashSync( password, salt )
        

        // guardar usuarios
        await usuario.save()

        const token = await generarJwt( usuario.id )

        res.json({
            ok:true,
            usuario: usuario,
            token
        });
    }
    catch(error){
    console.log(error)
    res.status(500).json({
        ok:false,
        msg:'Erorr inesperado...'
        })
    }

} 

const actualizarUsuario = async (req,res = response) =>{
    
    // TODO: validar token

    const uid = req.params.id

    

    try {

        const usuarioDB = await buscarUsuarioPorId(uid)

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:"el usuario no se encontro"
            })
        }
        
        const {password , google , email ,...campos} = req.body

        if(usuarioDB.email !== email){
     
            const existeEmail = await Usuario.findOne({email: email})
             if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'ya existe un usuario con ese email'
                })
             }
        }

        // Actualizar usuarios

        if(!usuarioDB.google){
            campos.email = email;
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new:true} )


       


        return res.json({
            ok:true,
            usuario : usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"error mirar los logs"
        })
    }

}

const borrarUsuario = async(req,res = response) =>{

    const uid = req.params.id

try {
        
       const usuarioDB = await buscarUsuarioPorId(uid )

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:"el usuario no se encontro"
            })
        }

        await Usuario.findOneAndDelete(uid)

        res.json({
            ok:true,
            msg: 'usuario eliminado'
        })

    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:"error mirar los logs"
        })
    }

}


const buscarUsuarioPorId = async( uid)=>{

    let usuario = await Usuario.findById( uid )

     
    return usuario
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}