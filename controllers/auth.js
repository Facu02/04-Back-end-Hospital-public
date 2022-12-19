const {response} = require('express')
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');
const { googleAutenticador } = require('../helpers/google-verify');



const login =async (req, res = response) => {
    const { email, password } = req.body

    try {

        // Verificar email

        const usuarioDB = await Usuario.findOne({email})

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg: 'el usuario no se encontro'
            })
        }

        // Verificar contraseña

        const validarPassword = bcrypt.compareSync( password, usuarioDB.password )

        if(!validarPassword){
            return res.status(400).json({
                ok:false,
                msg: 'el usuario no se encontro'
            })
        }

        // Generar el TOKEN

        const token = await generarJwt( usuarioDB.id )

        return res.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: ' habla con el admin pa'
        })
    }
}

const loginGoogle =async (req, res = response) => {

    
    try {
       
    const {email,name,picture} = await googleAutenticador(req.body.token)

    const usuarioDB = await Usuario.findOne({email:email})
    let  usuarioGoogle;

    if( !usuarioDB ){
        usuarioGoogle = new Usuario({
            nombre: name,
            email:email,
            password:'@@@',
            img: picture,
            google:true
        })
    }else{
        usuarioGoogle = usuarioDB
        usuarioGoogle.google = true;
    }
    // Se guarda usuario
    await usuarioGoogle.save()

    // GenerarToken

    const token = await generarJwt(usuarioGoogle.id)
    
    res.status(200).json({
        ok:true,
        email,name,picture,
        token
    })

   } catch (error) {
    res.status(400).json({
        ok:false,
        msg:'token no valido'
    })
   }

   
}

const renovarToken = async(req, res = response) =>{

    const uid = req.uid
    // EL UID LO CONSEGUIMOS EN EL MOMENTO QUE VALIDAMOS TOKEN

    const token = await generarJwt(uid)

    const usuarioDB = await Usuario.findById(uid)
    
    res.status(200).json({
        ok:true,
        token,
        usuarioDB
    })
}

module.exports = {
    login,
    loginGoogle,
    renovarToken
}