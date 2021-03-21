import Vue from 'vue'

export default{
	namespaced: true,
	state:{
		login:false,
		datosUsuario:[],
		auth: true,
		sistemas:[],

	},

	mutations:{
		LOGEADO(state, value){
			state.login = value
		},
		AUTHENTICAR(state, value){
			// console.log('autenticar', value)
			state.auth = value
		},
		DATOS_USUARIO(state, datosUsuario){
			state.datosUsuario = datosUsuario
		},
		SISTEMAS(state, data){
			state.sistemas = data
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
						// console.log('response', response.body[0]);
					}else{
						resolve(false)
						commit('AUTHENTICAR', true)
					}
			  }).catch((error)=>{
					reject(error)
				})
			})
		},

		validaSession(){
			return new Promise((resolve, reject) => {
				const payload = new Object();
              payload.id = localStorage.getItem("KeyLogger")
				Vue.http.post('valida.sesion.activa', payload).then(response =>{
					// console.log('VALIDACION', response.body)
					resolve(response.body[0])
				}).catch( error =>{
					console.log('valida error', error)
					reject(error)
				})
			});
		},

		ObtenerDatosUsuario({commit},payload){
			return new Promise((resolve, reject) => {
				Vue.http.post('obtener.datos.usuario',payload ).then(response =>{
					resolve(response.body.datosUsuario)
					commit('DATOS_USUARIO', response.body.datosUsuario );
					commit('SISTEMAS'     , response.body.sistemas);
					commit('LOGEADO', true);
				}).catch( error =>{
					console.log('valida error', error.body)
					reject(error)
				})	
			});
			
		},

		authenticar({commit}, estatus){
			commit('AUTHENTICAR', estatus)
		},
		
		salirLogin({commit}){
			commit('AUTHENTICAR', true);
			commit('LOGEADO', false);
			commit('SALIR');

			const payload = new Object();
						payload.id = localStorage.getItem("KeyLogger");
			Vue.http.post('cerrar.sesion', payload ).then( res =>{
				console.log('SE CERRO CON EXITO');
			})
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

		getSistemas(state){
			return state.sistemas;
		}
	
	}
}