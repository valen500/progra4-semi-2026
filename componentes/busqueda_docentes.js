const buscar_docentes = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            docentes: []
        }
    },

    methods: {

        cerrarFormularioBusquedaDocentes() {
            this.forms.busqueda_docentes.mostrar = false;
        },

        modificarDocente(docente) {
            this.$emit('modificar', docente);
        },

        //  BUSCAR CON SQLITE
        obtenerDocentes() {

            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            try {

                let resultados = [];
                let filtro = `%${this.buscar}%`;

                db.exec({
                    sql: `
                        SELECT * FROM docentes
                        WHERE codigo LIKE ?
                        OR nombre LIKE ?
                        ORDER BY idDocente DESC
                    `,
                    bind: [filtro, filtro],
                    rowMode: "object",
                    resultRows: resultados
                });

                this.docentes = resultados;

            } catch (error) {
                console.error(error);
                alertify.error("Error al buscar docentes");
            }
        },

        // ELIMINAR
        eliminarDocente(docente, e) {

            e.stopPropagation();

            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            alertify.confirm(
                'Eliminar docente',
                `¿Está seguro de eliminar el docente ${docente.nombre}?`,
                () => {

                    try {

                        db.exec({
                            sql: `DELETE FROM docentes WHERE idDocente = ?`,
                            bind: [docente.idDocente]
                        });

                        alertify.success(`Docente ${docente.nombre} eliminado`);
                        this.obtenerDocentes();

                    } catch (error) {
                        console.error(error);
                        alertify.error("Error al eliminar docente");
                    }

                },
                () => {}
            );
        }
    },

    mounted() {
        this.obtenerDocentes(); // carga inicial
    },

    template: `
    <div v-draggable style="position:absolute; top:100px; left:150px;">
        <div class="card text-bg-dark shadow">

            <div class="card-header d-flex justify-content-between">
                <div>👨‍🏫 BUSQUEDA DE DOCENTES</div>
                <button class="btn-close btn-close-white" @click="cerrarFormularioBusquedaDocentes"></button>
            </div>

            <div class="card-body">

                <table class="table table-striped table-hover">

                    <thead>
                        <tr>
                            <th colspan="7">
                                <input 
                                    type="search"
                                    v-model="buscar"
                                    @keyup="obtenerDocentes"
                                    placeholder="Buscar docente"
                                    class="form-control">
                            </th>
                        </tr>

                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>EMAIL</th>
                            <th>TELEFONO</th>
                            <th>ESCALAFON</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="docente in docentes"
                            :key="docente.idDocente"
                            @click="modificarDocente(docente)">

                            <td>{{ docente.codigo }}</td>
                            <td>{{ docente.nombre }}</td>
                            <td>{{ docente.direccion }}</td>
                            <td>{{ docente.email }}</td>
                            <td>{{ docente.telefono }}</td>
                            <td>{{ docente.escalafon }}</td>

                            <td>
                                <button 
                                    class="btn btn-danger btn-sm"
                                    @click="eliminarDocente(docente, $event)">
                                    DEL
                                </button>
                            </td>

                        </tr>
                    </tbody>

                </table>

            </div>
        </div>
    </div>
    `
};