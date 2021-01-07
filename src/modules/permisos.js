import Vue from 'vue'

export default{
	namespaced: true,
	state:{
    permisos: [],
		loading: true,
	},

	mutations:{
		PERMISOS(state, data){
			state.permisos = data
    },
    LOADING(state, data){
			state.loading = data; 
		},
	},
	actions:{
		consultarPermisos({commit}, payload){
			// Limpio Arreglo y Genero Consulta
			commit('PERMISOS', []); commit('LOADING',true);
			Vue.http.post('permisos', payload).then(response=>{
				commit('PERMISOS', response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(() => commit('LOADING', false)) 
		},
	
  },

	getters:{
		getPermisos(state){
		  return state.permisos
    },
    
    Loading(state){
			return state.loading
		},

	}
}