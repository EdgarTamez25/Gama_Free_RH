import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		login:false,
		datosUsuario:[],
		auth: true,
	},

	mutations:{
		LOGEADO(state, value){
			// console.log('logeado', value)
			state.login = value
		},
		AUTHENTICAR(state, value){
			// console.log('autenticar', value)
			state.auth = value
		},
		DATOS_USUARIO(state, datosUsuario){
			state.datosUsuario = datosUsuario
		},
		SALIR(state){
			state.login = false;
			state.datosUsuario = [];
		},
		SUCURSALES(state, data){
			state.sucusales = data
		},
		
	},

	actions:{
		Authologin({commit},usuario){
			return new Promise((resolve) => {
				commit('AUTHENTICAR', false)
				commit('LOGEADO', true);
				commit('DATOS_USUARIO', usuario );
				resolve(true)
			})
		},

		AuthenticarTemporal({commit}){
			return new Promise( resolve =>{
				commit('AUTHENTICAR', false);
			})
		},
		
    Login({commit}, payload){
			return new Promise((resolve, reject) => {
			  Vue.http.post('login.permisos', payload).then(response =>{
					// console.log('LOGIN', response.body[0])
					if(response.body.length){
						resolve(true)
						commit('AUTHENTICAR', false)
						commit('LOGEADO', true);
						commit('DATOS_USUARIO', response.body[0]);
						console.log('response', response.body[0]);
					}else{
						resolve(false)
						commit('AUTHENTICAR', true)
					}
			  }).catch((error)=>{
					reject(error)
				})
			})
		},

		authenticar({commit}, estatus){
			commit('AUTHENTICAR', estatus)
		},
		salirLogin({commit}){
			// this.$store.dispatch("salir")
			commit('AUTHENTICAR', true)
			commit('SALIR')
		},
	
	},

	getters:{
		getLogeado(state){
		  return state.login
		},
		getdatosUsuario(state){
			return state.datosUsuario;
		},
		auth(state){
			return state.auth;
		},
	
	}
}