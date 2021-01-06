<template>
	<v-main class="pa-0">
		<v-row justify="center" no-gutters>
			<v-col cols="12">
				
				<v-snackbar top v-model="snackbar" :timeout="3000"  :color="color"> {{text}}
					<v-btn color="white" text @click="snackbar = false" > Cerrar </v-btn>
				</v-snackbar>

				<v-card-actions class="pa-0" >
					<h3> <strong> {{ modoVista === 2  ? 'EDITAR PERMISO':'NUEVO PERMISO' }}  </strong></h3> 
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="$emit('modal',false)" text><v-icon>clear</v-icon></v-btn>
				</v-card-actions>

				<v-divider class="pb-2 my-2"></v-divider>
				<v-row justify="center" class="pa-3">
          <!-- NUMERO DE EMPLEADO -->
          <v-col cols="4" class="pa-1">
            <v-text-field 
              v-model="id_usuario" label="N° Empleado" type="number" @keyup.enter="buscarEmpleado" 
              append-icon="search" autofocus hide-details dense outlined/>
          </v-col>
          <!-- NOMBRE DEL EMPLEADO -->
          <v-col cols="8" class="pa-1">
            <v-text-field 
              v-model="usuario.nombre" label="Nombre" hide-details dense outlined disabled/>
          </v-col>
          <!--  PUESTO DEL EMPLEADO -->
          <v-col cols="6" class="pa-1">
            <v-text-field 
              v-model="usuario.puesto" label="Puesto" hide-details dense outlined disabled/>
          </v-col>
          <!-- DEPARTAMENTO DEL EMPLEADO -->
          <v-col cols="6" class="pa-1">
            <v-text-field 
              v-model="usuario.departamento" label="Departamento" hide-details dense outlined disabled/>
          </v-col>
          <!-- TITULO -->
          <v-col cols="12" class="pa-0"><v-card-title >Autorización de Ausencias</v-card-title> 
            <v-divider class="celeste"></v-divider>
          </v-col>
          <!--  CONTENEDOR DE TABS -->
          <v-col cols="12" class="pa-0">
            <v-tabs v-model="tab"  centered color="celeste" >
              <v-tabs-slider></v-tabs-slider>
              <v-tab v-if="modoVista === 1" href="#1" @click="tab=1"> Con Goce          </v-tab>
              <v-tab v-if="modoVista === 1" href="#2" @click="tab=2" > Sin Goce          </v-tab>
              <v-tab v-if="modoVista === 1" href="#3" @click="tab=3"> Entrada / Salida   </v-tab>
              <v-tab v-if="modoVista === 1" href="#4" @click="tab=4"> Salir y regresar  </v-tab>
              <v-tab v-if="modoVista === 1" href="#5" @click="tab=5"> LLegar Tarde      </v-tab>
              <v-tab v-if="modoVista === 1" href="#6" @click="tab=6"> Salir Temprano    </v-tab>
              <v-tab v-if="modoVista === 2" :href="`#${permiso}`"> {{ tipos[permiso-1].nombre }}    </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab" >
              <v-row >
                <v-col cols="12" sm="6" v-if="tab != '4'" >
                  <v-dialog ref="fecha1" v-model="fechamodal1" :return-value.sync="fecha1" persistent width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="fecha1" :label="nomfecha1" append-icon="event" readonly v-on="on"
                          outlined dense hide-details color="celeste"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="fecha1" locale="es-es" color="rosa"  scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text small color="gris" @click="fechamodal1 = false">Cancelar</v-btn>
                      <v-btn dark small color="rosa" @click="$refs.fecha1.save(fecha1)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" sm="6" v-if="tab === '1' || tab ==='2'"> 
                  <v-dialog ref="fecha2" v-model="fechamodal2" :return-value.sync="fecha2" persistent width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="fecha2" :label="nomfecha2" append-icon="event" readonly v-on="on"
                          outlined dense hide-details color="celeste"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="fecha2" locale="es-es" color="rosa"  scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text small color="gris" @click="fechamodal2 = false">Cancelar</v-btn>
                      <v-btn dark small color="rosa" @click="$refs.fecha2.save(fecha2)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" sm="6" v-if="tab === '3'"/>
                <v-col cols="12" sm="6" v-if="tab === '3' || tab === '4' || tab==='5' || tab ==='6'"> 
                  <v-dialog ref="hora_compromiso" v-model="horamodal" :return-value.sync="hora" persistent width="290px" >

                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="hora" :label="nomhora1" append-icon="access_time" readonly v-on="on"
                        outlined dense hide-details color="celeste"
                      ></v-text-field>
                    </template>

                    <v-time-picker v-if="horamodal" locale="es-es" color="rosa" v-model="hora" full-width ampm-in-title>
                      <v-spacer></v-spacer>
                      <v-btn small text color="gris" @click="horamodal = false">Cancel</v-btn>
                      <v-btn small dark color="rosa" @click="$refs.hora_compromiso.save(hora)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" sm="6" v-if="tab === '3' || tab === '4'">  
                  <v-dialog ref="horaFin" v-model="horaFinmodal" :return-value.sync="hora_fin" persistent width="290px" >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="hora_fin" :label="nomhora2" append-icon="access_time" readonly v-on="on"
                        outlined dense hide-details color="celeste"
                      ></v-text-field>
                    </template>

                    <v-time-picker v-if="horaFinmodal" locale="es-es" color="rosa" v-model="hora_fin" full-width ampm-in-title>
                      <v-spacer></v-spacer>
                      <v-btn small text color="gris" @click="horaFinmodal = false">Cancel</v-btn>
                      <v-btn small dark color="rosa" @click="$refs.horaFin.save(hora_fin)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-tabs-items>
          </v-col>
          <!-- MOTIVO DEL PERMISO -->
          <v-col cols="12" class="pa-0">
            <v-textarea 
              v-model="motivo" outlined label="Motivo del permiso" height="80px"
              placeholder="Escribe el motivo..."  hide-details
            ></v-textarea>
          </v-col>
				</v-row>

				<!-- //DIALOG PARA GUARDAR LA INFORMACION -->
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small :disabled="dialog" persistent :loading="dialog" 
                 dark center class="white--text" color="success" @click="validaInfo" >
             {{ modoVista === 1? 'Guardar':'Actualizar'}}  
          </v-btn>

          <v-dialog v-model="dialog" hide-overlay persistent width="300">
            <v-card color="blue darken-4" dark >
              <v-card-text> <th style="font-size:17px;" align="center">{{ textDialog }}</th>
                <br>
                <v-progress-linear indeterminate color="white" class="mb-0" persistent></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>

					<v-dialog v-model="Correcto" hide-overlay persistent width="350">
            <v-card color="success"  dark class="pa-3">
							<h3><strong>{{ textCorrecto }} </strong></h3>
            </v-card>
          </v-dialog>
				</v-card-actions>

			</v-col>
		</v-row>
	</v-main >
