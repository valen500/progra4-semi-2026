
const materias = {
    props: ['forms'],
    data() {
        return {
            materia: {
                idMateria: 0,
                codigo: "",
                nombre: "",
                uv: ''
            },
            accion: 'nuevo',
            idMateria: 0,
            dbReady: false
        }
    },

    mounted() {
        this.checkDatabase();
    },

    methods: {
        checkDatabase() {
            if (!window.db) {
                setTimeout(() => this.checkDatabase(), 100);
                return;
            }

            try {
                const result = window.db.exec({
                    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name='materias'",
                    rowMode: 'object'
                });

                if (result && result.length > 0) {
                    this.dbReady = true;
                    console.log(" Tabla materias verificada");
                }
            } catch (err) {
                setTimeout(() => this.checkDatabase(), 1000);
            }
        },

        cerrarFormularioMateria() {
            this.forms.materias.mostrar = false;
        },

        buscarMateria() {
            this.forms.busqueda_materias.mostrar = !this.forms.busqueda_materias.mostrar;
            this.$emit('buscar');
        },

        modificarMateria(materia) {
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            Object.assign(this.materia, materia);
        },

        async guardarMateria() {
            const db = window.db;

            if (!db || !this.dbReady) {
                alertify.error("Base de datos no lista");
                return;
            }

            try {
                const existe = db.exec({
                    sql: "SELECT * FROM materias WHERE codigo = ?",
                    bind: [this.materia.codigo],
                    rowMode: "object"
                });

                if (existe && existe.length > 0 && this.accion === 'nuevo') {
                    alertify.error(`El código ya existe: ${existe[0].nombre}`);
                    return;
                }

                db.exec('BEGIN');

                if (this.accion === 'nuevo') {
                    db.exec({
                        sql: `INSERT INTO materias (codigo, nombre, uv)
                              VALUES (?, ?, ?)`,
                        bind: [
                            this.materia.codigo,
                            this.materia.nombre,
                            this.materia.uv
                        ]
                    });

                    const result = db.exec({
                        sql: "SELECT last_insert_rowid() as id",
                        rowMode: "object"
                    });

                    this.idMateria = result[0].id;

                } else {
                    db.exec({
                        sql: `UPDATE materias SET 
                                codigo = ?, 
                                nombre = ?, 
                                uv = ?
                              WHERE idMateria = ?`,
                        bind: [
                            this.materia.codigo,
                            this.materia.nombre,
                            this.materia.uv,
                            this.idMateria
                        ]
                    });
                }

                db.exec('COMMIT');

                alertify.success(`Materia ${this.materia.nombre} guardada correctamente`);
                this.limpiarFormulario();

            } catch (error) {
                db.exec('ROLLBACK');
                console.error(error);
                alertify.error("Error al guardar");
            }
        },

        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idMateria = 0;
            this.materia = {
                idMateria: 0,
                codigo: "",
                nombre: "",
                uv: ''
            };
        }
    },

    template: `
    <div v-draggable style="position:absolute; top:80px; left:80px;">
        <form @submit.prevent="guardarMateria" @reset.prevent="limpiarFormulario">

            <div class="card text-bg-dark shadow">

                <div class="card-header d-flex justify-content-between">
                    <div>📘 REGISTRO DE MATERIAS</div>
                    <button type="button" class="btn-close btn-close-white" @click="cerrarFormularioMateria"></button>
                </div>

                <div class="card-body">

                    <div class="row p-1">
                        <div class="col-4">CODIGO:</div>
                        <div class="col-5">
                            <input v-model="materia.codigo" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">NOMBRE:</div>
                        <div class="col-8">
                            <input v-model="materia.nombre" required class="form-control">
                        </div>
                    </div>

                    <div class="row p-1">
                        <div class="col-4">UV:</div>
                        <div class="col-4">
                            <input v-model="materia.uv" required class="form-control">
                        </div>
                    </div>

                </div>

                <div class="card-footer text-center">
                    <button type="submit" class="btn btn-primary">GUARDAR</button>
                    <button type="reset" class="btn btn-warning">NUEVO</button>
                    <button type="button" @click="buscarMateria" class="btn btn-success">BUSCAR</button>
                </div>

            </div>

        </form>
    </div>
    `
};