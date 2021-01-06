<template>
  <v-main class="pa-0">
    <v-card-actions class="pa-0" >
      <v-spacer></v-spacer>
      <v-btn color="error" small @click="$emit('modal',false)" text><v-icon>clear</v-icon></v-btn>
    </v-card-actions>

    <v-snackbar v-model="snackbar" :color="color" top multi-line right > <b>{{ text }}</b> </v-snackbar>

    <v-row justify="center">
      <v-col cols="12" align="center">
        <div class="text-lg-h5 text-md-h5 text-sm-h6 text-body-1 font-weight-black">{{ titulo }}</div>
      </v-col>
      
      <v-col cols="12" >
        <v-form ref="form" v-model="valid" > 
          <v-row >
            <v-col cols="12" >  
              <v-autocomplete
                :items="usuarios" v-model="usuario" item-text="nombre" item-value="id" label="Quien reserva" return-object
                placeholder="Quien reserva" outlined  hide-details color="rosa" dense :rules="usuarioRules"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" lg="6">
              <v-select 
                v-model="sucursal" :items="sucursales" item-text="nombre" item-value="id" outlined
                return-object hide-details dense label="Sucursales"
              ></v-select>
            </v-col>

            <v-col cols="12" lg="6">
              <v-dialog ref="fecha1" v-model="fechamodal" :return-value.sync="fecha" persistent width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="fecha" label="Fecha" append-icon="event" readonly v-on="on"
                      outlined dense hide-details color="rosa" :rules="fechaRules"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="fecha" locale="es-es" color="rosa"  scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text small color="celeste" @click="fechamodal = false">Cancelar</v-btn>
                  <v-btn dark small color="rosa" @click="$refs.fecha1.save(fecha)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12" lg="6">
              <v-dialog ref="hora1" v-model="horamodal" :return-value.sync="hora" persistent width="290px" >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="hora" label="Hora Inicio" append-icon="access_time" readonly v-on="on"
                    outlined dense hide-details color="celeste" :rules="horaRules"
                  ></v-text-field>
                </template>

                <v-time-picker v-if="horamodal" locale="es-es" color="rosa" v-model="hora" full-width ampm-in-title>
                  <v-spacer></v-spacer>
                  <v-btn small text color="celeste" @click="horamodal = false">Cancel</v-btn>
                  <v-btn small dark color="rosa" @click="$refs.hora1.save(hora)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>

           <v-col cols="12" lg="6">
              <v-dialog ref="hora2" v-model="horamodal2" :return-value.sync="horafin" persistent width="290px" >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="horafin" label="Hora Fin" append-icon="access_time" readonly v-on="on"
                    outlined dense hide-details color="celeste" :rules="horaRules"
                  ></v-text-field>
                </template>

                <v-time-picker v-if="horamodal2" locale="es-es" color="rosa" v-model="horafin" full-width ampm-in-title>
                  <v-spacer></v-spacer>
                  <v-btn small text color="celeste" @click="horamodal2 = false">Cancel</v-btn>
                  <v-btn small dark color="rosa" @click="$refs.hora2.save(horafin)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="concepto"  label="Concepto " placeholder="Escriba el motivo de la junta." 
                outlined hide-details :rules="conceptoRules" rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer><v-btn color="success" :disabled="!valid" @click="PrepararPeticion()">Guardar Información</v-btn>
        </v-card-actions>

        <v-dialog v-model="dialog" hide-overlay persistent width="300">
          <v-card color="blue darken-4" dark >
            <v-card-text> <th style="font-size:17px;" align="center">{{ textDialog }}</th>
              <br><v-progress-linear indeterminate color="white" class="mb-0" persistent></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="Correcto" hide-overlay persistent width="350">
          <v-card color="success"  dark class="pa-3">
            <h3><strong>{{ textCorrecto }} </strong></h3>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import {mapGetters, mapActions} from 'vuex';
  
  export default {
    mixins:[SelectMixin],
    props:[
			'modoVista',
			'parametros',
	  ],
    data: () => ({
      titulo: 'AGENDAR USO DE SALA DE JUNTAS',
      valid: true,

      usuarioRules : [v => !!v || 'Es requerido'],
      fechaRules   : [v => !!v || 'Es requerido'],
      horaRules    : [v => !!v || 'Es requerido'],
      conceptoRules: [v => !!v || 'Es requerido'],
      sucursal     : { id: null, nombre:''},
      sucursales   : [],

      fecha        : '',
      fechamodal   :false,

      horafin      : '',
      horamodal2   : false,
      hora 			   : null,
      horamodal	   : false,
      usuarios     : [],
      usuario      : { id:null, nombre:''},
      concepto     : '',

      snackbar    : false,
      text		    : '',
      color		    : 'error',
      dialog      : false,
      textDialog  : "Guardando Información",
      Correcto    : false,
      textCorrecto: '',
    }),

     
    created(){ 
      this.validarModoVista(); 
      this.consultaUsuarios();  
      this.consultaSucursales()

    },
    computed:{ ...mapGetters('Login'    ,['getdatosUsuario']),  },
    watch:{ parametros: function(){ this.validarModoVista(); } }, 

    methods:{
				...mapActions('Juntas'  ,['consultarJuntas']), // IMPORTANDO USO DE VUEX (ACCIONES)
        
      validarModoVista(){
				if(this.modoVista === 2 ){
          // ASIGNAR VALORES AL FORMULARIO
          this.usuario  = { id:this.parametros.id_usuario, nombre: this.parametros.nomusuario};
          this.fecha    = this.parametros.fecha
          this.fechafin = this.parametros.fecha2
          this.hora     = this.parametros.hora;
          this.horafin  = this.parametros.hora2;
          this.concepto = this.parametros.concepto;
          this.sucursal = { id    : this.parametros.id_sucursal, 
                            nombre: this.parametros.sucursal
                          }
				}else{
				  this.limpiarCampos()
				}
      },

      PrepararPeticion(){
        const payload = { fecha      : this.fecha,
                          hora       : this.hora,
                          hora2      : this.horafin,
                          id_usuario : this.usuario.id,
                          concepto   : this.concepto ,
                          id_sucursal: this.sucursal.id
                        }
        // VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.modoVista === 1 ? this.Crear(payload): this.Actualizar(payload);
        
      },
      
      Crear(payload){
        this.dialog = true ;this.textDialog ="Guardando Información";
        this.$http.post('add.junta', payload).then(response =>{
          this.TerminarProceso(response.bodyText);
        }).catch(error =>{
          this.mostrarError(error.bodyText)
        }).finally(() => this.dialog = false) 
      },

      Actualizar(payload){
				this.dialog = true ; this.textDialog ="Actualizando Información";
        this.$http.put('put.junta/'+ this.parametros.id, payload).then((response)=>{
					this.TerminarProceso(response.bodyText);					
				}).catch(error =>{
          this.mostrarError(error.bodyText)
        }).finally(() => this.dialog = false) 
			},

			TerminarProceso(mensaje){
        var me = this ;
        this.dialog = false; this.Correcto = true ; this.textCorrecto = mensaje;
        setTimeout(function(){ me.$emit('modal',false)}, 2000);
        setTimeout(function(){ me.$emit('recarga',!this.modoVista)},1000);
        this.limpiarCampos();  //LIMPIAR FORMULARIO
        // this.consultarJuntas(this.getdatosUsuario.id_sucursal);
      },

      limpiarCampos(){
        this.usuario  = { id:null, nombre:''};
        this.fecha    = this.traerFechaActual();
        this.horafin = this.traerHoraActual();
        this.hora     = this.traerHoraActual();
        this.sucursal  = { id:null, nombre:''};
        this.concepto = '';
      },
      mostrarError(mensaje){
				this.snackbar=true; this.text=mensaje;
			}
    }
  }
</script>