</template>

<script>
	import  SelectMixin from '@/mixins/SelectMixin.js';
  import {mapGetters, mapActions} from 'vuex'
	var moment = require('moment'); 
  // moment.locale('es');
	export default {
		mixins:[SelectMixin],
	  components: {
		},
		props:[
			'modoVista',
			'parametros',
	  ],
	  data () {
			return {
        //FECHA
        fecha1: '',
        fechamodal1:false,
        fecha2: '',
        fechamodal2:false,
        // HORA
				hora 					 : null,
        horamodal			 : false,
				hora_compromiso: false,
				horaFin			: false,
        horaFinmodal: false,
				hora_fin    : null,

        nomfecha1: '',
        nomfecha2: '',
        nomhora1: '',
        nomhora2: '',

        tab: null,
				dialog : false,
				textDialog : "Guardando Información",
				Correcto   : false,
        textCorrecto: '',
        tipos:[{id:1, nombre:'Permiso con goce'},
                {id:2, nombre:'Permiso sin goce'},
                {id:3, nombre:'Entrada / Salida'},
                {id:4, nombre:'Permiso para salir y regresar'},
                {id:5, nombre:'Permiso llegar tarde'},
                {id:6, nombre:'Permiso salir temprano'}, 
              ],
				// VARIABLES PRINCIPALES
        motivo: '',
        id_usuario: null,
        usuario: { id: null, nombre:'', puesto:'', departamento:''},
        permiso: 0,
			 // ALERTAS
				snackbar: false,
				text		: '',
				color		: 'error',
			}
		},
    // return moment(this.fecha2).diff(moment(this.fecha1),'days')
		created(){ this.validarModoVista() },
		computed:{ },
		watch:{ 
      parametros: function(){ this.validarModoVista(); },
      tab(){
        switch (this.tab) {
          case '1':
            this.nomfecha1 = "Desde";
            this.nomfecha2 = "Hasta";
            this.nomhora1  = "Hora";
            this.nomhora2  = "Hora";
            break;
          case '2':
            this.nomfecha1 = "Desde";
            this.nomfecha2 = "Hasta";
            this.nomhora1  = "Hora";
            this.nomhora2  = "Hora";
            break;
          case '3':
            this.nomfecha1 = "Día";
            this.nomfecha2 = "fecha";
            this.nomhora1  = "Hora entrada";
            this.nomhora2  = "Hora salida";
            break;
          case '4':
            this.nomfecha1 = "Fecha ";
            this.nomfecha2 = "Fecha";
            this.nomhora1  = "Hora salida";
            this.nomhora2  = "Hora entrada";
            break;
          case '5':
            this.nomfecha1 = "Día";
            this.nomfecha2 = "Fecha";
            this.nomhora1  = "Hora de llegada";
            this.nomhora2  = "Hora";
            break;
          case '6':
            this.nomfecha1 = "Día";
            this.nomfecha2 = "Fecha";
            this.nomhora1  = "Hora de llegada";
            this.nomhora2  = "Hora";
            break;
        }
      }
    },

		methods:{
			// IMPORTANDO USO DE VUEX - CLIENTES(ACCIONES)
      ...mapActions('Permisos'  ,['consultarPermisos']),

			validarModoVista(){
				if(this.modoVista === 2 ){
          // ASIGNAR VALORES AL FORMULARIO
          this.id_usuario = this.parametros.id_usuario
          this.usuario = { id: this.parametros.id_usuario,
                           nombre: this.parametros.nombre,
                           puesto: this.parametros.puesto,
                           departamento: this.parametros.departamento 
                          }
          this.tab      = this.parametros.tipo_permiso;
          this.permiso  = this.parametros.tipo_permiso
          this.motivo   = this.parametros.motivo;
          this.fecha1   = this.parametros.fecha1;
          this.fecha2   = this.parametros.fecha2;
          this.hora     = this.parametros.hora1;
          this.hora_fin = this.parametros.hora2;

					// this.cartera      = { id:this.parametros.id_cartera, nombre: this.nomcartera };
				}else{
				  this.limpiarCampos()
          this.fecha1   = this.traerFechaActual();
          this.fecha2   = this.traerFechaActual();
          this.hora     = this.traerHoraActual() ;
          this.hora_fin = this.traerHoraActual() ;
				}
			},

			validaInfo(){
        if(!this.id_usuario){ this.snackbar = true; this.text="DEBE SELECCIONAR A UN EMPLEADO"; return };
        if(!this.motivo){ this.snackbar = true; this.text="DEBES DE AGREGAR UN MOTIVO"; return };
        
        switch (this.tab) {
          case '1':
            if(!this.fecha1 || !this.fecha2){ this.snackbar = true; this.text="OLVIDASTE UNA FECHA"; return };
            break;
          case '2':
            if(!this.fecha1 || !this.fecha2){ this.snackbar = true; this.text="OLVIDASTE UNA FECHA"; return };
            break;
          case '3':
            if(!this.fecha1 ){ this.snackbar = true; this.text="OLVIDASTE UNA FECHA"; return };
            if(!this.hora || !this.hora_fin){ this.snackbar = true; this.text="OLVIDASTE LA HORA"; return };
            break;
          case '4':
            if(!this.hora || !this.hora_fin){ this.snackbar = true; this.text="OLVIDASTE LA HORA"; return };
            break;
          case '5':
             if(!this.fecha1){ this.snackbar = true; this.text="OLVIDASTE UNA FECHA"; return };
             if(!this.hora ){ this.snackbar = true; this.text="OLVIDASTE LA HORA"; return };
            break;
          case '6':
            if(!this.fecha1){ this.snackbar = true; this.text="OLVIDASTE UNA FECHA"; return };
            if(!this.hora ){ this.snackbar = true; this.text="OLVIDASTE LA HORA"; return };
            break;
        }
				
				this.PrepararPeticion() // MANDO A FORMAR EL OBJETO PARA GUARDAR
			},

			PrepararPeticion(){
				// FORMAR ARRAY A MANDAR
        const payload = { id_usuario: this.id_usuario,
                          fecha: this.traerFechaActual(),
                          tipo_permiso: parseInt(this.tab),
                          motivo: this.motivo,
                          fecha1: this.fecha1,
                          fecha2: this.fecha2,
                          hora1: this.hora,
                          hora2: this.hora_fin,
                        }
				// VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.modoVista === 1 ? this.Crear(payload): this.Actualizar(payload);
			},

			Crear(payload){
				this.dialog = true ; setTimeout(() => (this.dialog = false), 2000) // ACTIVO DIALOGO -> GUARDANDO INFO
				this.$http.post('permiso', payload).then((response)=>{
           if(!response.body.length){
            this.snackbar=true; this.color ="error";
            this.text = "Ocurrio un problema, intentelo mas tarde."
            return
          }
					this.TerminarProceso(response.body);					
				}).catch(err =>{
					console.log('err',err)
				})
			},

			Actualizar(payload){
        // ACTIVO DIALOGO -> GUARDANDO INFO
				this.dialog = true ; this.textDialog ="Actualizando Información";
				let mensaje = ''; setTimeout(() => (this.dialog = false), 2000);
				this.$http.put('permiso/'+ this.parametros.id, payload).then((response)=>{
          if(!response.body.length){
            this.snackbar=true; this.color ="error";
            this.text = "Ocurrio un problema, intentelo mas tarde."
            return
          }
					this.TerminarProceso(response.body);					
				})
			},

			TerminarProceso(mensaje){
				var me = this ;
				this.dialog = false; this.Correcto = true ; this.textCorrecto = mensaje;
				setTimeout(function(){ me.$emit('modal',false)}, 2000);
				this.limpiarCampos();  //LIMPIAR FORMULARIO
				this.consultarPermisos(this.traerFechaActual, this.traerFechaActual);
				// this.consultaProspectos() //ACTUALIZAR CONSULTA DE CLIENTES
			},

			limpiarCampos(){
        this.id_usuario = null;
        this.usuario    = { id: null, nombre:'', puesto:'', departamento:''};
        this.fecha1     = ''
        this.fecha2     = ''
        this.hora       = ''
        this.hora_fin   = ''
				this.motivo     = '';
        this.tab        = '1';
      },

      buscarEmpleado(){
        this.$http.get('busca.empleado/'+ this.id_usuario).then(response =>{
          if(response.body.length){
            this.usuario = { id: response.body[0].id,
                             nombre: response.body[0].nombre,
                             puesto: response.body[0].puesto,
                             departamento: response.body[0].departamento
                           }
          }else{
            this.snackbar = true; this.text = 'NO SE ENCONTRO EMPLEADO'
            this.usuario = { id: null, nombre:'', puesto:'', departamento:''}
          }
          
        }).catch(err =>{
          console.log('err', err)
        })
      }
		}
	}
</script>