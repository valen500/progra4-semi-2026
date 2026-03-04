const busqueda_autor = {
    data(){
        return{
            buscar: "",
            autores: []
        }
    },

    async mounted(){
        await this.obtenerAutores();
    },

    methods:{
        async obtenerAutores(){
            try{
                let lista = await db.autor.toArray();

                if(this.buscar.trim() === ""){
                    this.autores = lista;
                } else {
                    const texto = this.buscar.toLowerCase();

                    this.autores = lista.filter(a =>
                        (a.codigo && a.codigo.toLowerCase().includes(texto)) ||
                        (a.nombre && a.nombre.toLowerCase().includes(texto)) ||
                        (a.pais && a.pais.toLowerCase().includes(texto))
                    );
                }

            } catch(error){
                console.error("Error al obtener autores:", error);
            }
        },

        async eliminarAutor(id){
            try{
                await db.autor.delete(id);
                await this.obtenerAutores();
                alertify.error("Autor eliminado");
            } catch(error){
                console.error("Error al eliminar:", error);
            }
        },

        modificarAutor(data){
            this.$emit("modificar", data);
        }
    },

    template: `
<div class="card mt-3">
    <div class="card-header">BUSQUEDA DE AUTOR</div>
    <div class="card-body">

        <input v-model="buscar" 
               @input="obtenerAutores"
               class="form-control mb-2"
               placeholder="Buscar por código, nombre o país">

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="a in autores" :key="a.idAutor">
                    <td>{{ a.codigo }}</td>
                    <td>{{ a.nombre }}</td>
                    <td>{{ a.pais }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm"
                                @click="modificarAutor(a)">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm"
                                @click="eliminarAutor(a.idAutor)">
                            Eliminar
                        </button>
                    </td>
                </tr>

                <tr v-if="autores.length === 0">
                    <td colspan="4" class="text-center">
                        No se encontraron resultados
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</div>
`
}