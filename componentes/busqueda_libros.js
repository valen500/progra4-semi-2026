const busqueda_libros = {
    data(){
        return{
            buscar: "",
            libros: []
        }
    },

    async mounted(){
        await this.obtenerLibros();
    },

    methods:{
        async obtenerLibros(){
            try{
                const datos = await db.libros.toArray();
                const autores = await db.autor.toArray();

                
                const mapaAutores = {};
                autores.forEach(a => {
                    mapaAutores[a.idAutor] = a.nombre;
                });

                const texto = this.buscar.trim().toLowerCase();

                this.libros = datos
                    .map(l => ({
                        ...l,
                        nombreAutor: mapaAutores[l.idAutor] || "Sin autor"
                    }))
                    .filter(l => {
                        if(texto === "") return true;

                        return (
                            (l.titulo && l.titulo.toLowerCase().includes(texto)) ||
                            (l.isbn && l.isbn.toLowerCase().includes(texto)) ||
                            (l.editorial && l.editorial.toLowerCase().includes(texto))
                        );
                    });

            } catch(error){
                console.error("Error al obtener libros:", error);
            }
        },

        async eliminarLibro(id){
            try{
                await db.libros.delete(id);
                await this.obtenerLibros();
                alertify.error("Libro eliminado");
            } catch(error){
                console.error("Error al eliminar libro:", error);
            }
        },

        modificarLibro(data){
            this.$emit("modificar", data);
        }
    },

    template: `
<div class="card mt-3">
    <div class="card-header">BUSQUEDA DE LIBROS</div>
    <div class="card-body">

        <input v-model="buscar" 
               @input="obtenerLibros"
               class="form-control mb-2"
               placeholder="Buscar por título, ISBN o editorial">

        <table class="table table-bordered table-striped">

            <thead>
                <tr>
                    <th>Título</th>
                    <th>ISBN</th>
                    <th>Editorial</th>
                    <th>Edición</th>
                    <th>Autor</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="l in libros" :key="l.idLibro">
                    <td>{{ l.titulo }}</td>
                    <td>{{ l.isbn }}</td>
                    <td>{{ l.editorial }}</td>
                    <td>{{ l.edicion }}</td>
                    <td>{{ l.nombreAutor }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm"
                                @click="modificarLibro(l)">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm"
                                @click="eliminarLibro(l.idLibro)">
                            Eliminar
                        </button>
                    </td>
                </tr>

                <tr v-if="libros.length === 0">
                    <td colspan="6" class="text-center">
                        No se encontraron resultados
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
</div>
`
}