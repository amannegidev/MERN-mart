import { useState } from "react";


function Policy() {

    const [count, setcount] = useState(0)

    function changecount () {
        setcount(count => count+1)
    }
    
    return(
        <div className="w-10/12 mx-auto d-flex justify-center items-center mt-24 bg-yellow-500 rounded" style={{ height: 450 }} >
            <div className="bg-slate-100 p-10 rounded" >
                <h1 className="text-9xl text-green-900 font-[ubuntu] text-center"> {count}</h1>
                <button className="ring px-5 py-2 rounded-3xl mt-2 text-center" onClick={changecount}>count + 1</button>
            </div>
        </div> 
    )

};

export default Policy;