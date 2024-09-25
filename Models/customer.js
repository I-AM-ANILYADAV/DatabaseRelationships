const mongoose = require("mongoose");
const { Schema } = mongoose;

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

customerSchema.pre("findOneAndDelete", async () => {
  console.log("PRE MIDDLEWARE");
});

customerSchema.post("findOneAndDelete", async (customer) => {
  if (customer.orders.length) {
    let res = await Order.deleteMany({ _id: { $in: customer.orders } });
    console.log(res);
  }
});

const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

const addCustomer = async () => {
  let newCust = new Customer({
    name: 'Anil Yadav',
  });

  let newOrder = new Order({
    item: "Burger",
    price: 200,
  });

  // Save the order first
  await newOrder.save();

  // Then push the saved order to the customer's orders array
  newCust.orders.push(newOrder);

  await newCust.save();
};

const newDel = async () => {
  let data = await Customer.findByIdAndDelete("66d7b96af21a693f3eacebd8");
  console.log(data);
};

addCustomer();

newDel();

// Correct code for adding orders
const addOrders = async () => {
  let result = await Order.insertMany([
    { item: "samosa", price: 12 },
    { item: "Chips", price: 10 },
    { item: "Chocolate", price: 30 },
  ]);
  console.log(result);
};

addOrders();
