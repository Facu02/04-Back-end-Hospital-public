const { response, request} = require('express')
const jwt = require('jsonwebtoken')


const validarJWT = (req =request, res =response, next) => {

    // leer el Token
    const token = req.header('x-token')
    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'No hay token compa'
        })
    }

    try {

        const { uid } = jwt.verify(token,process.env.JWT_SECRET);

        req.uid = uid
        
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            msg:'token incorrecto'
        })
    }

}

module.exports={
    validarJWT
}