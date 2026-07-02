import { Router } from 'express';
import {
  createDonation,
  getDonation,
} from '../controllers/donationsController.js';

const router = Router();

router.post('/', createDonation);
router.get('/:id', getDonation);

export default router;
