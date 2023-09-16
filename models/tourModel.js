const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxLength: [40, 'A tour name must be less than 40 characters'],
    minLength: [5, 'A tour name must be more than 5 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters'], // this doesn't work properly because it doesn't allow spaces
  },
  duration: {
    type: Number,
    required: [true, 'The tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'The tour must have a max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'The tour must have a difficulty'],
    trim: true,
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Diffuculty is either easy, medium, or difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 6.9,
    min: [1, 'Rating must be at least 1.0'],
    max: [10, 'Rating must be below 10.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image cover'],
  },
  image: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  slug: [String],
  secretTour: {
    type: Boolean,
    default: false,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to current document on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  },
});

// Docuement middleware: runs before .save() and .create() methods; This is a pre save hook.
tourSchema.pre('save', function (next) {
  // in document middleware, this points to document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// This is a post save hook
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// This is a query middleware
tourSchema.pre(/^find/, function (next) {
  // in query middleware, this points to query
  this.find({ secretTour: { $ne: true } });
  next();
});

// This is an aggregation middleware
tourSchema.pre('aggregate', function (next) {
  // in aggregation middleware, this points to the aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
