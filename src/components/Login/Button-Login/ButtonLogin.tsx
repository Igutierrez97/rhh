
export default function ButtonLogin( {isloading}:{isloading:boolean}){
    return(
        isloading ? <button className="btn">
        <span className="loading loading-spinner"></span>
        Cargando
      </button>:<button className="btn w-[131px] bg-blue-600 text-white">Iniciar Sesion</button>    
    )
}