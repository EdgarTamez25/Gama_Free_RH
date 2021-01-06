import Vue from 'vue'

export default{
	namespaced: true,
	state:{
    juntas: [],
		loading: true,
	},

	mutations:{
		JUNTAS(state, data){
			state.juntas = data
    },
    LOADING(state, data){
			state.loading = data; 
		},
	},
	actions:{
		consultarJuntas({commit}, payload){
			// Limpio Arreglo y Genero Consulta
			commit('JUNTAS', []); commit('LOADING',true);
			Vue.http.post('sala.juntas', payload).then(response=>{
				commit('JUNTAS', response.body)
			}).catch((error)=>{
				console.log('error',error)
			}).finally(() => commit('LOADING', false)) 
		},
	
  },

	getters:{
		getJuntas(state){
		  return state.juntas
    },
    
    Loading(state){
			return state.loading
		},

	}
}