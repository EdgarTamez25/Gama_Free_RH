<template>
  <v-row>
    <v-card-text class="text-h5 pa-4"> Buscar Usuario </v-card-text> 
    <v-col cols="12" >  
      <v-autocomplete
        :items="usuarios" v-model="usuario" item-text="nombre" item-value="id" label=" Usuario" return-object
        placeholder=" Usuario" outlined  hide-details color="celeste" append-icon="persons" 
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" v-if="usuario.id" class="text-center" > 
      <span class="text-h5">  El número de empledo es:  </span><br><br>
      <v-btn dark fab color="rosa" large>
        <span class="text-h5"> {{ usuario.id}}  </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
	import  SelectMixin from '@/mixins/SelectMixin.js';
	import {mapGetters, mapActions} from 'vuex';
  
  export default {
		mixins:[SelectMixin],
    data:()=>({
      usuarios: [],
      usuario: { id:null, nombre:'',correo:'',},
    }),

    created(){
      this.consultaUsuarios();
    },
    methods:{

    },
    watch:{
      usuario(){
        
      }
    }
  }
</script>