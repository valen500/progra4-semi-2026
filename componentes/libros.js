const libros = {
    props: ['forms'],

    data(){
        return{
            libro:{
                idLibro: 0,
                idAutor: "",
                isbn: "",
                titulo: "",
                editorial: "",
                edicion: ""
            },
            accion: 'nuevo',
            idLibro: 0,
            autores: []
        }
    },

    mounted(){
        this.cargarAutores();
    },

    methods:{

        async cargarAutores(){
            try{
                this.autores = await db.autor.toArray();
            }catch(error){
                console.error("Error al cargar autores:", error);
            }
        },

        async buscarLibro(){
            await this.cargarAutores();
            this.forms.busqueda_libros.mostrar =
                !this.forms.busqueda_libros.mostrar;
            this.$emit('buscar');
        },

        modificarLibro(data){
            this.accion = 'modificar';
            this.idLibro = data.idLibro;
            this.libro = { ...data };
        },

        async guardarLibro(){

            if(!this.libro.idAutor){
                alertify.error("Debe seleccionar un autor");
                return;
            }

            const datos = {
                idLibro: this.accion === 'modificar'
                    ? this.idLibro
                    : new Date().getTime(),
                idAutor: this.libro.idAutor,
                isbn: this.libro.isbn,
                titulo: this.libro.titulo,
                editorial: this.libro.editorial,
                edicion: this.libro.edicion
            };

            await db.libros.put(datos);
            alertify.success("Libro guardado correctamente");
            this.limpiar();
        },

        limpiar(){
            this.accion = 'nuevo';
            this.idLibro = 0;
            this.libro = {
                idLibro: 0,
                idAutor: "",
                isbn: "",
                titulo: "",
                editorial: "",
                edicion: ""
            };
        }
    },

    template: `
    <div class="row">
        <div class="col-6">
            <div class="card text-bg-success">
                <div class="card-header">
                    REGISTRO DE LIBROS
                </div>

                <div class="card-body">

                    <select v-model="libro.idAutor" class="form-control mb-2">
                        <option value="">Seleccione Autor</option>
                        <option v-for="a in autores"
                                :key="a.idAutor"
                                :value="a.idAutor">
                            {{ a.nombre }}
                        </option>
                    </select>

                    <input v-model="libro.isbn"
                           class="form-control mb-2"
                           placeholder="ISBN">

                    <input v-model="libro.titulo"
                           class="form-control mb-2"
                           placeholder="Título">

                    <input v-model="libro.editorial"
                           class="form-control mb-2"
                           placeholder="Editorial">

                    <input v-model="libro.edicion"
                           class="form-control mb-2"
                           placeholder="Edición">

                </div>

                <div class="card-footer text-center">
                    <button class="btn btn-light" @click="guardarLibro">
                        Guardar
                    </button>

                    <button class="btn btn-warning" @click="limpiar">
                        Nuevo
                    </button>

                    <button class="btn btn-info" @click="buscarLibro">
                        Buscar
                    </button>
                </div>

            </div>
        </div>
    </div>
    `
};