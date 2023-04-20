const { Router } = require('express');

const reservationController = require('../controllers/reservationController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/Auth');

const router = Router();



router.post('/rentcar', reservationController.Rentcar)
router.get('/admin/car', reservationController.allRentedOrders)
router.get('/userOrders', isAuthenticatedUser, reservationController.OrdersByUser)
router.get('/ordersForOwner', isAuthenticatedUser, reservationController.ordersForOwner)
router.delete('/cancleOrder/:id', isAuthenticatedUser, reservationController.CancelRentedOrders)

//reservations
router.get('/admin/userOrders/:id', isAuthenticatedUser, authorizeRoles('admin'),
    reservationController.AdminOrdersByUser)
router.get('/admin/carReservations/:id', isAuthenticatedUser, authorizeRoles('admin'),
    reservationController.RentedOrdersOncar)
router.get('/admin/allOrders', isAuthenticatedUser, authorizeRoles('admin'), reservationController.allRentedOrders)


router.put('/updateReservation/:id', reservationController.updateReservation)
router.put('/updateReservation2/:id', reservationController.updateReservation2)



module.exports = router;

