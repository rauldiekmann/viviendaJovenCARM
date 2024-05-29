import Listing from '../models/listing.model.js';   

export const createListing = async (req, res,next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);   
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json("Inmueble no encontrado");
    }

    if (req.user.id !== listing.userRef) {
        return res.status(401).json("Solo puedes eliminar tus inmuebles");
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json("Inmueble eliminado");
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json("Inmueble no encontrado");
    }

    if (req.user.id !== listing.userRef) {
        return res.status(401).json("Solo puedes actualizar tus inmuebles");
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
   try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json("Inmueble no encontrado");
    }
    return res.status(200).json(listing);
   } catch (error) {
    next(error);
   } 
}

export const countListings = async (req, res, next) => {
  try {
      const rentCount = await Listing.countDocuments({ type: 'rent' });
      const saleCount = await Listing.countDocuments({ type: 'sale' });
      return res.status(200).json({ rentCount, saleCount });
  } catch (error) {
      next(error);
  }
}

export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      let municipality = req.query.municipality;
  
      // Set up the municipality filter
      let municipalityFilter = {};
      if (municipality && municipality !== 'all') {
        municipalityFilter = { municipality };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const minPrice = parseInt(req.query.minprice) || 0;
      const maxPrice = parseInt(req.query.maxprice) || Number.MAX_SAFE_INTEGER;
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        furnished,
        parking,
        type,
        price: { $gte: minPrice, $lte: maxPrice },
        ...municipalityFilter // Add municipality filter to the query
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  