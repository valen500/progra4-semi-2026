const { createApp } = Vue,
    Dexie = window.Dexie,
    db = new Dexie("db_codigo_estudiante"),
    sha256 = CryptoJS.SHA256;

db.version(1).stores({
    alumnos: "idAlumno, codigo, nombre, direccion, email, telefono",
    materias: "idMateria, codigo, nombre, uv",
    docentes: "idDocente, codigo, nombre, direccion, email, telefono, escalafon",
    autor: "idAutor, codigo, nombre, pais, telefono",
    libros: "idLibro, idAutor, isbn, titulo, editorial, edicion"
});

createApp({
    components:{
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes,
        autor,
        busqueda_autor,
        libros,
        busqueda_libros
    },
    data(){
        return{
            forms:{
                alumnos:{mostrar:false},
                busqueda_alumnos:{mostrar:false},
                materias:{mostrar:false},
                busqueda_materias:{mostrar:false},
                docentes:{mostrar:false},
                busqueda_docentes:{mostrar:false},
                matriculas:{mostrar:false},
                inscripciones:{mostrar:false},
                autor:{mostrar:false},
                busqueda_autor:{mostrar:false},
                libros:{mostrar:false},
                busqueda_libros:{mostrar:false}
            }
        }
    },
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            this.forms[ventana].mostrar =
                !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    }
}).mount("#app");