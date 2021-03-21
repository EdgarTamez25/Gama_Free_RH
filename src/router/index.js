import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import RH_Acceso    from '@/views/RhAcceso/rh_acceso.vue'
// import Home         from '@/views/Home.vue'
import RH_Visitante from '@/views/RhAcceso/rh_visitante.vue'
import Permisos     from '@/views/Permisos/permisos.vue'
import ES           from '@/views/Permisos/entrada.salida.vue'
import Visitantes   from '@/views/Permisos/visitantes.vue'
import Llamadas     from '@/views/LLamadas/Llamadas.vue'
import Registro     from '@/views/LLamadas/controlLlamadas.vue'
import Juntas       from '@/views/Juntas/Juntas.vue'
import Calendario       from '@/views/Juntas/calendario.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/'              , name: 'rh.acceso'     , component: RH_Acceso     , meta: { libre:true, ADMIN:true , RH:true } },
  // { path: '/inicio'        , name: 'inicio'          , component: Home     , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/visitante'         , name: 'rh.visitante'      , component: RH_Visitante  , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/permiso.salida'    , name: 'permiso.salida'    , component: Permisos      , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/entrada.salida'    , name: 'entrada.salida'    , component: ES            , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/visitantes'        , name: 'visitantes'        , component: Visitantes    , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/llamadas'          , name: 'llamadas'          , component: Llamadas      , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/registro.llamadas' , name: 'registro.llamadas' , component: Registro      , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/programa.juntas'   , name: 'programa.juntas'   , component: Juntas        , meta: { libre:false, ADMIN:true , RH:true } },
  { path: '/calendario'        , name: 'calendario'        , component: Calendario  , meta: { libre:true, ADMIN:true , RH:true }  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next) => {

  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if(store.state.Login.datosUsuario.nivel === 1){
    if(to.matched.some(record => record.meta.ADMIN)){
      next()
    }
  }else if(store.state.Login.datosUsuario.nivel === 7){
    if(to.matched.some(record => record.meta.RH)){
      next()
    }
  }else{
    // store.state.Login.datosUsuario.auth = true;
    next({  name: 'rh.acceso' })
  }
})

export default router
