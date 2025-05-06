const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Please add an invoice number'],
    unique: true
  },
  client: {
    name: {
      type: String,
      required: [true, 'Please add client name']
    },
    email: {
      type: String,
      required: [true, 'Please add client email']
    },
    address: {
      type: String,
      required: [true, 'Please add client address']
    },
    phone: {
      type: String
    }
  },
  items: [
    {
      description: {
        type: String,
        required: [true, 'Please add item description']
      },
      quantity: {
        type: Number,
        required: [true, 'Please add item quantity']
      },
      rate: {
        type: Number,
        required: [true, 'Please add item rate']
      },
      amount: {
        type: Number,
        required: [true, 'Please add item amount']
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'draft'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate invoice number before saving
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('invoice', InvoiceSchema);