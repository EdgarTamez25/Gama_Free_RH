<template >
  <v-main class="pa-0 ma-3">
  	<v-row  class="justify-center">
      <!-- TITULO DE LA PAGINA -->
      <v-col cols="12" align="center">
        <div class="text-lg-h3 text-md-h4 text-sm-h5 text-body-1 font-weight-black">REGISTRO DE ENTRADAS Y SALIDAS</div>
      </v-col>

      <!-- REPORTE DE ENTRADA -->
      <v-col cols="11" sm="8" md="7" lg="5" xl="3" align="center">
        <v-btn  color="celeste" dark  x-large rounded block class="text-h5" @click="reportarEntrada()"> REPORTAR ENTRADA </v-btn>
      </v-col>

        <!-- ARRAY DE PERMISOS  -->
      <v-col cols="12" />
      <v-col cols="12" sm="6" md="6" lg="3"  class="d-flex child-flex" v-for="(item, i) in permisos" :key="i" >
        <v-card class="elevation-10  pa-1 "   v-ripple @click="reportarSalida(item)">
          <v-img :src="item.img" loading="lazy" aspect-ratio="1.5" class=" pa-2 mb-5 " width="100%"  contain />
          <v-card-actions >
            <span class="font-weight-bold text-h5" > {{ item.titulo }} </span>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- DIALOGO PARA CAPTURAR EMPLEADO -->
      <v-dialog v-model="salida" width="400px">
        <v-card class="pa-3" >
          <v-card-actions>
            <v-card-title style="word-break:normal;">POR FAVOR INGRESE SU NUMERO DE EMPLEADO  </v-card-title><v-spacer/>
            <v-btn fab color="red" text><v-icon large  @click="salida=false">clear</v-icon> </v-btn>
          </v-card-actions>
          <v-text-field 
              v-model="id_usuario" label="NÚMERO DE EMPLEADO" autofocus style="font-size:30px"
              outlined hide-details type="number" @keyup.enter="buscarUsuario" v-if="permiso==='S'"
          ></v-text-field>
          <v-text-field 
              v-model="id_usuario" label="NÚMERO DE EMPLEADO" autofocus style="font-size:30px"
              outlined hide-details type="number" @keyup.enter="validarUsuario" v-else
          ></v-text-field>
        </v-card>
      </v-dialog>
      <!-- DIALOGO PARA MENSAJE DE ALERTA  -->
      <v-dialog v-model="alerta" width="700px">
        <v-card flat   class="pa-5" >
          <v-card-actions class="text-lg-h5 text-md-h4 text-sm-h5 text-body-1 font-weight-black" style="word-break:normal;">
            BUEN DÍA  {{ nomusuario.toUpperCase() }}
          </v-card-actions>
          <v-img :src="imagenAlerta" loading="lazy" width="100%" />
          <v-card-title class="headline text-h5 font-weight-black" style="word-break:normal;" v-text="mensaje"></v-card-title>
          <v-card-subtitle class="text-h6" style="word-break:normal;" v-text="submensaje"></v-card-subtitle>
          <v-main align="center" class="pa-0">
            <v-btn :color="btnColor" dark fab large  width="100px" height="100px" @click="alerta=false "><v-icon large>clear</v-icon></v-btn>
          </v-main>
        </v-card>
      </v-dialog>
      
      <v-dialog v-model="error" width="400px">
        <v-card class="pa-3 elevation-0 white--text text-h6" color="red  darken-4" >
            El usuario <strong>{{ usuario_alt }}</strong> no se encuentra  <strong> Registrado.</strong> 
        </v-card>
      </v-dialog>

  	</v-row>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    permiso: 'S',
    error:false,
    nomusuario: '',
    alerta: false,
    salida: false,
    btnColor: '',
    imagenAlerta: 'covid.png',
    mensaje:'NO OLVIDES TÚ CUBREBOCAS',
    submensaje: 'TÚ SALUD ES PRIMERO.',
    permisos:[ { id:1, titulo:'SALIDA A LA TIENDA'    , img:'tienda.png'},
               { id:2, titulo:'HORA DE COMIDA'        , img:'comer.png'},
               { id:3, titulo:'PERMISO SALIR Y VOLVER 2', img:'salida3.png'},
               { id:4, titulo:'OTRO PERMISO'          , img:'otros.jpg'}, ],

    id_usuario: null,
    usuario_alt: null,
    usuarios: {},
    fechaActual:'',
    horaActual: '',
    concepto: '',
	}),
	
	methods:{

    reportarSalida(item){
      this.mensaje = "NO OLVIDES TÚ CUBREBOCAS";
      this.imagenAlerta = "covid.png";
      this.btnColor = "celeste"
      this.permiso = 'S';
      this.concepto = item.titulo
      this.salida = true;
    },

    reportarEntrada(){
      this.mensaje = "NO OLVIDES APLICARTE GEL ANTIBACTERIAL";
      this.imagenAlerta = "covid2.jpeg";
      this.btnColor = "deep-purple accent-2";
      this.permiso = 'E';
      this.salida = true;
    },

		buscarUsuario(){
      this.$http.get('bususuario.rh/'+ this.id_usuario).then(response =>{
        if(response.body.length){
          this.nomusuario = response.body[0].nombre;
          this.alerta = true; this.salida = false ; 
          this.registraPermiso(response.body[0].id)
          this.id_usuario = null;
        }else{
          this.salida = false; this.error = true; 
          this.usuario_alt = this.id_usuario;   this.id_usuario =null; 
          setTimeout(() => (this.error = false), 2000)
        }
        
      }).catch(err =>{
        console.log('err', err)
      })
    },

    registraPermiso(id){
      const payload = { id_usuario: id, 
                        fecha1:   this.traerFechaActual(),
                        hora1:    this.traerHoraActual(),
                        concepto: this.concepto 
                      }

      this.$http.post('rh.acceso', payload);
    },

    validarUsuario(){
      const payload = { id_usuario:this.id_usuario ,fecha2: this.traerFechaActual(), hora2: this.traerHoraActual(), estatus: 0 }
      this.$http.post('actualiza.acceso',payload).then(response =>{
        console.log('ACTUALIZA', response.body)
        if(response.body.length){
          this.nomusuario = response.body[0].nombre;
          this.alerta = true; this.salida = false ; this.id_usuario = null;
        }else{
          this.salida = false; this.error = true; this.id_usuario =null;
          setTimeout(() => (this.error = false), 2000)
        }
      })
    },

    traerFechaActual(){
			var f = new Date(); 
			return f.getFullYear() +'-'+ (f.getMonth() + 1 < 10? '0' + (f.getMonth() + 1): f.getMonth() + 1 ) +'-'+ (f.getDate()<10?'0'+f.getDate():f.getDate());
		},

		traerHoraActual(){
			var f = new Date(); 
			return (f.getHours()<10? '0'+f.getHours(): f.getHours()) + ':' + (f.getMinutes()<10? '0'+ f.getMinutes(): f.getMinutes())
		},
    
	}
}
</script>

<style scoped>
  #canvas{
    border-color: black;
    border-style: solid;
    width: 100%;
  }
</style>
