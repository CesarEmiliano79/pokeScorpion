export class ErrorApp extends Error{
    constructor(mensaje, status=400, detalles=null){
        super(mensaje);
        this.mensaje = mensaje;
        this.status = status;
    }
}
/*
    CLASE PARA PERSONALIZAR MIS ERRORES, MAS QUE NADA PARA TIRAR ERRORES HTTP
 */