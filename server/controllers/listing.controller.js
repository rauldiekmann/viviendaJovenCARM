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