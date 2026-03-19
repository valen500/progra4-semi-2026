const buscar_alumnos = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            alumnos: []
        }
    },

    methods: {

        cerrarFormularioBusquedaAlumnos() {
            this.forms.busqueda_alumnos.mostrar = false;
        },

        modificarAlumno(alumno) {
            this.$emit('modificar', alumno);
        },

        obtenerAlumnos() {

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
                        SELECT * FROM alumnos
                        WHERE codigo LIKE ?
                        OR nombre LIKE ?
                        ORDER BY idAlumno DESC
                    `,
                    bind: [filtro, filtro],
                    rowMode: "object",
                    resultRows: resultados
                });

                this.alumnos = resultados;

            } catch (error) {
                console.error(error);
                alertify.error("Error al buscar alumnos");
            }
        },

        eliminarAlumno(alumno, e) {

            e.stopPropagation();

            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            alertify.confirm(
                'Eliminar alumno',
                `¿Eliminar ${alumno.nombre}?`,
                () => {

                    try {

                        db.exec({
                            sql: `DELETE FROM alumnos WHERE idAlumno = ?`,
                            bind: [alumno.idAlumno]
                        });

                        this.obtenerAlumnos();
                        alertify.success(`Alumno eliminado`);

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
        this.obtenerAlumnos();
    },

    template: `
    <div v-draggable style="position:absolute; top:80px; left:120px;">
        <div class="card text-bg-dark mb-3 shadow">

            <div class="card-header d-flex justify-content-between">
                <div>🔍 BUSQUEDA DE ALUMNOS</div>
                <button class="btn-close btn-close-white" @click="cerrarFormularioBusquedaAlumnos"></button>
            </div>

            <div class="card-body">

                <table class="table table-striped table-hover">

                    <thead>
                        <tr>
                            <th colspan="7">
                                <input 
                                    type="search"
                                    v-model="buscar"
                                    @keyup="obtenerAlumnos"
                                    placeholder="Buscar alumno"
                                    class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>EMAIL</th>
                            <th>TELEFONO</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="alumno in alumnos" 
                            :key="alumno.idAlumno"
                            @click="modificarAlumno(alumno)">

                            <td>{{ alumno.codigo }}</td>
                            <td>{{ alumno.nombre }}</td>
                            <td>{{ alumno.direccion }}</td>
                            <td>{{ alumno.email }}</td>
                            <td>{{ alumno.telefono }}</td>

                            <td>
                                <button 
                                    class="btn btn-danger btn-sm"
                                    @click="eliminarAlumno(alumno, $event)">
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