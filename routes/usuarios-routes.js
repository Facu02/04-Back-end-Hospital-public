// Ruta : '/api/usuarios'

const { Router }  = require('express')
const {check }    = require('express-validator')
const { validarCampo }         = require('../middlewares/validar-campos')
const { getUsuarios , crearUsuario,actualizarUsuario,borrarUsuario} = require('../controllers/usuarios.controllers');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT ,getUsuarios);

router.post( '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password','La contraseña es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        validarCampo,
      
    ]
    ,crearUsuario
);

router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password','La contraseña es obligatorio').not().isEmpty(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampo,
    ]
,actualizarUsuario);

router.delete( '/:id',  validarJWT,borrarUsuario);



module.exports = router
