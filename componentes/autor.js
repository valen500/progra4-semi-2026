const autor = {
    props:['forms'],
    data(){
        return{
            autor:{
                idAutor:0,
                codigo:"",
                nombre:"",
                pais:"",
                telefono:""
            },
            accion:'nuevo',
            idAutor:0
        }
    },
    methods:{
        buscarAutor(){
            this.forms.busqueda_autor.mostrar = !this.forms.busqueda_autor.mostrar;
            this.$emit('buscar');
        },
        modificarAutor(data){
            this.accion='modificar';
            this.idAutor=data.idAutor;
            this.autor={...data};
        },
        async guardarAutor(){
            let datos={
                idAutor:this.accion=='modificar'?this.idAutor:new Date().getTime(),
                codigo:this.autor.codigo,
                nombre:this.autor.nombre,
                pais:this.autor.pais,
                telefono:this.autor.telefono
            };
            await db.autor.put(datos);
            alertify.success("Autor guardado");
            this.limpiar();
        },
        limpiar(){
            this.accion='nuevo';
            this.autor={
                idAutor:0,codigo:"",nombre:"",pais:"",telefono:""
            };
        }
    },
    template:`
    <div class="row">
        <div class="col-6">
            <div class="card text-bg-primary">
                <div class="card-header">REGISTRO DE AUTOR</div>
                <div class="card-body">
                    <input v-model="autor.codigo" class="form-control mb-2" placeholder="Código">
                    <input v-model="autor.nombre" class="form-control mb-2" placeholder="Nombre">
                    <input v-model="autor.pais" class="form-control mb-2" placeholder="País">
                    <input v-model="autor.telefono" class="form-control mb-2" placeholder="Teléfono">
                </div>
                <div class="card-footer text-center">
                    <button class="btn btn-success" @click="guardarAutor">Guardar</button>
                    <button class="btn btn-warning" @click="limpiar">Nuevo</button>
                    <button class="btn btn-info" @click="buscarAutor">Buscar</button>
                </div>
            </div>
        </div>
    </div>
    `
};