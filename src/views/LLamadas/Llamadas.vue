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
			        label="Buscar llamada"
			        single-line
			        hide-details
			      ></v-text-field>
			      <v-spacer></v-spacer>
						<v-btn dark color="green" @click="ImprimirExcel()">
							<v-icon >mdi-microsoft-excel </v-icon>
						</v-btn>
			      <v-btn  class="celeste" dark @click="abrirModal(1)">Nuevo Registro </v-btn>
			      <v-btn small class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>

			    </v-card-actions>
			    <v-data-table
			      :headers="headers"
			      :items="getLlamadas"
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

			    	<template v-slot:item.action="{ item }" > 
			    		<v-btn  class="celeste" icon dark @click="abrirModal(2, item)"><v-icon> create </v-icon></v-btn> 
				    </template>

						<template v-slot:item.fecha="{item}">
							<span> {{  moment(item.fecha).format('LL') }} </span>
						</template>

			    </v-data-table>
			  </v-card>
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
				
				 <v-dialog persistent v-model="dialog" width=600 >	
		    	<v-card class="pa-5">
		    		<controlLlamadas :modoVista="modoVista" :parametros="parametros" @modal="dialog = $event" @recarga="recarga = $event"/>
		    	</v-card>
		    </v-dialog>
  		</v-col>
  	</v-row>
  </v-main>
</template>

<script>
	import controlLlamadas from '@/views/LLamadas/controlLlamadas.vue'
	import {mapGetters, mapActions} from 'vuex';
	import  ExcelExport from '@/mixins/ExcelExport.js';
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import moment from 'moment'
  moment.locale('es');

	export default {
		mixins:[ExcelExport, SelectMixin],
		components: {
			controlLlamadas
		},
		data () {
				return {
					titulo: 'Registro de llamadas telefónicas',
					recarga: 0,
					page: 0,
					pageCount: 0,
					itemsPerPage: 100,
					search: '',
					dialog: false,
					modoVista: 0,
					parametros:'',
					headers:[
            { text: 'Nombre y Apellido' , align: 'left'  , value: 'nombre'	 },
						{ text: 'De donde marca'    , align: 'left'  , value: 'dedonde'  },
						{ text: 'Motivo'    				, align: 'left'  , value: 'motivo'   },
						{ text: 'Telfono'     			, align: 'left'  , value: 'telefono' },
						{ text: 'Correo' 	    			, align: 'left'  , value: 'correo'   },
						{ text: 'Fecha' 	          , align: 'left'  , value: 'fecha'    },
						{ text: 'Hora' 	            , align: 'left'  , value: 'hora'     },
						{ text: ''  			    			, align: 'right' , value: 'action', sortable: false },

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
				this.init();
			},

			computed:{
				...mapGetters('LLamadas' ,['Loading','getLlamadas']), // IMPORTANDO USO DE VUEX  (GETTERS)
				...mapGetters('Login'    ,['getdatosUsuario']),       // IMPORTANDO USO DE VUEX  (GETTERS)
			},

			watch:{
				date(){ this.init() },
				date2(){ this.init() },
				recarga(){ this.init() },
				sucursal(){ this.init()}

			},

			methods:{

				...mapActions('LLamadas'  ,['consultarLlamadas']), // IMPORTANDO USO DE VUEX (ACCIONES)

				init(){
					const payload = { id_sucursal: this.sucursal.id, fecha1: this.date , fecha2: this.date2}
					this.consultarLlamadas(payload) 
				},

				ImprimirExcel(){
					let tHeaders=[], tValores= [];
					for(let j =0;j< this.headers.length; j++){
						tHeaders.push(this.headers[j].text);
						tValores.push(this.headers[j].value);
					}
					let tInformacion = this.getLlamadas
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
