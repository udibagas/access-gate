import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-screen flex justify-center items-center bg-[#f0f2f5] m-0">
      <div className="flex justify-center items-stretch">
        <div className="p-6 bg-white">
          <Outlet />
        </div>
        <div className="text-center w-[300px] bg-[#0C74B6] text-white p-4 flex flex-col justify-around">
          <div>
            <div className="text-2xl font-bold mb-0">Access Gate</div>
          </div>
          <small>© {new Date().getFullYear()}</small>
        </div>
      </div>
    </div>
  );
};