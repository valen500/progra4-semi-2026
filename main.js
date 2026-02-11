const { createApp } = Vue,
    Dexie = window.Dexie,
    db = new Dexie("db_academica");

createApp({
    data() {
        return {
            alumno: {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fecha_nacimiento: "",
                sexo: "",
                email: ""
            },
            accion: 'nuevo',
            idAlumno: 0,
            buscar: '',
            alumnos: []
        }
    },
    methods: {
        async obtenerAlumnos() {
            this.alumnos = await db.alumnos
                .filter(alumno => 
                    alumno.nombre.toLowerCase().includes(this.buscar.toLowerCase()) ||
                    alumno.codigo.toLowerCase().includes(this.buscar.toLowerCase())
                )
                .toArray();
        },
        async eliminarAlumno(idAlumno, e) {
            e.stopPropagation();
            if (confirm("¿Está seguro de eliminar el alumno?")) {
                await db.alumnos.delete(idAlumno);
                this.obtenerAlumnos();
            }
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno = { ...alumno };
        },
        async guardarAlumno() {
            let datos = {
                idAlumno: this.accion == 'modificar' ? this.idAlumno : this.getId(),
                codigo: this.alumno.codigo,
                nombre: this.alumno.nombre,
                direccion: this.alumno.direccion,
                municipio: this.alumno.municipio,
                departamento: this.alumno.departamento,
                telefono: this.alumno.telefono,
                fecha_nacimiento: this.alumno.fecha_nacimiento,
                sexo: this.alumno.sexo,
                email: this.alumno.email
            };

            // Verificar código duplicado
            let codigoDuplicado = await this.buscarAlumno(datos.codigo);
            if (codigoDuplicado && this.accion == 'nuevo') {
                alert("El código del alumno ya existe");
                return;
            }

            await db.alumnos.put(datos);
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        getId() {
            return new Date().getTime();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idAlumno = 0;
            this.alumno = {
                idAlumno: 0,
                codigo: "",
                nombre: "",
                direccion: "",
                municipio: "",
                departamento: "",
                telefono: "",
                fecha_nacimiento: "",
                sexo: "",
                email: ""
            };
        },
        async buscarAlumno(codigo = '') {
            let resultado = await db.alumnos
                .where('codigo')
                .equalsIgnoreCase(codigo)
                .first();
            return resultado || null;
        }
    },
    mounted() {
        db.version(1).stores({
            "alumnos": "idAlumno, codigo, nombre, direccion, municipio, departamento, telefono, fecha_nacimiento, sexo, email"
        });
        this.obtenerAlumnos();
    }
}).mount("#app");