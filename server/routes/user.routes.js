import exp from 'constants';
import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser, getUserListingsCount } from '../controllers/user.controller.js';
import {verifyToken} from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
//Primero verificamos el token para que no se pueda actualizar un usuario sin estar autenticado
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', getUserListings);
router.get('/:id',getUser);
router.get('/count/:id',getUserListingsCount); 

export default router;