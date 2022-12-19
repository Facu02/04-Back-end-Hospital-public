// Path : api/todo/:busqueda

const {Router} = require('express');
const { getBusquedas, getDocumentos } = require('../controllers/busquedas.controllers');
const {validar} = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:busqueda',[
    validarJWT
], getBusquedas)

router.get('/coleccion/:tabla/:busqueda',[
    validarJWT
], getDocumentos)


module.exports = router