<template>
  <v-main class="pa-0 ma-3">
  	<v-row justify="center">
  		<v-col cols="12" > 
				<v-card-actions class="font-weight-black headline"> {{ titulo }} </v-card-actions>
				
				<v-row>
					<v-col cols="6" sm="4" md="3" xl="2">
						<v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
							      transition="scale-transition" offset-y min-width="290px" color="celeste">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="date" label="Fecha desde" prepend-icon="event" readonly v-bind="attrs"
									v-on="on" outlined dense hide-details
								></v-text-field>
							</template>
							<v-date-picker v-model="date" no-title scrollable color="celeste">
								<v-spacer></v-spacer>
								<v-btn text color="gris" @click="menu = false">Cancel</v-btn>
								<v-btn dark color="rosa" @click="$refs.menu.save(date)">OK</v-btn>
							</v-date-picker>
						</v-menu>
					</v-col>
				
					<v-col cols="6" sm="4" md="3" xl="2">
						<v-menu ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="date2"
							      transition="scale-transition" offset-y min-width="290px" color="celeste">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="date2" label="Fecha hasta" prepend-icon="event" readonly v-bind="attrs"
									v-on="on" outlined dense hide-details
								></v-text-field>
							</template>
							<v-date-picker v-model="date2" no-title scrollable color="celeste">
								<v-spacer></v-spacer>
								<v-btn text color="gris" @click="menu2 = false">Cancel</v-btn>
								<v-btn dark color="rosa" @click="$refs.menu2.save(date2)">OK</v-btn>
							</v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" sm="4" md="3" xl="2">
						<v-select 
              v-model="sucursal" :items="sucursales" item-text="nombre" item-value="id" outlined
              label="Sucursales" return-object hide-details dense
            ></v-select>
					</v-col>
				</v-row>

				<v-card class=" mt-3" outlined >
					<v-card-actions>
			      <v-text-field
			        v-model="search"
			        append-icon="search"
			        label="Buscar"
			        single-line
			        hide-details
			      ></v-text-field>
			      <v-spacer></v-spacer>
			      <v-spacer></v-spacer>
						<v-btn dark color="green" @click="ImprimirExcel()">
							<v-icon >mdi-microsoft-excel </v-icon>
						</v-btn>
			      <v-btn  class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>
			    </v-card-actions>
			    <v-data-table
			      :headers="headers"
			      :items="getVisitantesAll"
			      :search="search"
			      fixed-header
						height="550px"
						hide-default-footer
						:loading ="Loading"
						loading-text="Cargando... Por favor espere."
						:page.sync="page"
      			:items-per-page="itemsPerPage"
						@page-count="pageCount = $event"
						dense
			    >
			    	<!-- <template v-slot:item.action="{ item }" > 
			    		<v-btn  class="celeste" icon dark @click="abrirModal(2, item)"><v-icon> create </v-icon></v-btn> 
				    </template> -->
						<template v-slot:item.fecha1="{item}">
							<span> {{ moment(item.fecha1).format('LL') }} </span>
						</template>
            <template v-slot:item.fecha2="{item}">
							<span v-if="item.fecha2"> {{ moment(item.fecha2).format('LL') }} </span>
							<span v-else> <b style="color:red"> Sin registrar entrada </b> </span>
						</template>

             <template v-slot:item.hora2="{item}">
							<span v-if="item.hora2"> {{ item.hora2 }} </span>
							<span v-else> <b style="color:red"> Sin registrar entrada </b> </span>
						</template>
			    </v-data-table>

			  </v-card>
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
				 <!-- <v-dialog persistent v-model="dialog" width=1000 >	
		    	<v-card class="pa-5">
		    		<ControlPermisos :modoVista="modoVista" :parametros="parametros" @modal="dialog = $event" />
		    	</v-card>
		    </v-dialog> -->
  		</v-col>
  	</v-row>
  </v-main>
</template>

<script>
	// import ControlPermisos  from '@/views/Permisos/controlPermisos.vue';
	import {mapGetters, mapActions} from 'vuex';
	import  ExcelExport from '@/mixins/ExcelExport.js';
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import moment from 'moment'
  moment.locale('es');

	export default {
		mixins:[ExcelExport,SelectMixin],
		components: {
			// ControlPermisos
		},
		data () {
				return {
					titulo:'VISITANTES',
					page: 0,
					pageCount: 0,
					itemsPerPage: 100,
					search: '',
					dialog: false,
					modoVista: 0,
					parametros:'',
					headers:[
										{ text: 'Visitante'    , align: 'left'  , value: 'nombre' },
										{ text: 'Empresa'      , align: 'left'  , value: 'empresa' },
										{ text: 'Concepto'     , align: 'left'  , value: 'concepto' },
										{ text: 'Dirigido con' , align: 'left'  , value: 'nomuser' },
										{ text: 'Temperatura ' , align: 'left'  , value: 'temperatura' },
										{ text: 'Fecha visita' , align: 'left'  , value: 'fecha1' },
										{ text: 'Fecha salida' , align: 'left'  , value: 'fecha2' },
										{ text: 'Hora Entrada' , align: 'left'  , value: 'hora1' },
										{ text: 'Hora Salida'  , align: 'left'  , value: 'hora2' },
										{ text: ''  			     , align: 'right' , value: 'action', sortable: false },
									],
					sucursales: [],
					sucursal: { id:null, nombre:''},
					date: new Date().toISOString().substr(0, 10),
					menu: false,
					date2: new Date().toISOString().substr(0, 10),
					menu2: false,
				}
			},

			created(){
				this.consultaSucursales()
				this.sucursal = { id    : this.getdatosUsuario.id_sucursal, 
													nombre: this.getdatosUsuario.sucursal}
				this.init()  
			},

			watch:{
				date(){ this.init() },
				date2(){ this.init() },
				sucursal(){ this.init()}
			},

			computed:{
				...mapGetters('Visitantes' ,['Loading','getVisitantesAll']), 
				...mapGetters('Login',['getdatosUsuario']),
			},

			methods:{
      ...mapActions('Visitantes',['consultarVisitantesAll']),

				init(){
					const payload = { id_sucursal: this.sucursal.id ,fecha1: this.date , fecha2: this.date2}
					this.consultarVisitantesAll(payload) 
				},

				ImprimirExcel(){
					let tHeaders=[], tValores= [];
					for(let j =0;j< this.headers.length; j++){
						tHeaders.push(this.headers[j].text);
						tValores.push(this.headers[j].value);
					}
					let tInformacion = this.getVisitantesAll
					this.manejarDescarga(this.titulo,tHeaders,tValores,tInformacion)
				},

				abrirModal(action, items){
					this.modoVista = action;
					this.parametros = items;
					this.dialog = true;
				},
			}
	}
</script>
