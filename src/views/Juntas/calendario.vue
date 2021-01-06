<template>
  <v-row class="fill-height">
    <v-col >
      <v-card-actions class="ma-0 py-0 pb-0">
        <v-card-text class="font-weight-black text-h6">CALENDARIO- SALA DE JUNTAS</v-card-text>
        <v-spacer/>
        <v-select 
          v-model="sucursal" :items="sucursales" item-text="nombre" item-value="id" outlined
          return-object hide-details dense 
        ></v-select>
      </v-card-actions>
      <v-divider class="mt-1" ></v-divider>
      <v-sheet height="60">
        <!-- CONTROL DE MES Y AÑO **ADELANTE**ATRAS** -->
        <v-toolbar flat  >
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>  mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          
          <v-spacer></v-spacer>
          <v-btn text small color="rosa" dark class="ma-1" @click="prev"> 
            <v-icon >mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title class="ma-1 text-h6 font-weight-black celeste--text" v-if="$refs.calendar">
            {{ ($refs.calendar.title).toUpperCase()}}
          </v-toolbar-title>  
          <v-btn text small color="rosa" dark class="ma-1" @click="next"> 
            <v-icon >mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <!--  VISTA PRINCIPAL DEL CALENDARIO -->
      <v-sheet :height="tamanioPantalla" elevation="12">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:date="viewDay"
          @click:more="viewDay" 
          @change="updateRange"
        ></v-calendar>
        
        <!-- MENU DESPLEGABLE DE INFORMACION -->
        <v-menu
          v-model="selectedOpen" 
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-y
        >
          <v-card color="grey lighten-4" min-y width="100%" flat >
            <v-toolbar :color="selectedEvent.color" dark >
              <v-toolbar-title >
                {{ selectedEvent.name }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
               <v-btn icon  @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <ul>
                <li> <span class="font-weight-black subtitle-2"> CONCEPTO:</span> 
                  <span :class="`${selectedEvent.color}--text`"  > 
                    {{ selectedEvent.name }}   
                  </span> 
                </li>
                <li> <span class="font-weight-black subtitle-2"> HORA DE INICIO: </span> 
                  <span :class="`${selectedEvent.color}--text`"  > 
                    {{ selectedEvent.hora1 }} 
                  </span> 
                </li>
                <li> <span class="font-weight-black subtitle-2"> HORA FIN:</span> 
                  <span :class="`${selectedEvent.color}--text`"  > 
                    {{ selectedEvent.hora2}}   
                  </span> 
                </li> 
                <li> <span class="font-weight-black subtitle-2"> RESPONSABLE:</span> 
                  <span :class="`${selectedEvent.color}--text`"  > 
                    {{ selectedEvent.usuario}} 
                  </span> 
                </li>
              </ul>
            </v-card-text>
          </v-card>
          
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import  SelectMixin from '@/mixins/SelectMixin.js';
	import {mapGetters, mapActions} from 'vuex';

  export default {
		mixins:[SelectMixin],

    data: () => ({
      sucursal: { id: null, nombre:''},
      sucursales:[],
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        day: 'Day',
      },
      fecha1Estatica: {},
      fecha2Estatica: {},
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['rosa','pink','gris', 'morado','purple', 'celeste','blue'],
      
    }),

    created(){
      if(!this.getLogeado){
        this.AuthenticarTemporal();
      }

      this.consultaSucursales()
      this.sucursal = { id    : this.getdatosUsuario.id_sucursal?this.getdatosUsuario.id_sucursal: 1, 
                        nombre: this.getdatosUsuario.sucursal?this.getdatosUsuario.sucursal: 'MITRAS'}
    },
    computed:{
      // ...mapGetters('Juntas' ,['Loading','getJuntas']), // IMPORTANDO USO DE VUEX  (GETTERS)
      ...mapGetters('Login'    ,['getdatosUsuario','getLogeado']),       // IMPORTANDO USO DE VUEX  (GETTERS)

      tamanioPantalla () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs':
						return this.$vuetify.breakpoint.height -250
					break;
					case 'sm': 
						return this.$vuetify.breakpoint.height -250
					break;
					case 'md':
						return this.$vuetify.breakpoint.height -250
					break;
					case 'lg':
						return this.$vuetify.breakpoint.height -250
					break;
					case 'xl':
						return this.$vuetify.breakpoint.height -250
					break;
				}
			},
    },

    watch:{
				sucursal(){ 
          this.consultaSalaJuntas(this.fecha1Estatica.date, this.fecha2Estatica.date);
        }
			},
      
    mounted () { this.$refs.calendar.checkChange()  },

    methods: {
      ...mapActions('Login',['AuthenticarTemporal']),

      viewDay ({ date }) {
          this.focus = date
          this.type = 'day'
        console.log('vuelvo a formar viewDay', date)
      },
      getEventColor (event) {
        return event.color
      },
      // setToday () {
      //   this.focus = ''
      // },
      prev () {
        console.log('vuelvo a formar next')
        this.$refs.calendar.prev()
      },
      next () {
        console.log('vuelvo a formar next')

        this.$refs.calendar.next()
      },
      //ASIGNA EL OBJETO A MOSTRAR EN EL MENU ALTERNO ****
      showEvent ({ nativeEvent, event }) {
        console.log('vuelvo a formar showEvent')

        const open = () => {
          // DEFINE EL EVENTO SELECCIONADO
          this.selectedEvent = event
          // SELECCIONAR EL ELEMENTO SELECCIONADO
          this.selectedElement = nativeEvent.target
          //TIEMPO QUE TARDA EN ABRIL EL MENÚ
          setTimeout(() => { this.selectedOpen = true  }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false; 
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        if(this.type === 'day'){ return }  // SI SE VE EN MODO DÍA NO ACTUALIZO INFORMACION
        this.fecha1Estatica  = start; this.fecha2Estatica = end;
        // *******************************************
        // *    START.DATE = PRIMER DIA DEL MES;     *
        // *    END.DATE   = ULTIMO DIA DEL MES;     * 
        // *******************************************
        this.consultaSalaJuntas(start.date, end.date)

      },

      consultaSalaJuntas(start, end){
        let events = []; 
        const min = new Date(`${start}T00:00:00`) // PRIMERO DIA DEL MES 
        const max = new Date(`${end}T23:59:59`) // ULTIMO DIA DEL MES 
        const days = (max.getTime() - min.getTime()) / 86400000 // CANTIDAD DE DIAS QUE TIENE EL MES
        // GENERO CONSULTA DE SALA RESERVADA
        const payload = { id_sucursal: this.sucursal.id, fecha1: min , fecha2: max}
        this.$http.post('sala.juntas', payload).then(response =>{
          for (const i in response.body) {
            events.push({
              name: response.body[i].concepto, // NOMBRE A MOSTRAR
              start: response.body[i].fecha + " " + response.body[i].hora, // INICIO DEL COMPROMISO
              end: response.body[i].fecha   + " " + response.body[i].hora2,// FIN DEL COMPROMISO
              color: this.colors[this.rnd(0, this.colors.length - 1)], // COLOR ASIGNADO AL EVENTO
              usuario: response.body[i].nomusuario, // INICIO DEL COMPROMISO
              hora1: response.body[i].hora,
              hora2:response.body[i].hora2,
              timed: !this.rnd(0, 3) === 0,
            });
          }
          this.events =  events;
        }).catch(error => {
          console.log('error', error)
        })
      },

      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>