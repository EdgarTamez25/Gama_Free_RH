import Vue from 'vue'
import  SelectMixin from '@/mixins/SelectMixin.js';
import moment from 'moment'


export default{
  mixins:[SelectMixin],
	namespaced: true,
	state:{
		accesos: [],
		accesos_all:[],
		loading: true,

	},

	mutations:{
		ACCESOS(state, data){
			state.accesos = data
		},
		ACCESOSALL(state, data){
			state.accesos_all = data
		},
		LOADING(state, data){
			state.loading = data; 
		},
	},
	actions:{
		consultarAccesos({commit}, id_sucursal){
			// Limpio Arreglo y Genero Consulta
			commit('ACCESOS', []);
			Vue.http.get('accesos/'+ id_sucursal).then(response=>{
				commit('ACCESOS', response.body)
			}).catch((error)=>{
				console.log('error',error)
			})
		},

		consultarAccesosAll({commit}, payload){
			// Limpio Arreglo y Genero Consulta
			commit('ACCESOSALL', []);commit('LOADING',true);
			Vue.http.post('accesos.all',payload).then(response=>{
				commit('ACCESOSALL', response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(() => commit('LOADING', false)) 
		},

    registraPermiso({ dispatch }, payload){
      Vue.http.post('rh.acceso',payload).then(response=>{
        dispatch('consultarAccesos', payload.id_sucursal);
      }).catch((error)=>{
        console.log('error',error)
      })
    },


	
  },

	getters:{
		getAccesos(state){
		  return state.accesos
		},
		getAccesosAll(state){
		  return state.accesos_all
		},
		Loading(state){
			return state.loading
		},

	}
}