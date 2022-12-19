const { Router }  = require('express')
const { check } = require('express-validator')
const { login, loginGoogle,renovarToken }  = require('../controllers/auth')

const { validarCampo } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

// Path : /api/login

const router = Router()

router.post( '/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampo
],login)

router.post( '/google',[
    check('token', 'El token de google es obligatorio').not().isEmpty(),
    validarCampo
],loginGoogle)

router.get( '/renew',validarJWT,renovarToken)

module.exports = router