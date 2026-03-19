const buscar_materias = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            materias: []
        }
    },

    methods: {

        cerrarFormularioBusquedaMateria() {
            this.forms.busqueda_materias.mostrar = false;
        },

        modificarMateria(materia) {
            this.$emit('modificar', materia);
        },

        obtenerMaterias() {

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
                        SELECT * FROM materias
                        WHERE codigo LIKE ?
                        OR nombre LIKE ?
                        ORDER BY codigo ASC
                    `,
                    bind: [filtro, filtro],
                    rowMode: "object",
                    resultRows: resultados
                });

                this.materias = resultados;

            } catch (error) {
                console.error(error);
                alertify.error("Error al buscar materias");
            }
        },

        eliminarMateria(materia, e) {

            e.stopPropagation();

            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            alertify.confirm(
                'Eliminar materia',
                `¿Eliminar ${materia.nombre}?`,
                () => {

                    try {

                        db.exec({
                            sql: `DELETE FROM materias WHERE idMateria = ?`,
                            bind: [materia.idMateria]
                        });

                        this.obtenerMaterias();
                        alertify.success(`Materia eliminada`);

                    } catch (error) {
                        console.error(error);
                        alertify.error("Error al eliminar");
                    }

                },
                () => {}
            );
        }
    },

    mounted() {
        this.obtenerMaterias();
    },

    template: `
    <div v-draggable style="position:absolute; top:120px; left:200px;">
        <div class="card text-bg-dark shadow">

            <div class="card-header d-flex justify-content-between">
                <div>📘 BUSQUEDA DE MATERIAS</div>
                <button class="btn-close btn-close-white" @click="cerrarFormularioBusquedaMateria"></button>
            </div>

            <div class="card-body">

                <table class="table table-striped table-hover">

                    <thead>
                        <tr>
                            <th colspan="4">
                                <input 
                                    type="search"
                                    v-model="buscar"
                                    @keyup="obtenerMaterias"
                                    placeholder="Buscar materia"
                                    class="form-control">
                            </th>
                        </tr>

                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>UV</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="materia in materias"
                            :key="materia.idMateria"
                            @click="modificarMateria(materia)">

                            <td>{{ materia.codigo }}</td>
                            <td>{{ materia.nombre }}</td>
                            <td>{{ materia.uv }}</td>

                            <td>
                                <button 
                                    class="btn btn-danger btn-sm"
                                    @click="eliminarMateria(materia, $event)">
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