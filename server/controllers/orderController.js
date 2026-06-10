import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, upsellItems } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'Sipariş ürünleri boş olamaz' });

    // Fiyatları DB'den doğrula
    let itemsPrice = 0;
    const verifiedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Ürün bulunamadı: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `${product.name} için yeterli stok yok` });

      const price = product.discountPrice || product.price;
      itemsPrice += price * item.quantity;
      verifiedItems.push({ product: product._id, name: product.name, image: product.images[0], price, quantity: item.quantity, selectedColor: item.selectedColor });
    }

    // Upsell fiyatları
    let upsellPrice = 0;
    const verifiedUpsell = [];
    if (upsellItems?.length) {
      for (const item of upsellItems) {
        const product = await Product.findById(item.product);
        if (product) {
          const price = item.specialPrice || product.discountPrice || product.price;
          upsellPrice += price * item.quantity;
          verifiedUpsell.push({ product: product._id, name: product.name, price, quantity: item.quantity });
        }
      }
    }

    // Kupon kontrolü
    let discountAmount = 0;
    let couponData = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const { valid, message } = coupon.isValid(itemsPrice, req.user._id);
        if (!valid) return res.status(400).json({ message });
        discountAmount = coupon.type === 'percentage'
          ? Math.round(itemsPrice * coupon.discount / 100)
          : coupon.discount;
        couponData = { code: coupon.code, discount: discountAmount };
        coupon.usedCount += 1;
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    const shippingPrice = itemsPrice >= 500 ? 0 : 49.90;
    const totalPrice = itemsPrice + upsellPrice + shippingPrice - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      upsellItems: verifiedUpsell,
      shippingAddress,
      paymentMethod,
      coupon: couponData,
      itemsPrice,
      shippingPrice,
      discountAmount,
      totalPrice
    });

    // Stok düş
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders  [admin]
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total  = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ orders, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/orders/:id/status  [admin]
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
    if (status === 'processing') { order.isPaid = true; order.paidAt = Date.now(); }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
