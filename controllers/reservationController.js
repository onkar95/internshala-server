const CatchAsyncError = require('../middleware/CatchAsyncError');
const RentedOrders = require('../module/rentedOrders');
const ErrorHandler = require('../utils/errorHandelr');
const Car = require('../module/car');


module.exports.updateReservation = CatchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const { Active, } = req.body

    const reserv = await RentedOrders.findById(id)

    if (reserv) {
        const ReserveBike = await RentedOrders.findByIdAndUpdate(id, {
            $set: {
                Active,
            }
        }, {
            new: true
        })

        // console.log("updated", ReserveBike);
        res.status(200).json(ReserveBike);
    } else {
        return next(new ErrorHandler("No reservation found", 400))


    }


})

module.exports.updateReservation2 = CatchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const {
        rating
    } = req.body
    // console.log("req.body", req.body)
    const reserv = await RentedOrders.findById(id)
    if (reserv) {
        const ReserveBike = await RentedOrders.findByIdAndUpdate(id, {
            $set: {
                Rate: rating
            }
        }, {
            new: true
        })

        // console.log("updated", ReserveBike);
        res.status(200).json(ReserveBike);
    } else {
        return next(new ErrorHandler("No reservation found", 400))
    }


})
module.exports.Rentcar = CatchAsyncError(async (req, res, next) => {


    const addCart = await RentedOrders.create({
        rentedcar: req.body.rentedcar,
        rentedByUser: req.body.rentedByUser,
        Datefrom: req.body.Datefrom,
        Todate: req.body.Todate,
    })

    const car = await Car.findById(req.body.rentedcar)
    car.Availability = "Not Available"
    await car.save()
    res.status(200).json(addCart);


})

module.exports.RentedOrdersOncar = CatchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    var populateQuery = [{ path: "rentedByUser", module: "Users" }, { path: "rentedcar", module: "car" }];

    const ordersOncar = await RentedOrders.find({ rentedcar: id })
        .populate(populateQuery)

    res.status(200).json(ordersOncar);


})


module.exports.OrdersByUser = CatchAsyncError(async (req, res, next) => {

    const id = req.user.id;
    var populateQuery = [{ path: "rentedByUser", module: "Users" }, { path: "rentedcar", module: "car" }];
    const reservedByUser = await RentedOrders.find({ rentedByUser: id }).populate(populateQuery)
    res.status(200).json(reservedByUser);


})
module.exports.AdminOrdersByUser = CatchAsyncError(async (req, res, next) => {

    const id = req.params.id;
    var populateQuery = [{ path: "rentedByUser", module: "Users" }, { path: "rentedcar", module: "car" }];
    const reservedByUser = await RentedOrders.find({ rentedByUser: id }).populate(populateQuery)
    res.status(200).json(reservedByUser);


})

module.exports.ordersForOwner = CatchAsyncError(async (req, res, next) => {

    const id = req.user.id;
    var populateQuery = [{ path: "rentedByUser", module: "Users" }, { path: "rentedcar", module: "car" }];
    let allOrders = await RentedOrders.find().populate(populateQuery)
    let ordersForOwner = [];

    allOrders.forEach((order) => {
        if (order.rentedcar?.carOwner.toString() === id) {
            ordersForOwner.push(order);
        }
    })
    res.status(200).json(ordersForOwner);


})
module.exports.allRentedOrders = CatchAsyncError(async (req, res, next) => {
    var populateQuery = [{ path: "rentedByUser", module: "Users" }, { path: "rentedcar", module: "car" }];
    // console.log("cart ", id);
    const orders = await RentedOrders.find().populate(populateQuery)
    res.status(200).json(orders);


})
module.exports.CancelRentedOrders = CatchAsyncError(async (req, res, next) => {

    const { id } = req.params
    const order = await RentedOrders.findByIdAndDelete(id);
    const carID = order.rentedcar.toString();

    const car = await Car.findById(carID)
    car.Availability = "Available"
    await car.save()
    res.status(200).send(order);

})