<template >
  <v-container >
  	<v-row  class="justify-center">
  		<v-col cols="10">
  			<v-card class="pa-4 elevation-12" color="">

  				<v-row>
  					<v-col cols="4">
  						<img src="http://producciongama.com:8080/IMAGENES/logotipo2.png" width="90px">
  					</v-col>	
  					<v-col cols="8 ">
  						<div class="title">REGISTRO DE ASISTENCIA</div>
  					</v-col>
	  			</v-row>

  				<v-row cols="12">
  					<v-col cols="8">
  						<v-select
								v-model="curso"
			          :items="Curso"
			          label="CURSO / JUNTA"
			          outlined
			          dense
			          hide-details
								append-icon="description"
			        ></v-select>
  					</v-col>
  					
  					<v-col cols="4" >
				      <v-dialog
				        ref="dialog"
				        v-model="modal"
				        :return-value.sync="date"
				        persistent
				        width="290px"
				      >
				        <template v-slot:activator="{ on }">
				          <v-text-field
				            v-model="date"
				            label="FECHA"
				            append-icon="event"
				            readonly
				            v-on="on"
				            outlined
				            dense
				            hide-details
				          ></v-text-field>
				        </template>
				        <v-date-picker v-model="date" scrollable locale="es-es" color="pink lighten-1">
				          <v-spacer></v-spacer>
				          <v-btn text color="error" @click="modal = false">Cancel</v-btn>
				          <v-btn dark color="pink lighten-1" @click="$refs.dialog.save(date)">OK</v-btn>
				        </v-date-picker>
				      </v-dialog>
				    </v-col>

				    <v-col cols="8">
  						<v-select
								v-model="instructor"
			          :items="instructores"
			          label="INSTRUCTOR"
			          outlined
			          dense
			          hide-details
								append-icon="face"
			        ></v-select>
  					</v-col>

				    <v-col cols="4">
  						<v-text-field
		            label="DURACION "
		            dense
		            outlined
		            hide-details
								v-model.number="duracion"
								type="number"
								clearable
								append-icon="query_builder"
		          ></v-text-field>
  					</v-col>
  				</v-row>

  				<v-divider ></v-divider>

  				<v-card-actions>
  					<v-spacer></v-spacer>
  						<v-dialog v-model="dialog" persistent max-width="600px">
					      <template v-slot:activator="{ on }">
		  						<v-btn color="success" outlined small v-on="on">Agregar Miembro</v-btn>	
					      </template>

					      <v-card>
					        <v-card-title>
					          <span class="headline">Añadir miembro</span>
					        </v-card-title>
					        <v-divider></v-divider>
					        <v-card-text>
					          <v-container>
					            <v-row>
					              
					              <v-col cols="12" sm="6">
					                <v-select
					                  :items="area"
					                  label="Area de trabajo"
														v-model ="area"
					                ></v-select>
					              </v-col>
					              <v-col cols="12" sm="6">
					                <v-autocomplete
					                  :items="Empleados"
					                  label="Nombre del empleado"
														v-model="empleado"
					                ></v-autocomplete>
					              </v-col>

												<v-col cols="12">
													<v-card flat >
														<strong>INGRESE SU FIRMA POR FAVOR.</strong>
														<VueSignaturePad
															id="canvas"
															height="250px"
															ref="signaturePad"
														/> 
													</v-card>
												</v-col>
					            </v-row>
					          </v-container>

					        </v-card-text>

					        <v-card-actions>
					          <v-spacer></v-spacer>
					          <v-btn color="error darken-1" text small @click="undo">Cancelar</v-btn>
					          <v-btn color="green darken-1" dark small @click="save" >Agregar</v-btn>
					        </v-card-actions>
					      </v-card>
					    </v-dialog>
  				</v-card-actions>

          <v-card outlined >
            <v-data-table
              :headers="headers"
              :items="desserts"ñ
              :items-per-page="5"
              hide-default-footer
              fixed-header
            >
              <template v-slot:item.action="{ item }">
                <v-icon  color="success" class="mr-2" @click="edit(item,'editar')" >edit</v-icon>
              </template> 
            </v-data-table>
          </v-card>
  			</v-card>
  		</v-col>
  	</v-row>
  </v-container>
</template>

<script>
// import VueSignaturePad from 'vue-signature-pad';

export default {
  components: {
    // VueSignaturePad
  },
  data: () => ({
		curso: '',
		instructor: '',
		duracion:0,
    date: new Date().toISOString().substr(0, 10),
		empleado: '',
		area: '', 

  	dialog: false,
    Curso: ['Junta Diaria','Sistemas','Ventas','Induccion Nomida', 'Induccion ISO 4000'],
    instructores:['Edgar Tamez','Angel Escajeda'],
    area: ['Desarrollo','Diseño','Ventas','Nomina'],
		Empleados: ['Edgar Tamez','Angel Escajeda','Roberto Hernandez'],
		
    menu: false,
    modal: false,

    headers: [
          { text: 'Area'  , value: 'area', align: 'left', },
          { text: 'Nombre', value: 'nombre', align: 'left', },
					{ text: 'Firma' , value: 'firma' },
					{ text: '', value: 'action', sortable: false },
    ],
    desserts: [
	    {
	      area: 'Ventas',
	      nombre:'Hector Rodriguez',
	      firma: 'OK'
	    },
	    {
	      area: 'Nomina',
	      nombre:'Nadia Perez',
	      firma: 'OK'
	    },
		]
	}),
	
	methods:{
		edit(){
			console.log('EDITAR')
		},

		undo(){
				this.dialog = false
        this.$refs.signaturePad.undoSignature();
		},

		save() {
			const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
			console.log(isEmpty)
			const url = data;
			//Verificamos que tenga una firma
			if(url === undefined){
				//Se activan las alertas
				this.msg = 'No has agregado una firma'
				this.color = 'red'
				this.snackbar = true
			}else{
				fetch(url)
					//se obtiene la respuesta y se convierte la respuesta a blob
					.then(res => res.blob())
					//se hace una consulta al resultado de la converción 
					.then(blob => {
						// se crea ubjeto de tipo archivo y se le agrega el nombre
						const file = new File([blob], 'FirmaDigital' + '.png')
						console.log('file',file)
						//Prepara objeto a enviar
						let formData = new FormData();
						console.log('formData',formData)
						//se crea el objeto y se le agrega como un apendice el archivo 
						formData.append('file',file);

						const payload = { area: this.area, empleado: this.empleado, firma:formData }
						console.log('payload', payload)
						//Se guarda la firma en el modulo
						// this.saveFirma({form: formData})
						// this.saveFirma({form: formData, data: file })
						//Ahora lo mandamos a la vista de las fotos
						// this.$router.push({name:'fotos'})

					})
			}
			//se hace una consulta al url
		}
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
