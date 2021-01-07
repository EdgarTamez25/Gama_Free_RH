<template>
  <v-main class="pa-0 ma-3">
  	<v-row justify="center">
  		<v-col cols="12" > 
				<v-card-actions class="font-weight-black headline"> INCIDENCIA NÓMINA DE PERSONAL </v-card-actions>

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
			        label="Buscar permiso"
			        single-line
			        hide-details
			      ></v-text-field>
			      <v-spacer></v-spacer>
			      <v-btn small class="celeste" dark @click="abrirModal(1)">Agregar </v-btn>
			      <v-btn small class="gris" icon dark @click="init()" ><v-icon>refresh</v-icon> </v-btn>

			    </v-card-actions>
			    <v-data-table
			      :headers="headers"
			      :items="getPermisos"
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
						<template v-slot:item.tipo_permiso="{ item }" > 
							<span>{{ tipos[item.tipo_permiso-1].nombre}}</span>
				    </template>

			    	<template v-slot:item.action="{ item }" > 
			    		<v-btn  class="celeste" icon dark @click="abrirModal(2, item)"><v-icon> create </v-icon></v-btn> 
				    </template>

						<template v-slot:item.fecha="{item}">
							<span> {{  moment(item.fecha).format('LL') }} </span>
						</template>

						<template v-slot:item.estatus="{ item }" > 
			    		<v-btn  class="green" icon dark  v-if="item.estatus===1" @click="cambiaEstatus(item)">
								<v-icon> person </v-icon>
							</v-btn> 
							<v-btn  class="error" icon dark v-else @click="cambiaEstatus(item)">
								<v-icon> mdi-account-off </v-icon>
							</v-btn> 
				    </template>

			    </v-data-table>

			  </v-card>
				<!-- PAGINACION -->
				<div class="text-center pt-2">
					<v-pagination v-model="page" :length="pageCount"></v-pagination>
				</div>
				
				 <v-dialog persistent v-model="dialog" width=1000 >	
		    	<v-card class="pa-5">
		    		<ControlPermisos :modoVista="modoVista" :parametros="parametros" @modal="dialog = $event" />
		    	</v-card>
		    </v-dialog>
  		</v-col>
  	</v-row>
  </v-main>
</template>

<script>
	import ControlPermisos  from '@/views/Permisos/controlPermisos.vue';
	import {mapGetters, mapActions} from 'vuex';
	import  ExcelExport from '@/mixins/ExcelExport.js';
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import moment from 'moment'
  moment.locale('es');

	export default {
		mixins:[ExcelExport,SelectMixin],
		components: {
			ControlPermisos
		},
		data () {
				return {
					titulo: 'Incidencia nóminal de personal',
					tipos:[{id:1, nombre:'Permiso con goce'},
								 {id:2, nombre:'Permiso sin goce'},
								 {id:3, nombre:'Registro de Entrada / Salida'},
								 {id:4, nombre:'Permiso para salir y regresar'},
								 {id:5, nombre:'Permiso de llegar tarde'},
								 {id:6, nombre:'Permiso de salir temprano'}, 
								],
					page: 0,
					pageCount: 0,
					itemsPerPage: 100,
					search: '',
					dialog: false,
					modoVista: 0,
					parametros:'',
					headers:[
            { text: 'N° Empleado' , align: 'left'  , value: 'id_usuario'		  },
						{ text: 'Empleado'    , align: 'left'  , value: 'nombre' },
						{ text: 'Permiso'     , align: 'left'  , value: 'tipo_permiso' },
						{ text: 'Fecha' 	    , align: 'left'  , value: 'fecha' },
						{ text: ''  			    , align: 'right' , value: 'action', sortable: false },

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
				...mapGetters('Permisos'  ,['Loading','getPermisos']), // IMPORTANDO USO DE VUEX  (GETTERS)
				...mapGetters('Login'  ,['getdatosUsuario']), // IMPORTANDO USO DE VUEX  (GETTERS)
			},

			watch:{
				date(){ this.init() },
				date2(){ this.init() },
				sucursal(){ this.init()}
			},

			methods:{

				...mapActions('Permisos'  ,['consultarPermisos']), // IMPORTANDO USO DE VUEX (ACCIONES)

				init(){
					const payload = { id_sucursal: this.sucursal.id,fecha1: this.date , fecha2: this.date2}
					this.consultarPermisos(payload) 
				},

				abrirModal(action, items){
					this.modoVista = action;
					this.parametros = items;
					this.dialog = true;
				},

				// ImprimirExcel(){
				// 	let tHeaders = ['Empleado','Nombre','Permiso','Motivo','Fecha 1','Fecha 2','Hora 1','Hora 2'];
				// 	let tValores = ['id_usuario','empleado','permiso','motivo','fecha1','fecha2','hora1','hora2']
				// 	const tInformacion = [];
				// 	for(let i=0;i < this.getPermisos.length; i++){
				// 		tInformacion.push({id_usuario: this.getPermisos[i].id_usuario, 
				// 											 empleado  : this.getPermisos[i].nombre,
				// 											 permiso   : this.tipos[this.getPermisos[i].tipo_permiso -1].nombre,
				// 											 fecha1    : moment(this.getPermisos[i].fecha1).format('LL'),
				// 											 fecha2    : moment(this.getPermisos[i].fecha2).format('LL'),
				// 											 hora1     : this.getPermisos[i].hora1 > 12? this.getPermisos[i].hora1 + 'p.m.': this.getPermisos[i].hora1+'a.m.',
				// 											 hora2		 : this.getPermisos[i].hora2 > 12? this.getPermisos[i].hora2 + 'p.m.': this.getPermisos[i].hora2+'a.m.',
				// 											 motivo    : this.getPermisos[i].motivo
				// 											})
				// 	}
				// 	console.log('tInformacion',tInformacion)


				// 	this.manejarDescarga(this.titulo,tHeaders,tValores,tInformacion)
				// },
				
				cambiaEstatus(data){
					const payload = { id: data.id, estatus: !data.estatus };
					this.$http.post('cambia.estatus',payload).then((res)=>{
						const fechas = { fecha1: this.date , fecha2: this.date2}
						this.consultarPermisos(fechas);
					}).catch((err)=>{
						console.log('err', err)
					})
				}
			}
	}
</script>
