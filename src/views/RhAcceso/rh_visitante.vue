<template>
  <v-main class="pa-0">
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="elevation-0">
         
          <v-tabs color="rosa" centered icons-and-text >
            <v-tab  ripple> ENTRADA </v-tab>
            <v-tab  ripple> SALIDA </v-tab>
            
            <v-tab-item justify="center">
              <v-card class="elevation-0">
                <v-row justify="center">
                   <v-col cols="12" align="center">
                    <div class="text-lg-h3 text-md-h4 text-sm-h5 text-body-1 font-weight-black">REGISTRO DE VISITANTES</div>
                  </v-col>
                  
                  <v-col cols="12" sm="9" md="6" lg="5" xl="4" >
                      <v-form ref="form" v-model="valid" > 
                        <v-row >
                          <v-col cols="12" >
                            <v-text-field 
                              v-model="nombre" label="Nombre" placeholder="Nombre del visitante" 
                              outlined   hide-details :rules="nombreRules"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field 
                              v-model="empresa" label="Empresa " placeholder="Empresa" 
                              outlined   hide-details :rules="empresaRules"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field 
                              v-model="concepto" label="Concepto " placeholder="Concepto" 
                              outlined   hide-details :rules="conceptoRules"
                            ></v-text-field>
                          </v-col>
                          
                          <v-col cols="12" sm="8" >  
                            <v-autocomplete
                              :items="usuarios" v-model="usuario" item-text="nombre" item-value="id" label="A quien visita" return-object
                              placeholder="A quien visita" outlined  hide-details color="celeste" append-icon="persons" :rules="visitaRules"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field 
                              v-model.number="temperatura" label="Temperatura " placeholder="Temperatura" 
                              outlined   hide-details :rules="temperaturaRules" type="number"
                            ></v-text-field>
                          </v-col>

                        </v-row>
                      </v-form>
                      <v-card-actions>
                        <v-spacer></v-spacer><v-btn color="success" :disabled="!valid" @click="agregarVisita">Guardar Información</v-btn>
                      </v-card-actions>
                    <!-- </v-card> -->
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-row>
                <v-col  v-for="(item, i) in getVisitantes" :key="i" cols="12" sm="6" lg="4" xl="3" class="my-2">
                  <v-card height="100%" class="tarjeta" dark >
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <v-avatar class="ma-3" size="80" tile>
                        <v-img src="http://producciongama.com:8080/IMAGENES/usuario.png" loading="lazy"></v-img>
                      </v-avatar>
                      <div>
                        <v-card-title class="text-md-h4 text-sm-h5" v-text="item.nombre" style="word-break:normal;"></v-card-title>
                        <v-card-subtitle v-text="item.empresa" style="word-break:normal;" class="text-md-h5 text-sm-h6"></v-card-subtitle>
                      </div>
                    </div>
                  </v-card>
                  <div class="mt-1">
                    <v-btn block color="rosa" dark small @click="Salida(item)">Marcar Salida</v-btn>
                  </div>
                </v-col>
                <v-col cols="12" v-if="!getVisitantes.length ">
                  <v-alert color="celeste" dark border="left" prominent >
                    <div class="d-flex flex-no-wrap justify-start">
                      <span><v-img src="http://producciongama.com:8080/IMAGENES/logotipo2.png" width="100px" loading="lazy"></v-img></span>
                      <span class="mx-6 text-h5"> NO HAY VISITANTES REGISTRADOS ACTUALMENTE. </span>
                      <v-spacer></v-spacer>
                      <span class="mx-6 text-h5"> 
                        <v-btn icon >
                          <v-icon x-large @click="consultarVisitantes(getdatosUsuario.id_sucursal)">refresh</v-icon>
                        </v-btn>
                      </span>
                    </div>

                  </v-alert>
                </v-col>
              </v-row>
            </v-tab-item>
          
          </v-tabs>
        </v-card>
      </v-col>

      <v-dialog v-model="SalidaModal" width="500px">
        <v-card>
          <v-card-title class="text-md-h4 text-sm-h5" v-text="usuarioVisitante.nombre" style="word-break:normal;"></v-card-title>
          <v-card-subtitle v-text="usuarioVisitante.empresa" style="word-break:normal;" class="text-md-h5 text-sm-h6"></v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gris" outlined dark @click="SalidaModal=false">Cancelar</v-btn>
            <v-btn color="rosa" dark @click="MarcarSalida()">Marcar Salida</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="alerta" width="700px">
        <v-card flat   class="pa-5" >
          <v-card-actions class="text-lg-h5 text-md-h4 text-sm-h5 text-body-1 font-weight-black" style="word-break:normal;">
            BUEN DÍA  {{ usuarioVisitante.nombre }}
          </v-card-actions>
          <v-img :src="Aviso.imagenAlerta" loading="lazy" width="100%" />
          <v-card-title class="headline text-h5 font-weight-black" style="word-break:normal;" v-text="Aviso.mensaje">
          </v-card-title>
          <v-card-subtitle class="text-h6" style="word-break:normal;"> TÚ SALUD ES PRIMERO. </v-card-subtitle>
          <v-main align="center" class="pa-0">
            <v-btn :color="Aviso.btncolor" dark fab large  width="100px" height="100px" @click="alerta=false "><v-icon large>clear</v-icon></v-btn>
          </v-main>
        </v-card>
      </v-dialog>

    </v-row>
  </v-main>
