// Path ./routes/medicos


const { Router }  = require('express')
const { check }    = require('express-validator')
const { validarCampo }         = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedico, crearMedico, actualizarMedico, borrarMedico } = require("../controllers/medicos.controllers")

const router = Router();

router.get( '/', getMedico);

router.post( '/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('idHospital', 'El idHospital debe ser valido').isMongoId(),
    validarCampo
],crearMedico);

router.put( '/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El idHospital debe ser valido').isMongoId(),
    validarCampo
] ,actualizarMedico);

router.delete( '/:id', borrarMedico);



module.exports = router
