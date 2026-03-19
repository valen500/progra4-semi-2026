let db = null;
let app = null;
let sqlite3 = null;


sqlite3InitModule({
    print: console.log,
    printErr: console.error,
}).then(async (sqlite3Module) => {
    
    sqlite3 = sqlite3Module;
    console.log("✅ SQLite inicializado", sqlite3);

    try {
        
        if (sqlite3.opfs) {
            db = new sqlite3.oo1.OpfsDb('/db_academica.sqlite');
            console.log("✅ Usando OPFS (persistente)");
        } else {
            throw new Error("OPFS no soportado");
        }
    } catch (e) {
        console.warn("⚠️ OPFS no disponible, usando memoria:", e);
        db = new sqlite3.oo1.DB('/db_academica.sqlite', 'c');
        console.log("✅ DB en memoria");
    }

    window.db = db;
    window.sqlite3 = sqlite3;

    console.log(" SQLite listo", db);

    try {
        db.exec('BEGIN TRANSACTION');
        
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS alumnos (
                idAlumno INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                direccion TEXT,
                telefono TEXT,
                email TEXT,
                edad INTEGER,
                carrera TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS materias (
                idMateria INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                uv INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS docentes (
                idDocente INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                email TEXT,
                telefono TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        db.exec('COMMIT');
        console.log(" Todas las tablas creadas correctamente");

    } catch (err) {
        console.error(" Error creando tablas:", err);
        db.exec('ROLLBACK');
    }

    iniciarApp();

}).catch(err => {
    console.error("❌ Error inicializando SQLite:", err);
    document.body.innerHTML = `<div style="color: red; padding: 20px;">
        Error inicializando SQLite: ${err.message}
    </div>`;
});

// FUNCIÓN VUE 
function iniciarApp() {
    const { createApp } = Vue;

    app = createApp({
        components: {
            alumnos,
            buscar_alumnos,
            materias,
            buscar_materias,
            docentes,
            buscar_docentes
        },
        data() {
            return {
                forms: {
                    alumnos: { mostrar: false },
                    busqueda_alumnos: { mostrar: false },
                    materias: { mostrar: false },
                    busqueda_materias: { mostrar: false },
                    docentes: { mostrar: false },
                    busqueda_docentes: { mostrar: false },
                    matriculas: { mostrar: false },
                    inscripciones: { mostrar: false }
                }
            };
        },
        methods: {
            buscar(ventana, metodo) {
                if (this.$refs[ventana] && this.$refs[ventana][metodo]) {
                    this.$refs[ventana][metodo]();
                }
            },
            abrirVentana(ventana) {
                this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
            },
            modificar(ventana, metodo, data) {
                if (this.$refs[ventana] && this.$refs[ventana][metodo]) {
                    this.$refs[ventana][metodo](data);
                }
            }
        }
    }).directive('draggable', vDraggable).mount("#app");

    console.log(" Vue montado correctamente");
}