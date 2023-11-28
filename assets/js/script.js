async function obtenerDatosMonedas() {
    try{
        const endpoint = "https://mindicador.cl/api/";
        const response = await fetch(endpoint);
        return await response.json();
    } catch(error){
        console.log("Error al obtener datos de la API:", error);
    }
}

async function LlenarOpcionesMonedas() {
    const datos = await obtenerDatosMonedas();
    if (datos) {
        const selector = document.getElementById("coinSelector");
        Object.keys(datos).forEach(key => {
            if (datos[key].unidad_medida === 'Pesos') {
                const opcion = document.createElement('option');
                opcion.value = key;
                opcion.textContent = datos[key].nombre;
                selector.appendChild(opcion);
            }
        });
    }
}

function convertirMoneda(montoPesos, tipoCambio) {
    return montoPesos / tipoCambio;
}

function obtenerValorNumerico(inputId) {
    let valor = document.getElementById(inputId).value;

    // Eliminar comas y reemplazar puntos por nada (para el formato 2.000 o 2,000)
    valor = valor.replace(/,/g, '');

    // Convertir a número y verificar si es válido
    const numero = Number(valor);
    if (isNaN(numero)) {
        // No es un número válido
        mostrarError('Por favor, ingresa solo valores numéricos.');
        return null;
    } else {
        // Es un número válido
        ocultarError();
        return numero;
    }
}

function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMensaje');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}

function ocultarError() {
    const errorDiv = document.getElementById('errorMensaje');
    errorDiv.style.display = 'none';
}


function validarEntrada() {
    const campo = document.getElementById("chileanPesos");
    let valor = campo.value;

    // Limpiar el valor removiendo comas y reemplazando puntos por comas si es necesario
    valor = valor.replace(/,/g, "").replace(/\./g, "");

    // Validar si el valor es numérico
    if (!isNaN(valor) && valor.trim() !== "") {
        campo.value = valor;
        document.getElementById("errorMensaje").textContent = "";
    } else {
        document.getElementById("errorMensaje").textContent = "Por favor, ingresa solo valores numéricos.";
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const datos = await obtenerDatosMonedas();
    LlenarOpcionesMonedas(datos);

    document.getElementById('transform').addEventListener('click', () => {

        const monto = obtenerValorNumerico('chileanPesos');
        if (monto !== null) {
            // Continuar con el código si monto es un número válido
            const monedaSeleccionada = document.getElementById('coinSelector').value;
            const tipoCambio = datos[monedaSeleccionada].valor;
            const resultado = convertirMoneda(monto, tipoCambio);
            document.getElementById('resultadoConversion').textContent = `${resultado.toFixed(2)} ${datos[monedaSeleccionada].nombre}`;
        }
    });
});

//Prepara gráfica


function setupChart() {
    document.getElementById('transform').addEventListener('click', async () => {
        try {
            const coin = document.getElementById('coinSelector').value;
            //console.log("Prueba", coin);
            const endpoint = `https://mindicador.cl/api/${coin}`;
            const response = await fetch(endpoint);
            const ans = await response.json();

            const labels1 = ans.serie.map(answer => answer.fecha.substring(0,10));
            const labels = labels1.slice(0,10).reverse();

            const data1 = ans.serie.map(answer => answer.valor);
            const data = data1.slice(0,10).reverse();

            //console.log(data);

            // Aquí debes procesar los labels y valores, por ejemplo, crear un gráfico

            //Parte de la gráfica

            const datasets = [
                {
                    label: "Tipo de Cambio",
                    borderColor: "rgb(255, 99, 132)",
                    data
                }
            ];

            //console.log({ labels, data });
            //return { labels, datasets };
            renderGraphic({ labels, datasets })

        } catch (error) {
            console.log("Error al obtener datos de la API:", error);
        }

    });
}

let myChart = null;

function renderGraphic(chartData) {

    const ctx = document.getElementById("myChart").getContext("2d");
    console.log(myChart);


    if (!myChart) {
        myChart = new Chart(ctx, {
            type: "line",
            data: chartData
        });
    } else {
        myChart.data.labels = chartData.labels;
        myChart.data.datasets.forEach((dataset, i) => {
            dataset.data = chartData.datasets[i].data;
        });
        myChart.update();
    }
}




async function main() {
    const datosDolar = await setupChart();
    if (datosDolar) {
        console.log("Fechas", datosDolar.labels);
        console.log("Fechas", datosDolar.valores);
    }
}

main()