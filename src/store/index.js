import Vue from 'vue'
import Vuex from 'vuex'
import router   from '@/router'

Vue.use(Vuex)

import Login from '@/modules/Login.js';
import Visitantes from '@/modules/visitantes.js';
import Accesos    from '@/modules/accesos.js';
import Permisos    from '@/modules/permisos.js';
import LLamadas    from '@/modules/llamadas.js';
import Juntas    from '@/modules/Juntas.js';

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    salir(){
      router.push({name: 'rh.acceso'})
    }
  },
  modules: {
    Login,
    Visitantes,
    Accesos,
    Permisos,
    LLamadas,
    Juntas
  }
})