</template>

<script>
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import {mapGetters, mapActions} from 'vuex';
  
  export default {
		mixins:[SelectMixin],
    data: () => ({
      valid: true,
      nombreRules: [v => !!v || 'Es requerido'],
      empresaRules: [v => !!v || 'Es requerido'],
      conceptoRules: [v => !!v || 'Es requerido'],
      visitaRules: [v => !!v || 'Es requerido'],
      temperatura:'',
      temperaturaRules: [v => !!v || 'Es requerido'],
      nombre:'',
      nombreAlt: '',
      empresa:'',
      concepto:'',
      usuarios: [],
      usuario: { id:null, nombre:''},
      alerta: false,
      usuarioVisitante:{ },
      SalidaModal: false,
      AvisosGama: [ { mensaje:"NO OLVIDES TÚ CUBREBOCAS", imagenAlerta:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/covid.png', btncolor:"celeste" },
                    { mensaje:"NO OLVIDES APLICARTE GEL ANTIBACTERIAL", imagenAlerta:'http://producciongama.com:8080/GAMA-ADMIN/IMAGENES/covid2.jpeg', btncolor:"celeste", } ],
      Aviso: {}

    }),

    created(){
      this.consultaUsuarios();
      this.consultarVisitantes(this.getdatosUsuario.id_sucursal);
    },

    computed:{
      ...mapGetters('Visitantes' ,['getVisitantes']), 
      ...mapGetters('Login' ,['getdatosUsuario']), 
		},
        
    methods:{
			...mapActions('Visitantes' ,['consultarVisitantes']), 
      
      agregarVisita(){
        const payload = { nombre: this.nombre.toUpperCase() ,
                         empresa: this.empresa.toUpperCase(),
                         concepto: this.concepto,
                         temperatura: this.temperatura,
                         usuario_visita: this.usuario.id,
                         fecha1: this.traerFechaActual(),
                         hora1: this.traerHoraActual(),
                         id_sucursal: this.getdatosUsuario.id_sucursal
                        }

        this.$http.post('add.visitante', payload).then(response =>{
          this.Aviso = this.AvisosGama[1]
          this.usuarioVisitante = { nombre: this.nombre };
          this.alerta = true;
          this.consultarVisitantes(this.getdatosUsuario.id_sucursal)
          this.limpiarCampos()
        })
      },

      Salida(visitante){
        this.usuarioVisitante = visitante;
        this.SalidaModal = true;
      },

      MarcarSalida(){
        const payload = { id: this.usuarioVisitante.id,
                          fecha2: this.traerFechaActual(),
                          hora2: this.traerHoraActual(),
                          estatus: 0
                        }

        this.$http.post('marcar.salida', payload).then(response =>{
          this.Aviso = this.AvisosGama[0]
          this.alerta = true; this.SalidaModal = false;
          this.consultarVisitantes(this.getdatosUsuario.id_sucursal)
        }).catch(err =>{
          console.log('err',err)
        })

      },

      limpiarCampos(){
        this.nombreAlt = this.nombre;
        this.nombre = '';
        this.empresa = '',
        this.concepto = '',
        this.usuario = { id:null, nombre: ''}
      }
    }
  }
</script>

<style scoped>
  .tarjeta{
    background: #0096cb;  
    background: -webkit-linear-gradient(to right, #0096cb,#0095cbb3, #0096cb);  
    background: linear-gradient(to right, #0096cb, #0095cbb3, #0096cb); 
  }
</style>