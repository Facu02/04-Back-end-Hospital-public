// Path : /api/hospitales


const { Router }  = require('express')
const { check }    = require('express-validator')
const { validarCampo }         = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const { getHospitales,crearHospital,actualizarHospital,borrarHospital } = require("../controllers/hospitales.controllers")

const router = Router();

router.get( '/', getHospitales);

router.post( '/',[
    validarJWT,
    check('nombre' ,'el nombre del hospital es necesario').not().isEmpty(),
    validarCampo
],crearHospital
);

router.put( '/:id', [
    validarJWT,
    check('nombre' ,'el nombre del hospital es necesario').not().isEmpty(),
] ,actualizarHospital);

router.delete( '/:id', validarJWT ,borrarHospital);

module.exports = router
