import Product from "../models/Product.js";

// @GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured) filter.isFeatured = true;
    if (search)
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      popular: { "ratings.count": -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("category", "name slug")
      .populate("reviews.user", "name");
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/products  [admin]
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @PUT /api/products/:id  [admin]
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @DELETE /api/products/:id  [admin]
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: "Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/products/:id/reviews
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    if (alreadyReviewed)
      return res
        .status(400)
        .json({ message: "Bu ürünü zaten değerlendirdiniz" });

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment,
    });
    product.updateRating();
    await product.save();

    res.status(201).json({ message: "Değerlendirme eklendi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
