import mongoose from "mongoose";

const NoticiaSchema = new mongoose.Schema({
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        maxlength: 1000
    },
    esMostrable:{
        type: Boolean,
        default: true,
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaModificacion: {
        type: Date,
        default: null
    },
    descripcion:{
        type: String
    }
});

NoticiaSchema.pre("save", function(next){
    if(this.isModified()) this.fechaModificacion = new Date();
    next();
});

const Noticia = mongoose.model("Noticia", NoticiaSchema);
export default Noticia;
