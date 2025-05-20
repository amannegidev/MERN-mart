import UserMenu from "../../components/layouts/UserMenu"
import Layout from "../../components/layouts/Layout";
import { useAuth } from "../../context/auth";



function UserDashboard() {
    const [auth] = useAuth();
    return (
        <Layout>
          <div className="flex flex-col  md:flex-row gap-6 px-4 py-4">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <UserMenu />
            </div>
      
            {/* User Info */}
            <div className="w-full md:w-3/4 bg-green-200 rounded-lg  p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">User Details</h2>
              <div className="space-y-3 text-gray-700 border p-4 rounded">
                <p>
                  <span className="font-medium">Name:</span> {auth?.user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {auth?.user.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {auth?.user.phone}
                </p>
              </div>
            </div>
          </div>
        </Layout>
      );
      
}

export default UserDashboard;