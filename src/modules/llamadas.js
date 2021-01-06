import Vue from 'vue'

export default{
	namespaced: true,
	state:{
    llamadas: [],
		loading: true,
	},

	mutations:{
		LLAMADAS(state, data){
			state.llamadas = data
    },
    LOADING(state, data){
			state.loading = data; 
		},
	},
	actions:{
		consultarLlamadas({commit}, payload){
			// Limpio Arreglo y Genero Consulta
			commit('LLAMADAS', []); commit('LOADING',true);
			Vue.http.post('llamadas', payload).then(response=>{
				commit('LLAMADAS', response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(() => commit('LOADING', false)) 
		},
	
  },

	getters:{
		getLlamadas(state){
		  return state.llamadas
    },
    
    Loading(state){
			return state.loading
		},

	}
}