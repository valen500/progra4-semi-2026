const docentes = {
    props: ['forms'],
    data() {
        return {
            docente: {
                idDocente: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                escalafon: ""
            },
            accion: 'nuevo',
            idDocente: 0
        }
    },

    methods: {

        buscarDocente() {
            this.forms.busqueda_docentes.mostrar = !this.forms.busqueda_docentes.mostrar;
            this.$emit('buscar');
        },

        modificarDocente(docente) {
            this.accion = 'modificar';
            this.idDocente = docente.idDocente;
            Object.assign(this.docente, docente);
        },

        async guardarDocente() {

            const db = window.db;

            if (!db) {
                alertify.error("Base de datos no lista");
                return;
            }

            try {

                // 🔍 VALIDAR DUPLICADO
                let existe = [];

                db.exec({
                    sql: "SELECT * FROM docentes WHERE codigo = ?",
                    bind: [this.docente.codigo],
                    rowMode: "object",
                    resultRows: existe
                });

                if (existe.length > 0 && this.accion === 'nuevo') {
                    alertify.error(`El código ya existe: ${existe[0].nombre}`);
                    return;
                }

                // ================= INSERT =================
                if (this.accion === 'nuevo') {

                    db.exec({
                        sql: `INSERT INTO docentes 
                            (codigo, nombre, direccion, email, telefono, escalafon)
                            VALUES (?, ?, ?, ?, ?, ?)`,
                        bind: [
                            this.docente.codigo,
                            this.docente.nombre,
                            this.docente.direccion,
                            this.docente.email,
                            this.docente.telefono,
                            this.docente.escalafon
                        ]
                    });

                } else {
                    // ================= UPDATE =================
                    db.exec({
                        sql: `UPDATE docentes SET 
                                codigo = ?, 
                                nombre = ?, 
                                direccion = ?, 
                                email = ?, 
                                telefono = ?, 
                                escalafon = ?
                              WHERE idDocente = ?`,
                        bind: [
                            this.docente.codigo,
                            this.docente.nombre,
                            this.docente.direccion,
                            this.docente.email,
                            this.docente.telefono,
                            this.docente.escalafon,
                            this.idDocente
                        ]
                    });
                }

                alertify.success(`${this.docente.nombre} guardado correctamente`);
                this.limpiarFormulario();

            } catch (error) {
                console.error(error);
                alertify.error("Error al guardar docente");
            }
        },

        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idDocente = 0;
            this.docente = {
                idDocente: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                escalafon: ""
            };
        }
    },

    template: `
    <div v-draggable style="position:absolute; top:60px; left:300px;">
        <div class="row">
            <div class="col-6">

                <form @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">

                    <div class="card text-bg-dark shadow" style="max-width: 36rem;">

                        <div class="card-header">
                             REGISTRO DE DOCENTES
                        </div>

                        <div class="card-body">

                            <div class="row p-1">
                                <div class="col-3">CODIGO:</div>
                                <div class="col-3">
                                    <input v-model="docente.codigo" required class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3">NOMBRE:</div>
                                <div class="col-6">
                                    <input v-model="docente.nombre" required class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3">DIRECCION:</div>
                                <div class="col-9">
                                    <input v-model="docente.direccion" required class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3">EMAIL:</div>
                                <div class="col-6">
                                    <input v-model="docente.email" required class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3">TELEFONO:</div>
                                <div class="col-4">
                                    <input v-model="docente.telefono" required class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3">ESCALAFON:</div>
                                <div class="col-4">
                                    <select v-model="docente.escalafon" required class="form-select">
                                        <option value="tecnico">Tecnico</option>
                                        <option value="profesor">Profesor</option>
                                        <option value="ingeniero">Licenciado/Ingeniero</option>
                                        <option value="maestria">Maestria</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div class="card-footer text-center">
                            <button type="submit" class="btn btn-primary">GUARDAR</button>
                            <button type="reset" class="btn btn-warning">NUEVO</button>
                            <button type="button" @click="buscarDocente" class="btn btn-success">BUSCAR</button>
                        </div>

                    </div>

                </form>

            </div>
        </div>
    </div>
    `
};