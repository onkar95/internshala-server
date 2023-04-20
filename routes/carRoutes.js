const { Router } = require('express');

const carController = require('../controllers/carController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/Auth');

const router = Router();

//cars route controller
router.get('/allcars', carController.GetAllcars)
router.get('/carsOfAgency', isAuthenticatedUser, carController.Getownercars)
router.post('/addcar', carController.Addcar)

router.get('/Singlecar/:id', carController.GetSinglecar)
router.put('/owner/updatecar/:id', isAuthenticatedUser, authorizeRoles("owner"), carController.updatecar)
router.delete('/owner/deleteCar/:id', isAuthenticatedUser, authorizeRoles("owner"), carController.Deletecar)

// router.put('/updatecarAvailability/:id', isAuthenticatedUser, carController.updatecarAvailability)
// router.put('/RatingForcar/:id', isAuthenticatedUser, createcarReview)
// router.put('/review/:id', carController.createcarReview)
// router.post('/addcar', isAuthenticatedUser, authorizeRoles("manager"), carController.Addcar)

module.exports = router