<template>
  <v-main class="pa-0">
    <v-card-actions class="pa-0" >
      <v-spacer></v-spacer>
      <v-btn color="error" small @click="$emit('modal',false)" text><v-icon>clear</v-icon></v-btn>
    </v-card-actions>
    <v-row justify="center">
      <v-col cols="12" align="center">
        <div class="text-lg-h3 text-md-h4 text-sm-h5 text-body-1 font-weight-black">{{ titulo }}</div>
      </v-col>
      
      <v-col cols="12" >
        <v-form ref="form" v-model="valid" > 
          <v-row >
            <v-col cols="12" >
              <v-text-field 
                v-model="nombre" label="Nombre y Apellido" placeholder="Nombre y Apellido" 
                outlined   hide-details :rules="nombreRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="dedonde" label="De donde marca " placeholder="De donde marca" 
                outlined   hide-details :rules="dondeRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model.number="telefono" label="Telefono " placeholder="Telefono" 
                outlined hide-details type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                v-model="correo" label="Correo " placeholder="Correo" 
                outlined   hide-details 
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="motivo" label="Motivo " placeholder="Motivo" 
                outlined   hide-details :rules="motivoRules"
              ></v-text-field>
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
      titulo: 'REGISTRO DE LLAMADAS',
      valid: true,
      nombreRules: [v => !!v || 'Es requerido'],
      dondeRules : [v => !!v || 'Es requerido'],
      telRules   : [v => !!v || 'Es requerido'],
      correoRules: [v => !!v || 'Es requerido'],
      motivoRules: [v => !!v || 'Es requerido'],
      nombre  :'',
      dedonde :'',
      telefono:'',
      correo  :'',
      motivo  :'',

      dialog : false,
      textDialog : "Guardando Información",
      Correcto   : false,
      textCorrecto: '',
    }),

    created(){ this.validarModoVista() },
    computed:{ ...mapGetters('Login'    ,['getdatosUsuario']),  },
    watch:{ parametros: function(){ this.validarModoVista(); } }, 

    methods:{
				...mapActions('LLamadas'  ,['consultarLlamadas']), // IMPORTANDO USO DE VUEX (ACCIONES)
      validarModoVista(){
				if(this.modoVista === 2 ){
          // ASIGNAR VALORES AL FORMULARIO
          this.nombre   = this.parametros.nombre;
          this.dedonde  = this.parametros.dedonde
          this.telefono = this.parametros.telefono;
          this.correo   = this.parametros.correo;
          this.motivo   = this.parametros.motivo;
				}else{
				  this.limpiarCampos()
				}
      },

      PrepararPeticion(){
        const payload = { nombre  : this.nombre,
                          dedonde : this.dedonde,
                          telefono: this.telefono? this.telefono=this.telefono: this.telefono = '',
                          correo  : this.correo? this.correo=this.correo: this.correo = '',
                          motivo  : this.motivo,
                          fecha   : this.traerFechaActual(),
                          hora    : this.traerHoraActual(),
                          id_sucursal: this.getdatosUsuario.id_sucursal
                        }
        // VALIDO QUE ACCION VOY A EJECUTAR SEGUN EL MODO DE LA VISTA
				this.modoVista === 1 ? this.Crear(payload): this.Actualizar(payload);
        
      },
      
      Crear(payload){
        this.dialog = true ; setTimeout(() => (this.dialog = false), 2000) 
        this.$http.post('add.llamada', payload).then(response =>{
          if(!response.body.length){
            this.snackbar=true; this.color ="error";
            this.text = "Ocurrio un problema, intentelo mas tarde."
            return
          }
          this.TerminarProceso(response.body);
        })
      },

      Actualizar(payload){
				this.dialog = true ; this.textDialog ="Actualizando Información";
				setTimeout(() => (this.dialog = false), 2000);
        this.$http.put('put.llamada/'+ this.parametros.id, payload).then((response)=>{
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
        setTimeout(function(){ me.$emit('recarga',!this.modoVista)},500);
        this.limpiarCampos();  //LIMPIAR FORMULARIO
        this.consultarLlamadas(this.getdatosUsuario.id_sucursal);
      },

      limpiarCampos(){
        this.nombre   = '';
        this.dedonde  = '';
        this.telefono = '';
        this.correo   = '';
        this.motivo   = '';
      }
    }
  }
</script>
