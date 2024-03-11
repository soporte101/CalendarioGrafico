import { consumirDatosEventos, consumirDatosEventosFiltrado } from "./consultaEventos.js";
 
// Obtener referencia a elementos del DOM
 const anteriorBtn = document.getElementById('anterior');
 const siguienteBtn = document.getElementById('siguiente');
 const mesAnioSpan = document.getElementById('mesAnio');
 const calendarioTable = document.getElementById('calendario');

 const seccionEventos = document.getElementById('eventos');

 const plantillaSinEvento = `
 <div class="border-b pb-4 border-gray-400 border-dashed pt-5 animate__animated animate__fadeIn">
     <p class="text-xs font-light leading-3 text-gray-500">00:00</p>
     <a href="#" tabindex="0" class="focus:outline-none cursor-pointer text-lg font-medium leading-5 text-gray-800 mt-2">No hay eventos disponibles para este día.</a>
     <p class="text-sm pt-2 leading-4 leading-none text-gray-600"></p>
 </div>`;


 // Función para obtener el nombre del mes
 function obtenerNombreMes(mes) {
     const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
     return meses[mes];
 }

 // Función para generar el calendario de un mes y año dado
 function generarCalendario(anio, mes) {
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaSemana = new Date(anio, mes, 1).getDay(); // Obtener el día de la semana del primer día del mes
    const primerDia = (primerDiaSemana === 0) ? 7 : primerDiaSemana; // Convertir el domingo (0) a 7
    const ultimaSemana = Math.ceil((diasEnMes + primerDia - 1) / 7);

    const mesFormateado = mes < 10 ? `0${mes + 1}` : mes + 1;

     let dia = 1 - primerDia + 1;

     let html = "<thead><tr><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Lu</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Ma</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Mi</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Ju</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Vi</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Sa</p></div></th><th><div class='w-full flex justify-center'><p class='text-base font-medium text-center text-gray-800 dark:text-gray-800'>Do</p></div></th></tr></thead><tbody>";
    
     for (let i = 0; i < ultimaSemana; i++) {
         html += '<tr>';
         for (let j = 0; j < 7; j++) {
             if (dia > 0 && dia <= diasEnMes) {
                 html += `<td class="pt-6 relative"><div class="cursor-pointer flex w-full justify-center"><a class="text-base text-gray-500 dark:text-gray-500 font-medium" data-fecha="${anio}-${mesFormateado}-${dia < 10 ? `0${dia}` : dia}">${dia}</a></div></td>`;
             } else {
                 html += '<td></td>';
             }
             dia++;
         }
         html += '</tr>';
     }


     html += '</tbody>'


     return html;

     

 }

 // Función para actualizar el calendario mostrado en el HTML
 function actualizarCalendario(anio, mes) {
    // Generar el calendario para el mes y año dado
    const calendario = generarCalendario(anio, mes);

    // Actualizar el texto del mes y año
    mesAnioSpan.textContent = obtenerNombreMes(mes) + ' ' + anio;

    // Llenar la tabla con los días del calendario generado
    calendarioTable.innerHTML = calendario;

    // Llamar a la función para marcar el calendario con eventos al cargar la página
    marcarCalendarioConEventos();

 }

// Obtener la fecha actual
const fechaActual = new Date();
let anioActual = fechaActual.getFullYear();
let mesActual = fechaActual.getMonth();

let mesActualFormateado = mesActual + 1  < 10 ? `0${mesActual + 1}` : mesActual + 1

// Obtener el día del mes actual
let diaActual = fechaActual.getDate();
let diaActualFormateado = diaActual < 10 ? `0${diaActual}` : diaActual

