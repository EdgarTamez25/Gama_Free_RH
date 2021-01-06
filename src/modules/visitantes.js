import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		visitantes: [],
		visitantesAll: [],
		loading: true,
	},

	mutations:{
		VISITANTES(state, data){
			state.visitantes = data
		},
		VISITANTESALL(state, data){
			state.visitantesAll = data
		},
		LOADING(state, data){
			state.loading = data; 
		},
	},
	actions:{
		consultarVisitantes({commit}, id_sucursal){
			// Limpio Arreglo y Genero Consulta
			commit('VISITANTES', [])
			Vue.http.get('visitantes/'+ id_sucursal).then(response=>{
				commit('VISITANTES', response.body)
			}).catch((error)=>{
				console.log('error',error)
			})
		},

		consultarVisitantesAll({commit},payload){
			// Limpio Arreglo y Genero Consulta
			commit('VISITANTESALL', []);commit('LOADING',true);
			Vue.http.post('visitantes.all', payload).then(response=>{
				commit('VISITANTESALL', response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(() => commit('LOADING', false)) 
		},
	
  },

	getters:{
		getVisitantes(state){
		  return state.visitantes
		},
		getVisitantesAll(state){
		  return state.visitantesAll
		},
		Loading(state){
			return state.loading
		},
	}
}