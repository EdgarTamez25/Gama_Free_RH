
export default {
	methods: {

		traerFechaActual(){
			var f = new Date(); 
			return f.getFullYear() +'-'+ (f.getMonth() + 1 < 10? '0' + (f.getMonth() + 1): f.getMonth() + 1 ) +'-'+ (f.getDate()<10?'0'+f.getDate():f.getDate());
		},

		traerHoraActual(){
			var f = new Date(); 
			return (f.getHours()<10? '0'+f.getHours(): f.getHours()) + ':' + (f.getMinutes()<10? '0'+ f.getMinutes(): f.getMinutes())
		},

		traerMesActual(){
			var f = new Date();
			var primerDia = new Date(f.getFullYear(), f.getMonth(), 1).toISOString().substr(0, 10);
			var ultimoDia = new Date(f.getFullYear(), f.getMonth() + 1, 0).toISOString().substr(0, 10);
			const fecha = { fechaInicial: primerDia , fechaFinal: ultimoDia}
			return fecha;
		},
	
		consultaUsuarios(){
			this.$http.get('usuarios').then(response =>{
				this.usuarios = response.body
			}).catch(err =>{
				console.log('err', err)
			})
		},

		consultaSucursales(){
			this.$http.get('sucursales').then(response =>{
				this.sucursales = response.body
			}).catch(err =>{
				console.log('err', err)
			})
		},
		
		consultar_Clientes(){  // AUTOCOMPLETE -> CLIENTES
			this.$http.get('clientes.selector').then((response)=>{
				this.clientes = response.body //LLENNO ARRAY
			}).catch(error =>{
				console.log('error', error)
			})
		},
	}
}