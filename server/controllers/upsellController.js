import Upsell from '../models/Upsell.js';

// @GET /api/upsell?productId=...&categoryId=...
export const getUpsells = async (req, res) => {
  try {
    const { productId, categoryId } = req.query;
    const filter = { isActive: true };

    if (productId || categoryId) {
      filter.$or = [
        { triggerProduct: null, triggerCategory: null },
        ...(productId  ? [{ triggerProduct:  productId  }] : []),
        ...(categoryId ? [{ triggerCategory: categoryId }] : [])
      ];
    }

    const upsells = await Upsell.find(filter).populate('products.product', 'name images price discountPrice slug');
    res.json(upsells);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/upsell  [admin]
export const createUpsell = async (req, res) => {
  try {
    const upsell = await Upsell.create(req.body);
    res.status(201).json(upsell);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @PUT /api/upsell/:id  [admin]
export const updateUpsell = async (req, res) => {
  try {
    const upsell = await Upsell.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!upsell) return res.status(404).json({ message: 'Upsell bulunamadı' });
    res.json(upsell);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @DELETE /api/upsell/:id  [admin]
export const deleteUpsell = async (req, res) => {
  try {
    const upsell = await Upsell.findByIdAndDelete(req.params.id);
    if (!upsell) return res.status(404).json({ message: 'Upsell bulunamadı' });
    res.json({ message: 'Upsell silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
