const alumnos = {
    props: ['forms'],
    data() {
        return {
            alumno: {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: ""
            },
            accion: 'nuevo',
            idAlumno: 0,
            data_alumnos: []
        }
    },

    methods: {
        cerrarFormularioAlumno() {
            this.forms.alumnos.mostrar = false;
        },

        buscarAlumno() {
            this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar;
            this.$emit('buscar');
        },

        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            Object.assign(this.alumno, alumno);
        },

        async guardarAlumno() {
            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            try {
                let existe = [];

                db.exec({
                    sql: "SELECT * FROM alumnos WHERE codigo = ?",
                    bind: [this.alumno.codigo],
                    rowMode: "object",
                    resultRows: existe
                });

                if (existe.length > 0 && this.accion === 'nuevo') {
                    alertify.error(`El código ya existe: ${existe[0].nombre}`);
                    return;
                }

                if (this.accion === 'nuevo') {
                    db.exec({
                        sql: `INSERT INTO alumnos 
                              (codigo, nombre, direccion, email, telefono)
                              VALUES (?, ?, ?, ?, ?)`,
                        bind: [
                            this.alumno.codigo,
                            this.alumno.nombre,
                            this.alumno.direccion,
                            this.alumno.email,
                            this.alumno.telefono
                        ]
                    });
                } else {
                    db.exec({
                        sql: `UPDATE alumnos SET 
                                codigo = ?, 
                                nombre = ?, 
                                direccion = ?, 
                                email = ?, 
                                telefono = ?
                              WHERE idAlumno = ?`,
                        bind: [
                            this.alumno.codigo,
                            this.alumno.nombre,
                            this.alumno.direccion,
                            this.alumno.email,
                            this.alumno.telefono,
                            this.idAlumno
                        ]
                    });
                }

                alertify.success(`${this.alumno.nombre} guardado correctamente`);
                this.limpiarFormulario();

            } catch (error) {
                console.error(error);
                alertify.error("Error al guardar");
            }
        },

        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idAlumno = 0;
            this.alumno = {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: ""
            };
        }
    },

    template: `
    <div v-draggable style="position:absolute; top:50px; left:50px;">
        <form @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario">
            <div class="card text-bg-dark shadow">

                <div class="card-header d-flex justify-content-between">
                    <div>📚 REGISTRO DE ALUMNOS</div>
                    <button type="button" class="btn-close btn-close-white" @click="cerrarFormularioAlumno"></button>
                </div>

                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-4">CODIGO:</div>
                        <div class="col-5">
                            <input v-model="alumno.codigo" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">NOMBRE:</div>
                        <div class="col-8">
                            <input v-model="alumno.nombre" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">DIRECCION:</div>
                        <div class="col-8">
                            <input v-model="alumno.direccion" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">EMAIL:</div>
                        <div class="col-8">
                            <input v-model="alumno.email" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">TELEFONO:</div>
                        <div class="col-6">
                            <input v-model="alumno.telefono" required class="form-control">
                        </div>
                    </div>
                </div>

                <div class="card-footer text-center">
                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                    <button type="reset" class="btn btn-warning">NUEVO</button>
                    <button type="button" @click="buscarAlumno" class="btn btn-success">BUSCAR</button>
                </div>

            </div>
        </form>
    </div>
    `
};
