
import express from 'express';
import { deleteUser, getAllUsers, getUser } from '../../controllers/UserController';
import { ROLES_LIST } from '../../config/roles_list';


const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.delete('/user', deleteUser);
    
    //.get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
    // .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

// router.route('/:id')
//     .get(verifyRoles(ROLES_LIST.Admin), getUser);


export default router;