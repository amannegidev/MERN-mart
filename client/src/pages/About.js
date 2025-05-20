import Layout from "../components/layouts/Layout";

function About() {
    return (
       <Layout>
            <div className="w-10/12 mx-auto d-flex justify-center items-center mt-24 bg-purple-700 rounded" style={{ height: 450 }} >
                <div className="bg-slate-100 p-10 rounded" >
                    <h1 className="text-lg text-green-900 font-[ubuntu]">This Is about Page</h1>
                </div>
            </div>
       </Layout>
    )
};

export default About;