let fechaFormateada = anioActual + '-' + mesActualFormateado + '-' + diaActualFormateado;

 // Mostrar el calendario actual en la carga inicial de la página
 actualizarCalendario(anioActual, mesActual);

 // Agregar eventos a los botones para cambiar de mes
 anteriorBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if (mesActual === 0) {
        anioActual--;
        mesActual = 11;
    } else {
        mesActual--;
    }
    actualizarCalendario(anioActual, mesActual);
 });
 siguienteBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if (mesActual === 11) {
        anioActual++;
        mesActual = 0;
    } else {
        mesActual++;
    }
    actualizarCalendario(anioActual, mesActual);
 });


 // Función para procesar los datos de eventos y marcar el calendario
 async function marcarCalendarioConEventos() {
    // Obtener los datos de eventos
    const eventos = await consumirDatosEventos();

    // Crear un array de promesas para cada operación asincrónica
    const promesas = eventos.d.results.map(async (evento) => {
        // Obtener la fecha del evento
        const fechaEvento = evento.EventDate;

        const fechaEventoRecortada = fechaEvento.split('T')[0].toString();

        // Buscar la celda del calendario correspondiente a la fecha del evento
        const celdaCalendario = document.querySelectorAll(`a[data-fecha="${fechaEventoRecortada}"]`);

        if (celdaCalendario[0]) {
            // Agregar una clase especial al elemento de la celda del calendario
            celdaCalendario[0].classList.add('evento');

            // Verificar si ya hay un ID en dataset.id
            if (celdaCalendario[0].dataset.id) {
                // Si ya hay un ID, agregar una coma antes de agregar el nuevo ID
                celdaCalendario[0].dataset.id += "," + evento.ID;
            } else {
                // Si no hay ningún ID aún, simplemente agregar el nuevo ID
                celdaCalendario[0].dataset.id = evento.ID;
            }
        }

    });

    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promesas);

    // Una vez que todas las operaciones asincrónicas hayan terminado, llamar a obtenerEventoFechaActual
    seccionEventos.innerHTML = ``;
    obtenerEventoFechaActual();
}


calendarioTable.addEventListener('click',(e)=>{
    e.preventDefault();
    const eventoSeleccionado = e.target.closest('td').querySelector('div a').dataset.id;
    const arrayEventos = eventoSeleccionado?.split(',');

    const eventoSeleccionadoHtml = e.target.closest('td').querySelector('div a');

    let eventoActivo = document.querySelector('.eventActive');

    if(eventoActivo){
        eventoActivo.classList.remove('eventActive');
    }

    eventoSeleccionadoHtml.classList.add('eventActive');

    seccionEventos.innerHTML = ``;

    if(arrayEventos){
        arrayEventos.forEach(evento => {
            mostrarEvento(evento);
        });
    }
    else{
        seccionEventos.innerHTML += plantillaSinEvento;
    }

    
});

async function mostrarEvento(ID){
    const eventoConsultado = await consumirDatosEventosFiltrado(ID);
    pintarEventos(eventoConsultado.d.results)
};



async function pintarEventos(EventData){
    
    EventData.forEach(evento => {

        seccionEventos.innerHTML += `
    <div class="border-b pb-4 border-gray-400 border-dashed pt-5 animate__animated animate__fadeIn">
        <p class="text-xs font-light leading-3 text-gray-500">${formatearHora(evento.EventDate)}</p>
        <a href="${evento.Url}" tabindex="0" class="focus:outline-none cursor-pointer text-lg font-medium leading-5 text-gray-800 mt-2">${evento.Title}</a>
        <p class="text-sm pt-2 leading-4 leading-none text-gray-600">${evento.Description}</p>
    </div>`;

    })
    
}

function formatearHora(hora){
    // Crear un objeto Date a partir de la cadena
    let fecha = new Date(hora);

    // Obtener la hora, los minutos y los segundos
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();

    // Formatear la hora
    let horaFormateada = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0');


    return horaFormateada;

}

function obtenerEventoFechaActual(){
    const elementosConFecha = document.querySelectorAll('[data-fecha]');

    // Iterar sobre los elementos y comparar con la fecha variable
    elementosConFecha.forEach(function(elemento) {
        // Obtener el valor del atributo data-fecha del elemento actual
        let fechaElemento = elemento.dataset.fecha;

        // Comparar si la fecha del elemento es igual a la fecha variable

        if (fechaElemento == fechaFormateada) {
            elemento.classList.add('eventActive');
            
            if(!elemento?.dataset?.id){
                seccionEventos.innerHTML += plantillaSinEvento;
            }else{ 
                let eventoSeleccionado = elemento.dataset.id;
                let arrayEventos = eventoSeleccionado?.split(',');

                if(arrayEventos){

                    arrayEventos.forEach(evento => {
                        mostrarEvento(evento);
                    });
                }
            }
        }
    });
}