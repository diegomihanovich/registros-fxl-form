<script>
    let fixedOrderData = {}; 
    let operariosDisponibles = []; 

    document.addEventListener('DOMContentLoaded', function() {
      const cantPersonasSelect = document.getElementById('cantPersonas');
      const operariosContainer = document.getElementById('operariosContainer');
      const produccionForm = document.getElementById('produccionForm');
      const btnGuardar = document.getElementById('btnGuardar');
      
      const successMessageEl = document.getElementById('successMessage');
      const errorMessageEl = document.getElementById('errorMessage');

      function showTemporaryMessage(element, message, autoHide = true, isError = false) {
        element.textContent = message;
        element.style.display = 'block';
        if (isError) { 
            successMessageEl.style.display = 'none';
        } else { 
            errorMessageEl.style.display = 'none';
        }
        if (autoHide) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 4000);
        }
      }
      
      function handleGenericError(error, context) {
        console.error(`Error en ${context}:`, error);
        showTemporaryMessage(errorMessageEl, `Error en ${context}: ` + (error.message || error), true, true);
      }
      
      function updateFixedDataUI(data) {
        if (data.error) {
          handleGenericError({message: data.error}, 'Datos del Pedido');
          document.getElementById('val-colorFicha').textContent = 'Error';
          document.getElementById('val-diseno').textContent = 'Error';
          document.getElementById('val-numeroPedido').textContent = 'Error';
          document.getElementById('val-cliente').textContent = 'Error';
          document.getElementById('val-articulo').textContent = 'Error';
          document.getElementById('val-vendedor').textContent = 'Error';
          document.getElementById('val-partida').textContent = 'Error';
          document.getElementById('val-puntadasPC').textContent = 'Error';
          document.getElementById('val-conMovimiento').textContent = 'Error';
          document.getElementById('val-mesa').textContent = 'Error';
          document.getElementById('val-grm2').textContent = 'Error';
          document.getElementById('val-archivoMaquina').textContent = 'Error';
          document.getElementById('val-ancho').textContent = 'Error';
          fixedOrderData = {}; 
          return;
        }
        fixedOrderData = data; 
        document.getElementById('val-colorFicha').textContent = data.colorFicha || 'N/A';
        document.getElementById('val-diseno').textContent = data.diseno || 'N/A';
        document.getElementById('val-numeroPedido').textContent = data.numeroPedido || 'N/A';
        document.getElementById('val-cliente').textContent = data.cliente || 'N/A';
        document.getElementById('val-articulo').textContent = data.articulo || 'N/A';
        document.getElementById('val-vendedor').textContent = data.vendedor || 'N/A';
        document.getElementById('val-partida').textContent = data.partida || 'N/A';
        document.getElementById('val-puntadasPC').textContent = data.puntadasPC ? (data.puntadasPC + ' / 10cm') : 'N/A';
        document.getElementById('val-conMovimiento').textContent = data.conMovimiento || 'N/A';
        document.getElementById('val-mesa').textContent = data.mesa ? (data.mesa + ' mm') : 'N/A';
        document.getElementById('val-grm2').textContent = data.grm2 ? (data.grm2 + ' gr/m²') : 'N/A';
        document.getElementById('val-archivoMaquina').textContent = data.archivoMaquina || 'N/A';
        document.getElementById('val-ancho').textContent = data.ancho ? (String(data.ancho).replace('.',',') + ' m') : 'N/A';
      }

      function populateDropdownsUI(data) {
        if (data.error) {
          handleGenericError({message: data.error}, 'Opciones Desplegables');
          operariosDisponibles = ['(Error Operarios)'];
        } else {
          operariosDisponibles = data.operarios && data.operarios.length > 0 ? data.operarios : ['(Sin Operarios)'];
        }
        
        const personasDefault = ['1','2','3','4'];
        const personasOptions = (data.personas && data.personas.length > 0) ? data.personas : personasDefault;

        cantPersonasSelect.innerHTML = ''; 
        personasOptions.forEach(p => {
            const option = document.createElement('option');
            option.value = String(p); 
            option.textContent = String(p);
            cantPersonasSelect.appendChild(option);
        });
        if (cantPersonasSelect.options.length > 0) {
            cantPersonasSelect.value = cantPersonasSelect.options[0].value;
        }
        generarCamposOperario(); 
      }
      
      cantPersonasSelect.addEventListener('change', generarCamposOperario);
      
      function generarCamposOperario() {
        operariosContainer.innerHTML = '';
        const cantidad = parseInt(cantPersonasSelect.value) || 1;
        for (let i = 1; i <= cantidad; i++) {
          const fg = document.createElement('div');
          fg.classList.add('form-group');
          const lbl = document.createElement('label');
          lbl.setAttribute('for', `operario${i}`);
          lbl.textContent = cantidad === 1 ? 'Operario:' : `Operario ${i}:`;
          const sel = document.createElement('select');
          sel.id = `operario${i}`;
          sel.name = `operario${i}`; 
          sel.required = true;
          operariosDisponibles.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o;
            opt.textContent = o;
            sel.appendChild(opt);
          });
          fg.appendChild(lbl);
          fg.appendChild(sel);
          operariosContainer.appendChild(fg);
        }
      }

      produccionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        btnGuardar.disabled = true;
        showTemporaryMessage(successMessageEl, 'Guardando...', false, false);
        errorMessageEl.style.display = 'none';

        const fd = new FormData(produccionForm);
        const dataToSave = {
            colorFicha_fijo: fixedOrderData.colorFicha,
            diseno_fijo: fixedOrderData.diseno,
            numeroPedido_fijo: fixedOrderData.numeroPedido,
            cliente_fijo: fixedOrderData.cliente,
            articulo_fijo: fixedOrderData.articulo,
            vendedor_fijo: fixedOrderData.vendedor,
            partida_fijo: fixedOrderData.partida,
            puntadasPC_fijo: fixedOrderData.puntadasPC,
            conMovimiento_fijo: fixedOrderData.conMovimiento,
            mesa_fijo: fixedOrderData.mesa,
            grm2_fijo: fixedOrderData.grm2,
            archivoMaquina_fijo: fixedOrderData.archivoMaquina,
            ancho_fijo: fixedOrderData.ancho,
            fecha: fd.get('fecha'),
            horarioEntrada: fd.get('horarioEntrada'),
            horarioSalida: fd.get('horarioSalida'),
            nroRollo: fd.get('nroRollo'),
            mtsIniciales: fd.get('mtsIniciales'),
            mtsFinales: fd.get('mtsFinales'),
            pasadasReales: fd.get('pasadasReales'),
            observaciones: fd.get('observaciones'),
            cantPersonas: fd.get('cantPersonas')
        };

        let ops = [];
        for (let i = 1; i <= parseInt(dataToSave.cantPersonas); i++) {
          ops.push(fd.get(`operario${i}`));
        }
        dataToSave.operariosLista = ops.join(', ');

        const mi = parseFloat(dataToSave.mtsIniciales);
        const mf = parseFloat(dataToSave.mtsFinales);

        if (isNaN(mi) || isNaN(mf) || mf < mi) {
          showTemporaryMessage(errorMessageEl, "Error: Revisa los metros iniciales/finales.", true, true);
          btnGuardar.disabled = false;
          successMessageEl.style.display = 'none';
          return;
        }
        
        google.script.run
            .withSuccessHandler(handleSaveSuccess)
            .withFailureHandler(err => handleSaveFailure(err, dataToSave))
            .saveEntry(dataToSave);
      });

      function handleSaveSuccess(response) {
          btnGuardar.disabled = false;
          if (response && response.status === 'OK') {
              showTemporaryMessage(successMessageEl, response.message || 'Guardado correctamente.', true, false);
              produccionForm.reset();
              document.getElementById('fecha').valueAsDate = new Date(); 
              if(cantPersonasSelect.options.length > 0) cantPersonasSelect.value = cantPersonasSelect.options[0].value;
              generarCamposOperario(); 
              loadSavedRecords(); 
              document.getElementById('fecha').focus();
          } else {
              showTemporaryMessage(errorMessageEl, (response && response.message) || 'Error desconocido al guardar.', true, true);
          }
      }

      function handleSaveFailure(error, dataSent) {
          btnGuardar.disabled = false;
          console.error('Error al guardar:', error, 'Datos enviados:', dataSent);
          showTemporaryMessage(errorMessageEl, 'Error al guardar: ' + (error.message || error) , true, true);
      }
      
      function loadSavedRecords() {
        const noRecordsMessage = document.getElementById('noRecordsMessage');
        const savedRecordsTable = document.getElementById('savedRecordsTable');
        const registrosTableBody = document.getElementById('registrosTableBody');
        
        showTemporaryMessage(noRecordsMessage, 'Cargando registros...', false, false); 
        noRecordsMessage.style.display = 'block'; 
        savedRecordsTable.style.display = 'none';
        registrosTableBody.innerHTML = ''; 

        google.script.run
            .withSuccessHandler(displaySavedRecords)
            .withFailureHandler(error => handleGenericError(error, 'Carga de Registros'))
            .getFXLRecords();
      }

      function displaySavedRecords(data) {
        const registrosTableBody = document.getElementById('registrosTableBody');
        const savedRecordsTable = document.getElementById('savedRecordsTable');
        const noRecordsMessage = document.getElementById('noRecordsMessage');
        registrosTableBody.innerHTML = '';

        if (data.error) {
            handleGenericError({message: data.error}, 'Visualización de Registros');
            noRecordsMessage.textContent = 'Error al obtener registros: ' + data.error;
            noRecordsMessage.style.display = 'block';
            savedRecordsTable.style.display = 'none';
            return;
        }

        if (data.rows && data.rows.length > 0) {
            data.rows.forEach(record => { 
                const row = registrosTableBody.insertRow(); 
                row.insertCell().textContent = record.fecha; 
                row.insertCell().textContent = record.rolloNro;
                row.insertCell().textContent = record.horarioEntrada;
                row.insertCell().textContent = record.horarioSalida;
                row.insertCell().textContent = record.operariosLista;
                row.insertCell().textContent = record.mtsTejidos;
                row.insertCell().textContent = record.pasadasReales;
                const obs = record.observaciones || '';
                row.insertCell().textContent = obs.length > 25 ? obs.substring(0, 25) + "…" : obs;
            });
            savedRecordsTable.style.display = 'table';
            noRecordsMessage.style.display = 'none';
        } else {
            noRecordsMessage.textContent = 'Aún no hay registros guardados hoy.';
            noRecordsMessage.style.display = 'block';
            savedRecordsTable.style.display = 'none';
        }
      }
      
      google.script.run.withSuccessHandler(updateFixedDataUI).withFailureHandler(err => handleGenericError(err, 'Datos del Pedido')).getFXLOptionsData();
      google.script.run.withSuccessHandler(populateDropdownsUI).withFailureHandler(err => handleGenericError(err, 'Opciones Desplegables')).getDropdownOptions();
      loadSavedRecords();
      document.getElementById('fecha').valueAsDate = new Date(); 

    });
  </script>
