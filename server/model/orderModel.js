import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity:{ type: Number, default: 1 },
    }
  ],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: 'Processing'
  },
  payment: {},
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

