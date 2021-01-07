<template >
  <v-main class="pa-0 ma-3">
  	<v-row  class="justify-center">

      <v-snackbar top v-model="snackbar" :timeout="2000"  color="error"> {{ text }} 
        <v-btn  dark icon class="mx-5" @click="snackbar = false" > <v-icon>clear</v-icon> </v-btn>
      </v-snackbar>

      <v-btn color="celeste" fab fixed right dark bottom @click="busUsuario=true">
          <v-icon top>mdi-account-alert-outline</v-icon>
      </v-btn>

      <!-- TITULO DE LA PAGINA -->
      <v-col cols="12" align="center">
        <div class="text-lg-h3 text-md-h4 text-sm-h5 text-body-1 font-weight-black">REGISTRO DE ENTRADAS Y SALIDAS</div>
      </v-col>

       <v-tabs color="rosa" centered icons-and-text >
        <v-tab  ripple> SALIDA </v-tab>
        <v-tab  ripple> ENTRADA </v-tab>

        <v-tab-item justify="center">
          <v-row justify="center">
            <!-- ARRAY DE PERMISOS DE ENTRADA  -->
            <v-col cols="12" />
            <v-col cols="12" sm="6" md="3" lg="3" xl="2"  class=" child-flex" v-for="(item, i) in permisos" :key="i" >
              <v-card  class="elevation-10 " v-ripple @click="reportarSalida(item)" height="100%">
                <span class="pa-1">
                <v-img :src="item.img" loading="lazy" aspect-ratio="1.5" class=" " width="100%"  contain />
                </span>
                <v-card-text class="font-weight-bold text-h6" align="center" >
                 {{ item.titulo }} 
                </v-card-text>
              </v-card>
                 <v-progress-linear :color="item.color" value="100"></v-progress-linear>

            </v-col>
          </v-row>
        </v-tab-item>

        <!-- ARRAY DE PERSONAL FUERA DE LA EMPRESA -->
        <v-tab-item justify="center">
          <v-row>
            <v-col  v-for="(item, i) in getAccesos" :key="i" cols="12" sm="6"  lg="4" xl="3" class="my-3">
              <v-card height="100%" class="tarjeta" dark >
                <div class="d-flex flex-no-wrap justify-space-between">
                  <v-avatar class="ma-3" size="80" tile>
                    <v-img src="http://producciongama.com:8080/IMAGENES/usuario.png" loading="lazy"></v-img>
                  </v-avatar>
                  <div>
                    <v-card-title class="text-md-h5 text-sm-h6" v-text="item.nombre" style="word-break:normal;"></v-card-title>
                    <v-card-subtitle v-text="item.puesto" style="word-break:normal;" class=" text-sm-subtitle-2"></v-card-subtitle>
                    <v-divider></v-divider>
                    <v-card-subtitle v-text="item.concepto" style="word-break:normal;" class="text-sm-body-2 pb-0"></v-card-subtitle>
                  </div>
                </div>
              </v-card>
              <div class="mt-1"> <!-- REPORTE DE ENTRADA -->
                <v-btn block color="rosa" dark  @click="reportarEntrada(item)">Marcar Entrada</v-btn>
              </div>
            </v-col>

            <v-col cols="12" v-if="!getAccesos.length ">
              <v-alert color="celeste" dark border="left" prominent >
                <div class="d-flex flex-no-wrap justify-start">
                  <span><v-img src="http://producciongama.com:8080/IMAGENES/logotipo2.png" width="100px" loading="lazy"></v-img></span>
                  <span class="mx-6 text-h5"> NO HAY EMPLEADOS REGISTRADOS ACTUALMENTE. </span>
                  <v-spacer></v-spacer>
                  <span class="mx-6 text-h5"> 
                    <v-btn icon >
                      <v-icon x-large @click="consultarAccesos(getdatosUsuario.id_sucursal)">refresh</v-icon>
                    </v-btn> 
                  </span>
                </div>
              </v-alert>
            </v-col>

          </v-row>
        </v-tab-item>
      </v-tabs>

      <!-- DIALOGO PARA CAPTURAR EMPLEADO -->
      <v-dialog v-model="salida" :width="width">
        <v-card class="pa-3" >
          <v-card-title 
              class="font-weight-black subtitle-1 my-2" 
              style="word-break:normal;"
              align="center"
          >
            POR FAVOR INGRESE EL NÚMERO DE EMPLEADO 
          </v-card-title>

          <!-- CLIENTES ( SOLO PARA SALIDA DE VENDEDORES) -->
          <v-autocomplete
            :items="clientes" v-model="cliente" item-text="nombre" item-value="id" label="Clientes" return-object
            placeholder="Clientes" filled  hide-details  append-icon="persons" v-if="capturaCliente"
          ></v-autocomplete>

          <v-text-field 
            v-model="concepto" label="CONCEPTO" autofocus class="text-h6"
            filled hide-details v-if="captutaConcepto"
          ></v-text-field>
          
          <!-- SOLO SALIDA DE EMPLEADOS -->
          <v-text-field 
              v-model="id_usuario" label="NÚMERO DE EMPLEADO" autofocus class="text-h6"
              filled hide-details type="number" @keyup.enter="validaInfo" v-if="permiso==='S'"
          ></v-text-field>
          <!-- SOLO ENTRADA DE EMPLEADOS -->
          <v-text-field 
              v-model="id_usuario" label="NÚMERO DE EMPLEADO" autofocus class="text-h6"
              filled hide-details type="number" @keyup.enter="validarUsuario" v-else
          ></v-text-field>
          <v-card-actions>
            <v-spacer/>
            <v-btn  color="gris" dark class="mt-3 " @click="salida=false">Cancelar<v-icon >clear</v-icon> </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>

      <!-- DIALOGO PARA MENSAJE DE ALERTA  -->
      <v-dialog v-model="alerta" width="550px">
        <v-card flat   class="pa-3" >
          <v-card-title class=" text-sm-h5 text-body-1 font-weight-black" style="word-break:normal;">
            EXCELENTE DÍA, {{ nomusuario.toUpperCase() }}
          </v-card-title>
          <v-card-title class="headline text-h6 font-weight-black celeste--text" style="word-break:normal;" v-text="mensaje"/>
          <v-card-subtitle class="text-body-1 rosa--text" style="word-break:normal;" v-text="submensaje"/>
          <v-main align="center" class="pa-0">
            <v-btn :color="btnColor" dark  block  @click="alerta=false ">
              Cerrar ventana
            </v-btn>
          </v-main>
        </v-card>
      </v-dialog>

      <!-- DIALOGO PARA ERROR DE USUARIO -->
      <v-dialog v-model="error" width="400px">
        <v-card class="pa-3 elevation-0 white--text text-h6" color="red  darken-4" >
            El usuario <strong>{{ usuario_alt }}</strong> no se encuentra  <strong> Registrado.</strong> 
        </v-card>
      </v-dialog>

      <!-- DIALOGO PARA BUSCAR USUARIO -->
      <v-dialog v-model="busUsuario" width="600px">
        <v-card class="pa-4">
          <buscarUsuario/>
        </v-card>
      </v-dialog>
  	</v-row>
  </v-main>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
	import  SelectMixin from '@/mixins/SelectMixin.js';
  import buscarUsuario from '@/views/RhAcceso/buscarUsuario.vue';
  import store from '@/store'
  

  export default {
    mixins:[SelectMixin],
    components: {
      buscarUsuario,
    },
    data: () => ({
      busUsuario:false,
      permiso: 'S',
      llenaConcepto: false,
      error:false,
      nomusuario: '',
      alerta: false,
      salida: false,
      btnColor: '',
      // imagenAlerta: [
      //                 "http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/covid.png",
      //                 "http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/covid2.jpeg"
      //               ],
      mensaje:'NO OLVIDES TÚ CUBREBOCAS',
      submensaje: 'TÚ SALUD ES PRIMERO.',
      permisos:[ { id:1, 
                   titulo:'SALIDA A LA TIENDA',
                   img:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/tienda.png',
                   accion: 1,
                   color:'rosa'
                 },
                 { id:2, 
                   titulo:'HORA DE COMIDA', 
                   img:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/comer.png',
                   accion: 1,
                   color:'celeste'
                 },
                 { id:3, 
                   titulo:'SALIDA DE VENDEDOR', 
                   img:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/salida_vendedor.png',
                   accion: 2,
                   color:'morado'
                 },
                 { id:4, 
                   titulo:'OTRA SALIDA', 
                   img:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/otra2.png',
                   accion: 3,
                   color:'gris'
                 },
                ],
      id_usuario: null,
      usuario_alt: null,
      usuarios: {},
      fechaActual:'',
      horaActual: '',
      concepto: '',
      
      clientes:[],
      cliente: { id:null , nombre:''},
      capturaCliente: false,
      captutaConcepto: false,
      width: 550,
      caseActual: 1,

      snackbar: false,
      text: '',
    }),

    created(){
      if(!this.getLogeado){ this.authenticar(true)  }
      // this.authenticar(true);
      this.consultarAccesos(this.getdatosUsuario.id_sucursal)
      this.consultar_Clientes()
    },

    computed:{
      // ...mapGetters('Visitantes' ,['getVisitantes']), 
      ...mapGetters('Accesos' ,['getAccesos']), 
      ...mapGetters('Login' ,['getdatosUsuario','getLogeado']), 

    },
    
    methods:{
      ...mapActions('Accesos',['consultarAccesos','registraPermiso']),
      ...mapActions('Login' ,['Login','salirLogin','authenticar']),

      reportarSalida(item){
        this.regresaValoresDefault()
        switch (item.accion) {
          case 1 :
            this.caseActual = 1;
            this.salida = true;          // ABRO MODAL DE SALIDA.
            this.concepto = item.titulo
            break;
          case 2:
            this.caseActual = 2;
            this.capturaCliente  = true; // HABILITO AUTOCOMPLETE DE CLIENTES
            this.salida = true;          // ABRO MODAL DE SALIDA.
            this.concepto = item.titulo
            this.width = 500;            // TAMAÑO DE LA VISTA
            break;
           case 3:
            this.caseActual = 3;
            this.captutaConcepto = true
            this.concepto = '';
            this.salida = true;
            this.width = 500;            // TAMAÑO DE LA VISTA
            break;
        }
      },

      reportarEntrada(item){
        // this.regresaValoresDefault();
        this.mensaje = "NO OLVIDES APLICARTE GEL ANTIBACTERIAL";
        this.btnColor = "deep-purple accent-2";
        this.permiso = 'E';
        this.usuarios = item
        this.salida = true;
      },

      validaInfo(){
        if(this.caseActual === 1){ this.buscarUsuario()}
        if(this.caseActual === 2){ 
          if(!this.cliente.id){ 
            this.snackbar = true; this.text ="Debes seleccionar un cliente"; return
          }else{
            this.buscarUsuario()
          }
        }
        if(this.caseActual === 3){
          if(!this.concepto){ 
            this.snackbar = true; this.text ="Debes capturar un concepto de salida."; return
          }else{
            this.buscarUsuario()
          }
        }
      },
     
      buscarUsuario(){
        this.$http.get('bususuario.rh/'+ this.id_usuario).then(response =>{
          if(response.body.length){
            this.nomusuario = response.body[0].nombre;
            this.alerta = true; this.salida = false ; 
            
            const payload = { id_usuario: response.body[0].id, 
                              fecha1:   this.traerFechaActual(),
                              hora1:    this.traerHoraActual(),
                              concepto: this.concepto,
                              id_sucursal: this.getdatosUsuario.id_sucursal,
                              id_cliente : this.cliente.id? this.cliente.id: 0
                            }

            this.registraPermiso(payload);
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

      validarUsuario(){

        if(this.usuarios.id_usuario != this.id_usuario){ 
          this.snackbar = true; this.text = "EL USUARIO NO COINCIDE";
          return
        } //SI NO COINCIDE EL ID CON LO QUE SE ESCRIBA RETORNO
        const payload = { id_usuario:this.id_usuario ,
                          fecha2: this.traerFechaActual(), 
                          hora2: this.traerHoraActual(), 
                          estatus: 0 }
                         

        this.$http.post('actualiza.acceso',payload).then(response =>{

          if(response.body.length){
            this.nomusuario = response.body[0].nombre;
            this.alerta = true; this.salida = false ; this.id_usuario = null;
            this.consultarAccesos(this.getdatosUsuario.id_sucursal)
          }else{
            this.salida = false; this.error = true; this.id_usuario =null;
            setTimeout(() => (this.error = false), 2000)
          }
        })
      },
 
      regresaValoresDefault(){
        this.id_usuario      = null,
        this.mensaje         = "NO OLVIDES TÚ CUBREBOCAS";// MENSAJE QUE SE MOSTRARA EN LA ALERTA
        // this.imagenAlerta    = this.imagenAlerta[0];      // IMAGEN A MOSTRAR
        this.btnColor        = "gris"                  // COLOR DEL BOTON DE CIERRE
        this.permiso         = 'S';                       // PERMISO DE SALIDA = "S"
        this.captutaConcepto = false                      // DESHABILITO INPUT DE CONCEPTO
        this.capturaCliente  = false;                     // HABILITO AUTOCOMPLETE DE CLIENTES
        this.width           = 450;                       // TAMAÑO DE LA VISTA
        this.cliente         = { id: null, nombre:''}
      }
      
    }
  }
</script>

