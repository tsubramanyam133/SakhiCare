import { Router } from 'express';
import { createDoctor, getDoctors, updateDoctor, deleteDoctor } from '../controllers/doctor.controller';

const router = Router();

router.get('/', getDoctors);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;
