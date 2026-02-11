// Configuración de cursos y proyectos
const config = {
    cursos: ['3a', '3b', '3c', '3d'],
    cursosNombres: {
        '3a': '3ro A',
        '3b': '3ro B',
        '3c': '3ro C',
        '3d': '3ro D'
    },
    proyectosPorCurso: {
        '3a': 2,
        '3b': 2,
        '3c': 2,
        '3d': 2
    },
    secciones: ['introduccion', 'objetivo', 'desarrollo', 'resultados', 'conclusion']
};

// Variables globales
const tabs = ['introduccion', 'objetivo', 'desarrollo', 'resultados', 'conclusion'];
let currentTabIndex = 0;
let proyectosData = {};

// Cargar datos de proyectos
async function cargarProyecto(curso, numeroProyecto) {
    const key = `${curso}-proyecto${numeroProyecto}`;
    
    if (proyectosData[key]) {
        return proyectosData[key];
    }
    
    try {
        const response = await fetch(`proyectos/${curso}-proyecto${numeroProyecto}.json`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar el proyecto ${key}`);
        }
        const data = await response.json();
        proyectosData[key] = data;
        return data;
    } catch (error) {
        console.error('Error cargando proyecto:', error);
        return null;
    }
}

// Renderizar contenido de un proyecto con la nueva estructura
function renderizarContenidoProyecto(data, seccion) {
    if (!data || !data[seccion]) {
        return '<p>Contenido no disponible</p>';
    }
    
    const contenido = data[seccion];
    let html = '';
    
    // Manejar diferentes estructuras de contenido
    switch(seccion) {
        case 'introduccion':
            html += renderizarIntroduccion(contenido);
            break;
        case 'objetivo':
            html += renderizarObjetivo(contenido);
            break;
        case 'desarrollo':
            html += renderizarDesarrollo(contenido);
            break;
        case 'resultados':
            html += renderizarResultados(contenido);
            break;
        case 'conclusion':
            html += renderizarConclusion(contenido);
            break;
        default:
            // Fallback para estructura antigua
            html += `<p>${contenido.texto || ''}</p>`;
            if (contenido.lista && contenido.lista.length > 0) {
                html += '<ul>';
                contenido.lista.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            }
    }
    
    return html;
}

// Renderizar sección de Introducción
function renderizarIntroduccion(contenido) {
    let html = '';
    
    // Imagen de introducción (si existe)
    if (contenido.imagen) {
        html += '<div style="text-align: center; margin-bottom: 25px;">';
        html += `<img src="${contenido.imagen}" alt="${contenido.imagen_alt || 'Imagen del proyecto'}" style="max-width: 100%; height: 500px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`;
        if (contenido.imagen_descripcion) {
            html += `<p style="margin-top: 10px; font-style: italic; color: #666; font-size: 0.9em;">${contenido.imagen_descripcion}</p>`;
        }
        html += '</div>';
    }
    
    // Párrafos principales
    if (contenido.parrafos) {
        contenido.parrafos.forEach(parrafo => {
            html += `<p>${parrafo}</p>`;
        });
    }
    
    // Características o lista
    if (contenido.caracteristicas) {
        html += '<h4>Características principales:</h4>';
        html += '<ul>';
        contenido.caracteristicas.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    } else if (contenido.lista) {
        html += '<ul>';
        contenido.lista.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul>';
    }
    
    return html;
}

// Renderizar sección de Objetivo
function renderizarObjetivo(contenido) {
    let html = '';
    
    // Introducción
    if (contenido.introduccion) {
        html += `<p>${contenido.introduccion}</p>`;
    }
    
    // Objetivos específicos
    if (contenido.objetivos) {
        contenido.objetivos.forEach(obj => {
            html += `<h4>${obj.titulo}</h4>`;
            html += `<p>${obj.descripcion}</p>`;
        });
    }
    
    // Metas de aprendizaje
    if (contenido.metas_aprendizaje) {
        html += '<div style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">';
        html += '<h3>Metas de Aprendizaje</h3>';
        if (contenido.metas_aprendizaje.introduccion) {
            html += `<p>${contenido.metas_aprendizaje.introduccion}</p>`;
        }
        if (contenido.metas_aprendizaje.competencias) {
            html += '<ul>';
            contenido.metas_aprendizaje.competencias.forEach(comp => {
                html += `<li>${comp}</li>`;
            });
            html += '</ul>';
        }
        html += '</div>';
    }
    
    return html;
}

// Renderizar sección de Desarrollo
function renderizarDesarrollo(contenido) {
    let html = '';
    
    // Introducción
    if (contenido.introduccion) {
        html += `<p>${contenido.introduccion}</p>`;
    }
    
    // Fases del desarrollo
    if (contenido.fases) {
        contenido.fases.forEach((fase, index) => {
            html += `<div style="margin-top: 20px; padding: 15px; background-color: ${index % 2 === 0 ? '#f8f9fa' : '#ffffff'}; border-left: 4px solid #d4af37; border-radius: 4px;">`;
            html += `<h4>${fase.titulo}</h4>`;
            html += `<p>${fase.descripcion}</p>`;
            html += '</div>';
        });
    }
    
    // Documentación
    if (contenido.documentacion) {
        html += `<p style="margin-top: 20px; font-style: italic; color: #555;">${contenido.documentacion}</p>`;
    }
    
    return html;
}

// Renderizar sección de Resultados
function renderizarResultados(contenido) {
    let html = '';
    
    // Introducción
    if (contenido.introduccion) {
        html += `<p><strong>${contenido.introduccion}</strong></p>`;
    }
    
    // Especificaciones finales
    if (contenido.especificaciones_finales) {
        html += '<h4>Especificaciones Finales</h4>';
        if (contenido.especificaciones_finales.descripcion) {
            html += `<p>${contenido.especificaciones_finales.descripcion}</p>`;
        }
        if (contenido.especificaciones_finales.specs) {
            html += '<ul>';
            contenido.especificaciones_finales.specs.forEach(spec => {
                html += `<li>${spec}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Pruebas de funcionalidad
    if (contenido.pruebas_funcionalidad) {
        html += '<h4>Pruebas de Funcionalidad</h4>';
        if (contenido.pruebas_funcionalidad.descripcion) {
            html += `<p>${contenido.pruebas_funcionalidad.descripcion}</p>`;
        }
        if (contenido.pruebas_funcionalidad.metricas) {
            html += '<ul>';
            contenido.pruebas_funcionalidad.metricas.forEach(metrica => {
                html += `<li>${metrica}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Análisis costo-beneficio
    if (contenido.analisis_costo_beneficio) {
        html += '<h4>Análisis Costo-Beneficio</h4>';
        if (contenido.analisis_costo_beneficio.parrafos) {
            contenido.analisis_costo_beneficio.parrafos.forEach(p => {
                html += `<p>${p}</p>`;
            });
        }
    }
    
    // Impacto educativo
    if (contenido.impacto_educativo) {
        html += '<h4>Impacto Educativo</h4>';
        if (contenido.impacto_educativo.descripcion) {
            html += `<p>${contenido.impacto_educativo.descripcion}</p>`;
        }
        if (contenido.impacto_educativo.competencias_desarrolladas) {
            html += '<ul>';
            contenido.impacto_educativo.competencias_desarrolladas.forEach(comp => {
                html += `<li>${comp}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Demostración pública
    if (contenido.demostracion_publica && contenido.demostracion_publica.parrafos) {
        html += '<h4>Demostración Pública</h4>';
        contenido.demostracion_publica.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Lecciones clave
    if (contenido.lecciones_clave) {
        html += '<h4>Lecciones Clave</h4>';
        if (contenido.lecciones_clave.descripcion) {
            html += `<p>${contenido.lecciones_clave.descripcion}</p>`;
        }
        if (contenido.lecciones_clave.lecciones) {
            html += '<ul>';
            contenido.lecciones_clave.lecciones.forEach(leccion => {
                html += `<li>${leccion}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Métricas finales
    if (contenido.metricas_finales) {
        html += '<h4>Métricas Finales</h4>';
        if (contenido.metricas_finales.descripcion) {
            html += `<p>${contenido.metricas_finales.descripcion}</p>`;
        }
        if (contenido.metricas_finales.metricas) {
            html += '<ul>';
            contenido.metricas_finales.metricas.forEach(metrica => {
                html += `<li>${metrica}</li>`;
            });
            html += '</ul>';
        }
    }
    
    return html;
}

// Renderizar sección de Conclusión
function renderizarConclusion(contenido) {
    let html = '';
    
    // Párrafos iniciales
    if (contenido.parrafos) {
        contenido.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Logros principales
    if (contenido.logros_principales) {
        html += '<h4>Logros Principales</h4>';
        html += '<ul>';
        contenido.logros_principales.forEach(logro => {
            html += `<li>${logro}</li>`;
        });
        html += '</ul>';
    }
    
    // Significado del proyecto
    if (contenido.significado_proyecto) {
        html += '<h4>Significado del Proyecto</h4>';
        if (contenido.significado_proyecto.introduccion) {
            html += `<p>${contenido.significado_proyecto.introduccion}</p>`;
        }
        if (contenido.significado_proyecto.dimensiones) {
            html += '<ul>';
            contenido.significado_proyecto.dimensiones.forEach(dim => {
                html += `<li>${dim}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Conexión con el mundo real
    if (contenido.conexion_mundo_real && contenido.conexion_mundo_real.parrafos) {
        html += '<h4>Conexión con el Mundo Real</h4>';
        contenido.conexion_mundo_real.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Desafíos superados
    if (contenido.desafios_superados) {
        html += '<h4>Desafíos Superados</h4>';
        if (contenido.desafios_superados.descripcion) {
            html += `<p>${contenido.desafios_superados.descripcion}</p>`;
        }
        if (contenido.desafios_superados.desafios) {
            html += '<ul>';
            contenido.desafios_superados.desafios.forEach(desafio => {
                html += `<li>${desafio}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Limitaciones reconocidas
    if (contenido.limitaciones_reconocidas && contenido.limitaciones_reconocidas.parrafos) {
        html += '<h4>Limitaciones Reconocidas</h4>';
        contenido.limitaciones_reconocidas.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Roadmap futuro
    if (contenido.roadmap_futuro) {
        html += '<h4>Roadmap Futuro - Versión 2.0</h4>';
        if (contenido.roadmap_futuro.introduccion) {
            html += `<p>${contenido.roadmap_futuro.introduccion}</p>`;
        }
        if (contenido.roadmap_futuro.mejoras) {
            html += '<ul>';
            contenido.roadmap_futuro.mejoras.forEach(mejora => {
                html += `<li>${mejora}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Valor educativo
    if (contenido.valor_educativo && contenido.valor_educativo.parrafos) {
        html += '<h4>Valor Educativo</h4>';
        contenido.valor_educativo.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Impacto personal
    if (contenido.impacto_personal) {
        html += '<h4>Impacto Personal</h4>';
        if (contenido.impacto_personal.descripcion) {
            html += `<p>${contenido.impacto_personal.descripcion}</p>`;
        }
        if (contenido.impacto_personal.aspectos) {
            html += '<ul>';
            contenido.impacto_personal.aspectos.forEach(aspecto => {
                html += `<li>${aspecto}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Mensaje a estudiantes
    if (contenido.mensaje_estudiantes) {
        html += '<h4>Mensaje a Futuros Estudiantes</h4>';
        if (contenido.mensaje_estudiantes.introduccion) {
            html += `<p>${contenido.mensaje_estudiantes.introduccion}</p>`;
        }
        if (contenido.mensaje_estudiantes.consejos) {
            html += '<ul>';
            contenido.mensaje_estudiantes.consejos.forEach(consejo => {
                html += `<li>${consejo}</li>`;
            });
            html += '</ul>';
        }
    }
    
    // Reflexión filosófica
    if (contenido.reflexion_filosofica && contenido.reflexion_filosofica.parrafos) {
        html += '<h4>Reflexión Filosófica</h4>';
        contenido.reflexion_filosofica.parrafos.forEach(p => {
            html += `<p>${p}</p>`;
        });
    }
    
    // Agradecimientos
    if (contenido.agradecimientos) {
        html += '<h4>Agradecimientos</h4>';
        html += '<ul>';
        contenido.agradecimientos.forEach(agradecimiento => {
            html += `<li>${agradecimiento}</li>`;
        });
        html += '</ul>';
    }
    
    // Cierre
    if (contenido.cierre && contenido.cierre.parrafos) {
        html += '<div style="margin-top: 25px; padding: 20px; background-color: #f0f8ff; border-left: 5px solid #003366; border-radius: 8px;">';
        contenido.cierre.parrafos.forEach(p => {
            html += `<p><strong>${p}</strong></p>`;
        });
        html += '</div>';
    }
    
    return html;
}

// Crear estructura de pestañas para una sección
function crearEstructuraSeccion(seccionId) {
    const seccion = document.getElementById(seccionId);
    if (!seccion) return;
    
    const nombreSeccion = seccionId.charAt(0).toUpperCase() + seccionId.slice(1);
    
    let html = `<h2>${nombreSeccion}</h2>`;
    
    // Pestañas de cursos
    html += '<div class="course-tabs">';
    config.cursos.forEach((curso, index) => {
        const activeClass = index === 0 ? 'active' : '';
        html += `<button class="course-tab-button ${activeClass}" 
                        onclick="openCourseTab(event, '${seccionId}-${curso}')">${config.cursosNombres[curso]}</button>`;
    });
    html += '</div>';
    
    // Contenido por curso
    config.cursos.forEach((curso, cursoIndex) => {
        const activeClass = cursoIndex === 0 ? 'active' : '';
        const displayStyle = cursoIndex === 0 ? '' : 'style="display: none;"';
        
        html += `<div id="${seccionId}-${curso}" class="course-content ${activeClass}" ${displayStyle}>`;
        html += `<h3>Curso ${config.cursosNombres[curso]}</h3>`;
        
        // Pestañas de proyectos
        html += '<div class="project-tabs">';
        for (let i = 1; i <= config.proyectosPorCurso[curso]; i++) {
            const projectActiveClass = i === 1 ? 'active' : '';
            html += `<button class="project-tab-button ${projectActiveClass}" 
                            onclick="openProjectTab(event, '${seccionId}-${curso}-proyecto${i}')">Proyecto ${i}</button>`;
        }
        html += '</div>';

        // Contenido por proyecto - SIN PANTALLA DE CARGANDO
        for (let i = 1; i <= config.proyectosPorCurso[curso]; i++) {
            const projectActiveClass = i === 1 ? 'active' : '';
            const displayStyle = i === 1 ? 'block' : 'none';
            
            html += `<div id="${seccionId}-${curso}-proyecto${i}" class="project-content ${projectActiveClass}" 
                         style="display: ${displayStyle};" data-curso="${curso}" data-proyecto="${i}" data-seccion="${seccionId}" data-loaded="false">`;
            html += '';  // Sin contenido inicial
            html += '</div>';
        }
        
        html += '</div>';
    });
    
    seccion.innerHTML = html;
}

// Cargar contenido de un proyecto específico
async function cargarContenidoProyecto(elemento) {
    const curso = elemento.dataset.curso;
    const numeroProyecto = elemento.dataset.proyecto;
    const seccionId = elemento.dataset.seccion;
    
    const data = await cargarProyecto(curso, numeroProyecto);
    
    if (!data) {
        elemento.innerHTML = '<p>Error al cargar el contenido del proyecto.</p>';
        return;
    }
    
    let html = `<h4>${data.nombre}</h4>`;
    html += renderizarContenidoProyecto(data, seccionId);
    
    elemento.innerHTML = html;
    elemento.dataset.loaded = 'true';
}

// Funciones de navegación
function openTab(evt, tabName, index) {
    currentTabIndex = index;

    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    const tabbuttons = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    updateArrowsState();
}

function openCourseTab(evt, courseContentId) {
    const parentTab = evt.currentTarget.closest('.tab-content');

    const courseContents = parentTab.getElementsByClassName("course-content");
    for (let i = 0; i < courseContents.length; i++) {
        courseContents[i].classList.remove("active");
        courseContents[i].style.display = "none";
    }

    const courseButtons = parentTab.getElementsByClassName("course-tab-button");
    for (let i = 0; i < courseButtons.length; i++) {
        courseButtons[i].classList.remove("active");
    }

    const cursoElement = document.getElementById(courseContentId);
    cursoElement.classList.add("active");
    cursoElement.style.display = "block";
    evt.currentTarget.classList.add("active");
}

async function openProjectTab(evt, projectContentId) {
    const parentCourse = evt.currentTarget.closest('.course-content');

    const projectContents = parentCourse.getElementsByClassName("project-content");
    for (let i = 0; i < projectContents.length; i++) {
        projectContents[i].classList.remove("active");
        projectContents[i].style.display = "none";
    }

    const projectButtons = parentCourse.getElementsByClassName("project-tab-button");
    for (let i = 0; i < projectButtons.length; i++) {
        projectButtons[i].classList.remove("active");
    }

    const projectElement = document.getElementById(projectContentId);
    projectElement.classList.add("active");
    projectElement.style.display = "block";
    evt.currentTarget.classList.add("active");
    
    // Cargar contenido automáticamente si no ha sido cargado
    if (projectElement.dataset.loaded === 'false') {
        await cargarContenidoProyecto(projectElement);
    }
}

function navigateCarousel(direction) {
    const newIndex = currentTabIndex + direction;

    if (newIndex >= 0 && newIndex < tabs.length) {
        currentTabIndex = newIndex;

        const tabName = tabs[currentTabIndex];
        const tabButton = document.getElementsByClassName("tab-button")[currentTabIndex];

        const tabcontent = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }

        const tabbuttons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].classList.remove("active");
        }

        document.getElementById(tabName).classList.add("active");
        tabButton.classList.add("active");

        updateArrowsState();

        document.querySelector('.tab-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateArrowsState() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentTabIndex === 0;
    nextBtn.disabled = currentTabIndex === tabs.length - 1;
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    // Crear estructura para todas las secciones
    config.secciones.forEach(seccion => {
        crearEstructuraSeccion(seccion);
    });
    
    // Cargar el primer proyecto visible (introducción 3a proyecto 1)
    const primerProyecto = document.getElementById('introduccion-3a-proyecto1');
    if (primerProyecto) {
        await cargarContenidoProyecto(primerProyecto);
    }
    
    updateArrowsState();
    
    // Navegación con teclado
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            navigateCarousel(-1);
        } else if (event.key === 'ArrowRight') {
            navigateCarousel(1);
        }
    });
});