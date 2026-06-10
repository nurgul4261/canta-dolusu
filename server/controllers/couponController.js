import Coupon from '../models/Coupon.js';

// @GET /api/coupons  [admin]
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Kupon bulunamadı' });

    const { valid, message } = coupon.isValid(orderAmount, req.user._id);
    if (!valid) return res.status(400).json({ message });

    const discount = coupon.type === 'percentage'
      ? Math.round(orderAmount * coupon.discount / 100)
      : coupon.discount;

    res.json({ valid: true, code: coupon.code, type: coupon.type, discount, discountAmount: discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/coupons  [admin]
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @PUT /api/coupons/:id  [admin]
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Kupon bulunamadı' });
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @DELETE /api/coupons/:id  [admin]
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Kupon bulunamadı' });
    res.json({ message: 'Kupon silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
