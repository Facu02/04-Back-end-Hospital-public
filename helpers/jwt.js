const jwt = require('jsonwebtoken')

const generarJwt = (uid) =>{

    return new Promise ( (resolve , reject ) =>{

        const payload = {
            uid
        }
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject(err, 'No se puedo generar el JWT')
            }else{
                resolve(token)
            }
        } )

    } )
}


module.exports = {
    generarJwt
}