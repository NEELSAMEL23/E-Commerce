// 🔐 1. Authentication
// Base URL: http://localhost:8000/api/auth
// ➤ Register User
// POST /register
// Body (JSON):
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "123456"
// }


// ➤ Login User
// POST /login
// Body (JSON):
// {
//   "email": "john@example.com",
//   "password": "123456"
// }


// ➤ Update User
// GET /me
// Headers:
// Authorization: Bearer <your_token_here>
// ➤ Update User
// PUT /profile
// Body (JSON):
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "123456"
// }


// 🛍️ 2. Category
// 1. Create Category
// Method: POST
// URL: /api/categories
// Body Type: json
// {
//   "name": "Electronics",
//   "description": "All electronic items"
// }


// 2. Get All Categories
// Method: GET
// URL: /api/categories

// 3. Get Category by ID
// Method: GET
// URL: /api/categories/:id
// Example:
// /api/categories/64f3a76e5b1234567890abcd

// 4. Update Category
// Method: PUT
// URL: /api/categories/:id
// Body Type: form-data
// | Key         | Value                | Type |
// | ----------- | -------------------- | ---- |
// | name        | Electronics          | Text |
// | description | All electronic items | Text |
// | image       | (Upload file)        | File |


// 5. Delete Category
// Method: DELETE
// URL: /api/categories/:id
// Example:
// /api/categories/64f3a76e5b1234567890abcd



// 🛍️ 3. Products
// Base URL: http://localhost:8000/api/products


// ➤ Create Product (Admin)
// POST /

// Body → form-data:
// | Key         | Value                    | Type                                                  |
// | ----------- | ------------------------ | ----------------------------------------------------- |
// | name        | Test Product             | Text                                                  |
// | price       | 1999                     | Text/Number                                           |
// | description | A nice test product      | Text                                                  |
// | category    | 64d9b348bcd8cf3fba230d15 | Text (MongoDB ObjectId from your category collection) |
// | image       | (choose a file)          | File                                                  |


// ➤ Get All Products
// GET /
// ➤ Get Product by ID
// GET /:id


// ➤ Update Product
// PUT /:id

// ➤ Delete Product
// DELETE /:id



// 🛒 4. Cart
// Base URL: http://localhost:8000/api/cart

// ➤ Add Item to Cart
// POST /add
//Body (JSON):
// {
//   "productId": "<product_id>",
//   "quantity": 2
// }


// ➤ Get My Cart
// GET /


// ➤ Remove Item from Cart
// DELETE /remove/:productId





// 💸 5. Payment
// 🔹 1. Create Razorpay Payment Order
// Method: POST
// URL: http://localhost:5000/api/payment/razorpay-order
// Headers:

// Content-Type: application/json
// Authorization: Bearer <your_jwt_token>
// Body (JSON):

// {
//   "amount": 1500
// }
// ✅ This will return a Razorpay order object (with id, amount, etc.) that you can pass to your frontend (to integrate with Razorpay checkout).


// 🔹 2. Verify Razorpay Payment
// Method: POST
// URL: http://localhost:5000/api/payment/verify-payment
// Headers:

// Content-Type: application/json
// Authorization: Bearer <your_jwt_token>
// Body (JSON):

// {
//   "razorpay_order_id": "order_N8VzZ0DvmT1vCq",
//   "razorpay_payment_id": "pay_N8Vzvc5XNhLv9A",
//   "razorpay_signature": "a3bdf2e1d4b939f24c1a01b8d5c7fe4e93f3d8ea2d30450aa0be6f9a76d29e9d",
//   "orderId": "64fdcd71a5b3e14cc4eb3421"
// }
// Replace these values with the actual data returned from Razorpay after a successful payment.

// orderId refers to the MongoDB _id of the Order document in your backend.







// 📦 6. Orders
// 🔹 1. Create Order
// Method: POST
// URL: http://localhost:8000/api/payment
// Headers:


// Authorization: Bearer <your_jwt_token>
// Content-Type: application/json
// Body (JSON):
// {
//   "products": [
//     {
//       "productId": "64ecdf3b1a0e33a45d6749c1",
//       "quantity": 2
//     },
//     {
//       "productId": "64ecdf3b1a0e33a45d6749c2",
//       "quantity": 1
//     }
//   ],
//   "amount": 1500,
//   "address": "123 MG Road, Bangalore, India",
//   "paymentId": "pi_1ABCDxyz123",
//   "paymentStatus": "paid"
// }

// ✅ If paymentStatus is "paid", the order status will automatically be "processing" and email will be sent.
// ❗️Replace the productId with real IDs from your database.

// 🔹 2. Get All Orders (User)
// Method: GET
// URL: http://localhost:5000/api/orders
// Headers:

// makefile
// Copy
// Edit
// Authorization: Bearer <your_jwt_token>
// ✅ This will return all orders placed by the currently authenticated user. Redis cache is used for faster responses.


// 🔹 3. Update Order Status (Admin Only)
// Method: PUT
// URL: http://localhost:5000/api/orders/<order_id>
// Example:

// http://localhost:5000/api/orders/64fdcd71a5b3e14cc4eb3421
// Headers:

// Authorization: Bearer <admin_jwt_token>
// Content-Type: application/json
// Body (JSON):


// {
//   "status": "shipped"
// }

// ✅ This will update the status (pending, processing, shipped, delivered, etc.)
// ✅ Sends an email to the user upon status update.
// ❗️Only accessible to admins – ensure RBAC is handled in your middleware.