const CatchAsyncError = require('../middleware/CatchAsyncError');
const Car = require('../module/car');
const User = require('../module/user');
const ErrorHandler = require('../utils/errorHandelr');

const cloudinary = require("cloudinary").v2;

exports.createcarReview = CatchAsyncError(async (req, res, next) => {
    const { rating, comment, carID, userID } = req.body;

    const user = await User.findById(userID)

    const review = {
        user: user._id,
        name: user.name,
        rating: Number(rating),
        comment,
    };

    const car = await car.findById(carID);

    //check for already review by user to update else create new
    const isReviewed = car.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        car.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment), (rev.name = user.name);
        });
    } else {
        car.reviews.push(review);
        car.numOfReviews = car.reviews.length;
    }

    let sum = 0;

    car.reviews.forEach((rev) => {
        sum += rev.rating;
    });

    car.Rating = sum / car.reviews.length;

    await car.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });

});


module.exports.GetSinglecar = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const getcar = await Car.findById(id);
    res.status(200).send(getcar);

})
module.exports.Addcar = CatchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 800,
        crop: "scale",
    });


    const { userId, vehicleModel, vehicleNumber, rentPerDay, seatingCapacity } = req.body;
    const car = await Car.create({
        carOwner: userId,
        vehicleNumber,
        vehicleModel,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        seatingCapacity,
        rentPerDay,

    });

    res.status(201).json({
        car
    });

})

module.exports.GetAllcars = CatchAsyncError(async (req, res, next) => {
    const list = await Car.find()
    return res.send(list);

})

module.exports.Getownercars = CatchAsyncError(async (req, res, next) => {
    const id = req.user.id
    const list = await Car.find({ carOwner: id })
    return res.send(list);

})

module.exports.Deletecar = CatchAsyncError(async (req, res, next) => {

    const { id } = req.params
    // console.log(id)
    // console.log(req.params)
    const users = await Car.findByIdAndDelete(id);
    res.status(200).send(users);

})


//route for admin
module.exports.updatecar = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    // console.log(req.body)
    const { vehicleModel, vehicleNumber, seatingCapacity, rentPerDay } = req.body

    const car1 = await Car.findById(id)

    if (car1) {

        const updatedCar = await Car.findByIdAndUpdate(id, {
            $set: {
                vehicleModel,
                vehicleNumber,
                seatingCapacity,
                rentPerDay
            }
        }, {
            new: true
        })
        res.status(200).json(updatedCar);


    } else {
        return next(new ErrorHandler("unauthorized", 400))

    }


})

module.exports.updatecarAvailability = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { Availability } = req.body

    const car1 = await car.findById(id)

    if (car1) {
        const UpdateAvailability = await Car.findByIdAndUpdate(id, {
            $set: { Availability }
        }, {
            new: true
        })
        res.status(200).json(UpdateAvailability);

    } else {
        return next(new ErrorHandler("unauthorized", 400))

    }


})